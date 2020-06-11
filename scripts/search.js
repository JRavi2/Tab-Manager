const inputBox = document.getElementById("searchbar");
const searchList = document.getElementById("search-list");

var tabList = [];

chrome.tabs.query({windowType:'normal'}, function(tabs) {
	tabList = tabs;
	fillList();
});

inputBox.addEventListener("input", e => {
	if (inputBox.value === "") {
		fillList();
		return;
	}
	var res = fuzzysort.go(inputBox.value, tabList, {key : 'title'});
	searchList.textContent = "";
	res.forEach(tab => {
		var listItem = document.createElement("div");
		listItem.setAttribute("class", "list-item");
		listItem.setAttribute("id", tab.obj.id);
		listItem.onclick = gotoTab;
		listItem.innerHTML = tab.target;
		searchList.appendChild(listItem);
	});
	console.log(res);
});

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
}

const gotoTab = e => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.update(tabs[0].id, {highlighted: false});
	});
	chrome.tabs.update(parseInt(e.target.id), {highlighted: true});
}
