const exportBtn = document.getElementById("export-snapshots");

exportBtn.onclick = e => {
	chrome.storage.sync.get("snapshots", data => {
		let b = new Blob([JSON.stringify(data, null, 2)], {type : "application/json"});
		let url = window.URL.createObjectURL(b);
		let date = new Date().toISOString().slice(0, 10)
		chrome.downloads.download({
			url: url,
			filename: "tab-manager-export-" + date + ".json"
		});
	});
}

