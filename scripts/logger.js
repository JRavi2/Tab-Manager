// chrome.storage.sync.get(["openTabs"], function(data) {
//     var array;
//     if(data.openTabs)
//         array = data.openTabs;
//     else
//         array = [];

//     array.unshift(document.title);

//     var jsonObj = {};
//     jsonObj.openTabs = array;
//     chrome.storage.sync.set(jsonObj, function() {
//         console.log("Saved a new Tab Name: " + document.title);
//     });
// });

// window.onbeforeunload = function() {
//     chrome.storage.sync.get(["openTabs"], function(data) {
//         var array = data.openTabs;
//         array = array.filter(tabName => tabName !== document.title);
//         var jsonObj = {};
//         jsonObj.openTabs = array;
//         chrome.storage.sync.set(jsonObj, function() {
//             console.log("Removed the Tab Name: " + document.title);
//         });
//     });
// }
