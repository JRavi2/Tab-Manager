// If there is no value set for thresholdTIme, appply a default value of two weeks
chrome.storage.sync.get("thresholdTime", data => {
	if (!data.thresholdTime) {
		chrome.storage.sync.set({ thresholdTime: 1209600 });
	}
});

/*
  Prototype for tabList:
  tabList: [
    {
      id: <integer>,
      time: <integer>
    },
    ...
  ]
*/
var tabList = [];

// Add the tabList when a new tab is created
chrome.tabs.onCreated.addListener(tab => {
	tabList.push({ id: tab.id, time: 0 });
});

// Remove the tab from the tabList when the tab is closed
chrome.tabs.onRemoved.addListener(tab_id => {
	tabList = tabList.filter(tab => tab.id !== tab_id);
});

// When the tab becomes active, reset the timer for that tab
chrome.tabs.onActivated.addListener(activeInfo => {
	var id = activeInfo.tabId;
	tabList.forEach(tab => {
		if (tab.id === id) tab.time = 0;
	});
});

// Whenever a tab is updated (i.e. when you goto a different website)
// flag that tab as whitelisted (by assigning the time value of -1)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	// If the tab is fully loaded
	if (
		changeInfo.status === "complete" &&
		tab.status === "complete" &&
		tab.url != undefined
	) {
		var url = new URL(tab.url);
		chrome.storage.sync.get("whitelist", data => {
			if (data.whitelist && data.whitelist.includes(url.host))
				tabList.forEach(tab => {
					if (tab.id === tabId) tab.time = -1;
				});
		});
	}
});

// Increment the time value of all the tabs in the tabList every second
// Except for the whitelisted tabs
// and close a tab if it's time value exceeds the threshold time
async function timeIncrementer() {
	await chrome.storage.sync.get("thresholdTime", function (data) {
		var thresholdTime;
		thresholdTime = data.thresholdTime;
		tabList.forEach(tab => {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				var curr_tab_id = tabs[0].id;
				if (curr_tab_id === tab.id)
					// Don't increase time for the current tab i.e. the active tab
					return;
				if (tab.time != -1) tab.time += 1;
				if (tab.time >= thresholdTime) {
					// Close the Tab and remove from tabList
					chrome.tabs.remove(tab.id);
					tabList = tabList.filter(innerTab => innerTab.id != tab.id); // Couldn't think of a better name for the callback parameter :P
				}
			});
		});
	});

	setTimeout(timeIncrementer, 1000);
}
timeIncrementer();
