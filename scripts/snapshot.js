const inputBox = document.getElementById("snapshot-name-input");
const form = document.getElementById("snapshot-form");
const snapshotsContainer = document.getElementById("snapshots-container");

let snapshots = [];

/* Prototype for the snapshot data being stored:
    snapshots: [
        {
            name: <string>,
            tabs: [
                {
                    title: <string>,
                    url: <string>,
                    index: <integer>
                },
                ...
            ]
        },
        ...
    ]
*/

// Get the snapshot data
chrome.storage.sync.get("snapshots", data => {
	snapshots = data.snapshots ? data.snapshots : [];
	snapshots.forEach(snapshot => {
		appendToList(snapshot.name);
	});
});

// Add a snapshot entry to the visual list
const appendToList = snapshotName => {
	var listItem = document.createElement("div");
	var text = document.createElement("span");
	var close = document.createElement("span");
	listItem.setAttribute("class", "list-item");
	text.setAttribute("class", "snapshot");
	text.innerHTML = snapshotName;
	close.setAttribute("class", "close-btn");
	close.innerHTML = "&#x2716;";
	listItem.appendChild(text);
	listItem.appendChild(close);
	snapshotsContainer.appendChild(listItem);

	// Revert to Sanpshot
	text.onclick = revertToSnapshot;

	// To remove it from the list on clicking the cross
	close.onclick = function () {
		var parentDiv = this.parentElement;
		var divText = parentDiv.childNodes[0].innerHTML;
		parentDiv.style.display = "none";
		// Also delete from storage
		chrome.storage.sync.get("snapshots", data => {
			const newList = data.snapshots.filter(
				snapshot => snapshot.name != divText
			);
			chrome.storage.sync.set({ snapshots: newList });
		});
	};
};

// Take and save the Snapshot
const takeSnapshot = async e => {
	e.preventDefault(); // Don't refresh the page
	let snapshotName = inputBox.value;
	var tabList;

	// Get the list of currently open Tabs i.e. take the snapshot
	await chrome.tabs.query({ windowType: "normal" }, tabs => {
		tabList = tabs.map(tab => ({
			title: tab.title,
			url: tab.url,
			index: tab.index
		}));

		// Add the taken snapshot to the list
		chrome.storage.sync.get("snapshots", data => {
			let newList = data.snapshots ? data.snapshots : [];
			newList.push({
				name: snapshotName,
				tabs: tabList
			});
			chrome.storage.sync.set({ snapshots: newList });
		});
	});

	appendToList(snapshotName);
	inputBox.value = "";
};

// Revert to a Snapshot
const revertToSnapshot = e => {
	let snapshotName = e.target.innerText;
	chrome.storage.sync.get("snapshots", data => {
		let targetUrls = data.snapshots
			.find(snapshot => snapshot.name === snapshotName)
			.tabs.map(tab => tab.url);
		chrome.windows.create({
			url: targetUrls
		});
	});
};

form.addEventListener("submit", takeSnapshot);
