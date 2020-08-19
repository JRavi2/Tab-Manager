const inputBox = document.getElementById("searchbar");
const searchList = document.getElementById("search-list");

var tabList = [];

// Grab the Current list of tabs and flush them out to the DOM
chrome.tabs.query({ windowType: "normal" }, tabs => {
	tabList = tabs;
	fillList();
});

// Rerender the tabList with fuzzysorted values whenever the user enters a new character
inputBox.addEventListener("input", e => {
	// The default condition, i.e. when the searchbar is empty, display all the tabs
	if (inputBox.value === "") {
		fillList();
		return;
	}

	var res = fuzzysort.go(inputBox.value, tabList, { key: "title" });
	searchList.textContent = "";
	res.forEach(tab => {
		var listItem = document.createElement("div");
		listItem.setAttribute("class", "list-item");
		listItem.setAttribute("id", tab.obj.id);
		listItem.onclick = gotoTab;
		listItem.innerHTML = tab.target;
		searchList.appendChild(listItem);
	});
});

// Fill the list with all the currently open tabs
const fillList = () => {
	searchList.textContent = "";
	tabList.forEach(tab => {
		var listItem = document.createElement("div");
		listItem.setAttribute("class", "list-item");
		listItem.setAttribute("id", tab.id);
		listItem.onclick = gotoTab;
		listItem.innerHTML = tab.title;
		searchList.appendChild(listItem);
	});
};

// When clicked on make that tab the active tab
// and make the currently active tab inactive
const gotoTab = e => {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.update(tabs[0].id, { highlighted: false });
	});
	chrome.tabs.update(parseInt(e.target.id), { highlighted: true });
};
