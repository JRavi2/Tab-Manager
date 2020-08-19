const inputBox = document.getElementById("whitelist-box");
const form = document.getElementById("whitelist-form");
const whitelistContainer = document.getElementById("whitelist-container");

// Get the initial whitelist data
chrome.storage.sync.get("whitelist", data => {
	let whitelist = data.whitelist ? data.whitelist : [];
	whitelist.forEach(host => {
		appendToList(host);
	});
});

// Return the url host if the url is valid, else return undefined
const validateUrl = strUrl => {
	try {
		const url = new URL(strUrl);
		return url.host;
	} catch (err) {
		return undefined;
	}
};

// Append a particular URL to the list on the DOM
const appendToList = host => {
	var listItem = document.createElement("div");
	var text = document.createElement("span");
	var close = document.createElement("span");
	listItem.setAttribute("class", "list-item");
	text.setAttribute("class", "host");
	text.innerHTML = host;
	close.setAttribute("class", "close-btn");
	close.innerHTML = "&#x2716;";
	listItem.appendChild(text);
	listItem.appendChild(close);
	whitelistContainer.appendChild(listItem);

	close.onclick = function () {
		// Remove it from the list
		var parentDiv = this.parentElement;
		console.log(parentDiv);
		var divText = parentDiv.childNodes[0].innerHTML;
		parentDiv.style.display = "none";
		// Also delete from storage
		console.log(divText);
		chrome.storage.sync.get("whitelist", data => {
			const newList = data.whitelist.filter(host => host != divText);
			chrome.storage.sync.set({ whitelist: newList });
		});
	};
};

// Validate the entered URL, and if it is valid add it to the whitelist
const validateAndAdd = e => {
	e.preventDefault(); // Don't refresh the page

	// Validate the Entered URL
	const host = validateUrl(inputBox.value);
	if (host == undefined) {
		alert("Not a valid Url!");
		return;
	}

	// If the URL is valid, add the domain to the list and clear the text box
	chrome.storage.sync.get("whitelist", data => {
		var newList = data.whitelist;
		if (!newList) newList = [].push(host);
		else newList.push(host);

		chrome.storage.sync.set({ whitelist: newList }, () => console.log(newList));
	});
	appendToList(host);
	inputBox.value = "";
};

form.addEventListener("submit", validateAndAdd);
