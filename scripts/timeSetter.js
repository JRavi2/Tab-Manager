const timeInputBox = document.getElementById('threshold-time');
const timeSetButton = document.getElementById('time-button');
const timeFormat = document.getElementById('format');
const timeForm = document.getElementById('time-form');

timeSetButton.onclick = function(element) {
  var timeToSet;

  // Convert from given time format to seconds (should probably be using switch but I am lazy)
  if(timeFormat.value === "Hours") 
    timeToSet = timeInputBox.value * 60 * 60;
  else if(timeFormat.value === "Days")
    timeToSet = timeInputBox.value * 24 * 60 * 60;
  else if(timeFormat.value === "Weeks")
    timeToSet = timeInputBox.value * 7 * 24 * 60 * 60;
  else if(timeFormat.value === "Minutes")
    timeToSet = timeInputBox.value * 60;
  else
    timeToSet = timeInputBox.value;

  chrome.storage.sync.set({thresholdTime : timeToSet}, () => console.log(timeToSet));
};

timeForm.addEventListener('submit', e => e.preventDefault());
