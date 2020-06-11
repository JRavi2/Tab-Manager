chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("thresholdTime", (data) => {
    if (!data.thresholdTime) {
      chrome.storage.sync.set({ thresholdTime: 5 });
    }
  });

  var tabList = [];

  // Add the tabLIst when a new tab is created
  chrome.tabs.onCreated.addListener(function (tab) {
    tabList.push({ id: tab.id, time: 0 });
    console.log(tabList);
  });

  // Remove the tab from the tabList when the tab is closed
  chrome.tabs.onRemoved.addListener(function (tab_id) {
    console.log(tab_id);
    tabList = tabList.filter((tab) => tab.id !== tab_id);
    console.log(tabList);
  });

  // When the tab becomes active, reset the timer for that tab
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    var id = activeInfo.tabId;
    tabList.forEach((tab) => {
      if (tab.id === id) tab.time = 0;
    });
  });

  async function timeIncrementer() {
    await chrome.storage.sync.get("thresholdTime", function (data) {
      var thresholdTime;
      thresholdTime = data.thresholdTime;
      tabList.forEach((tab) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (
          tabs
        ) {
          var curr_tab_id = tabs[0].id;
          if (curr_tab_id === tab.id)
            // Don't increase time for the current tab i.e. the active tab
            return;

          tab.time += 1;
          if (tab.time >= thresholdTime) {
            // Close the Tab and remove from tabList
            chrome.tabs.remove(tab.id);
          }
        });
      });
    });

    setTimeout(timeIncrementer, 1000);
  }
  timeIncrementer();
});
