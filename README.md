# WME Permalink Loader
Allows external webpages to load permalinks directly into an existing instance of Waze Map Editor, without reloading it.

## How it works
This works by having two parts:
1. a piece of Javascript on the external webpage that attempts to locate the WME tab, and sent the permalink via a message
2. [this userscript](https://greasyfork.org/en/scripts/426525-wme-permalink-loader) that runs in WME that listens for permalink messages, and loads them into the current session

## Features
* WME links from one page will all open into specifc tab, except for Beta links which will go to a separate tab
* All permalink parameters are supported, using native 'restore' functions in WME, including selecting segments and opening URs
* This works even after reloading the external page, or visiting another page, as long as it's in the same browser tab/window
* If userscript is not installed, or does not work for another reason, then it will fallback to doing a full load of the permalink

## Instructions for use

   Load '[permalink-loader.js](https://github.com/MrTimbones/WME-Permalink-Loader/blob/main/permalink-loader.js)' into the `<head>` of the HTML document, and then do *either* **A** or **B** below:

**A**: add the following onclick attribute to each of your <a> tags:
```javascript
  <a href="..." onclick="return loadPermalink(this)">click here</a>
```
  or, if you're building DOM elements in Javascript:
```javascript
  a.onclick = function() { return loadPermalink(a); };
```
for other kinds of element, you can pass the permalink as a string to the `loadPermalink()` function.

**B**: or, add the following code at the top of document to upgrade all the permalinks:
```javascript
  <body onload="upgradePermalinks()">
```
There are other ways to trigger `upgradePermalinks()` if you prefer.
