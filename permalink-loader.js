/**
  Allows external webpages to load permalinks directly into an existing instance of WME, without reloading it.

  For use with WME Permalink Loader userscript: https://greasyfork.org/en/scripts/426525-wme-permalink-loader

  Instructions for use:
  
  A: add the following to each of your <a> tags: onclick="return loadPermalink(this)"
  
     for other kinds of element, you can replace 'this' with the permalink string directly
     
  B: or, add the following code at the top of document to upgrade all the permalinks:
  
     <body onload="upgradePermalinks()">
**/

var PLL = {
  version : 0.9,
  target : null,
  active : 'www.waze.com',
  timeoutID : null
}

function upgradePermalinks() {
  document.querySelectorAll('a').forEach(function(a) {
    if (a.href.match(/waze\.com.*\/editor/)) {
      a.onclick = function() { return loadPermalink(a); };
    }
  });
}

function loadPermalink(permalink) {
  // can pass in 'a' element
  if (permalink.tagName == 'A' && permalink.href) {
    permalink = permalink.href;
  }

  // abort if link is not for WME - browser will open it normally  
  if (!permalink.match(/waze\.com.*\/editor/)) {
    return true;
  }
  var url = new URL(permalink);
  
  var tabname = url.hostname;
  var destination = url.origin + url.pathname;

  if (PLL.target == null && PLL.active == tabname) {
    // this tab was previously connected to WME
    console.log("Attempting to connect with existing WME...");
    PLL.target = window.open('', tabname);
  }

  if (PLL.target == null || PLL.target.closed || PLL.active != tabname) {
    // open WME in new tab
    console.log("Opening new tab for " + tabname);
    PLL.target = window.open(permalink, tabname);
        
    // send a message to see if WME Permalink Loader is active
    window.setTimeout(function() {
      console.log("Sending ping to " + tabname);
      PLL.target.postMessage( { 'ping' : tabname, 'version' : PLL.version }, destination);
    }, 3000);
  }
  
  else {
    // Send the url to WME Permalink Loader script
    console.log("Sending permalink to " + tabname);
    PLL.target.postMessage({ 'url' : permalink }, destination);
    sessionStorage.setItem(tabname, 0);
    
    // set up a fallback that will open it the old way if loader doesn't work
    PLL.timeoutID = window.setTimeout(function() {
      PLL.active = 'none';
      PLL.timeoutID = null;
      console.log("Permlink failed to load, retrying...");
      loadPermalink(permalink);
    }, 500);
  }
  
  return false;
}

// list for acknowledgements from WME, so we know it's alive
window.addEventListener("message", function(event) {
  if (event.data.pong) {
    PLL.active = event.data.pong;
    event.source.focus();
    console.log("Permlink sucessfully loaded");
    window.clearTimeout(PLL.timeoutID); // cancel fallback    
  }
}, false);
