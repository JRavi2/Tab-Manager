const timeInputBox = document.getElementById("threshold-time");
const timeSetButton = document.getElementById("time-button");
const timeFormat = document.getElementById("format");
const timeForm = document.getElementById("time-form");

timeSetButton.onclick = function (element) {
	var timeToSet;

	if (timeInputBox.value === "") timeInputBox.value = 1;

	// Convert from given time format to seconds
	switch (timeFormat.value) {
		case "Hours":
			timeToSet = timeInputBox.value * 60 * 60;
			break;
		case "Days":
			timeToSet = timeInputBox.value * 24 * 60 * 60;
			break;
		case "Weeks":
			timeToSet = timeInputBox.value * 7 * 24 * 60 * 60;
			break;
		// Default to Hours
		default:
			timeToSet = timeInputBox.value * 60 * 60;
	}

	chrome.storage.sync.set({ thresholdTime: timeToSet });
	window.location.href = "../html/search.html";
};

timeForm.addEventListener("submit", e => e.preventDefault());
