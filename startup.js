var element = document.documentElement;
var url = window.location.toString();
var blank = false;

chrome.storage.sync.get(['blankStartup'], function(result) {
    blank = result.blankStartup
    if (!blank) chrome.storage.sync.set({"blankStartup": false})
    kjorBlank(blank)
});


// Sørger for blank skjerm mens siden lastes inn.
const kjorBlank = (b) => {
    if (b){
        if (url.indexOf("vg.no/") != -1) {
            element.className += " gjem"

            document.onreadystatechange = () => {
              if (document.readyState === 'complete') {
                element.classList.remove("gjem")
              }
            }
        }
    }
}
