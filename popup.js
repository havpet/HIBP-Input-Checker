chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "https://haveibeenpwned.com";
    chrome.tabs.create({ url: newURL });
});