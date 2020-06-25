# Tab Manager Extension

## Description

This is a chrome extension that closes tabs that have been inactive for a specific amount of time (Set by you).
If you don't want tabs, with a particular website open in them, to close, you can add those websites to a whitelist. The sites added to the whiteslist will be ignored by the extension.

It also has an additional functionality of searching through all the open tabs.

Currently it is only available for chrome. I Might not be able to make one for Firefox as Firefox blocks scripts from closing tabs that the script has not opened. If you have any ideas for how I can make this extension for Firefox, please feel free to open up an issue/PR.

Also, currently the icon for the extension is set to the default icons from the chrome documentation. If you have any ideas for a cool icon, feel free to open up an issue/PR.

## Installation

Clone the repository and then in Google Chome, goto `chrome://extensions`. Enable Developer Mode in the right top corner. Click on 'Load Upacked', navigate to the cloned repository and select any file from that folder.

To use any newly released updates, run `git pull` in the terminal when in the extension directory and then goto `chrome://extensions` and reload the extension.
