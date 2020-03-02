var ord = []
var gjemHele = false
var url = window.location.toString();
var blank = false


// INIT: Henter all nødvendig data fra chrome storage.
chrome.storage.sync.get(['gjemHele'], function(result) {
    gjemHele = result.gjemHele
    if (!gjemHele) {
        chrome.storage.sync.set({"gjemHele": false})
        gjemHele = false;
    }
});

chrome.storage.sync.get(['blankStartup'], function(result) {
    blank = result.blankStartup
    if (!blank) {
        chrome.storage.sync.set({"blankStartup": false})
        blank = false;
    }
});

chrome.storage.sync.get(['ordListe'], function(result) {
    ord = result.ordListe
    if (!ord) {
        chrome.storage.sync.set({"ordListe": []})
        ord = []
    }
    fjern()
});




// Listeners som venter på beskjed fra "frontend", altså popup.js.
// popup.js fungerer som et view, mens innhold.js er Presenter (logikk).
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.melding == "init"){
            sendResponse({liste: ord, gjemHele: gjemHele, url: url, blank: blank})
        }
        return true;
});


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        if (request.melding == "leggTil"){
            if (ord) ord = ord.concat([request.tekst])
            else ord = [request.tekst]
            chrome.storage.sync.set({"ordListe": ord})
            fjern()
            sendResponse({liste: ord})
        }
        return true;
});


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.melding == "slett"){
            ord = ord.filter((o) => {return o != request.tekst})
            chrome.storage.sync.set({"ordListe": ord})
            window.location.reload()
            sendResponse({liste: ord})
        }
        return true;
});


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.melding == "gjemHele"){

            chrome.storage.sync.set({"gjemHele": request.tekst})
            gjemHele = request.tekst
            window.location.reload()
            sendResponse({status: true})
        }
        return true;
});


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        if (request.melding == "blankStartup"){
            chrome.storage.sync.set({"blankStartup": request.tekst})
            sendResponse({status: true})
        }
        return true;
});





// Metode som går igjennom nyhetssiden og filterer vekk uønsket innhold.
// Kalles etter hver forandring i listen over uønskede ord/setninger.
const fjern = () => {

    console.log(url)
    if (url.indexOf("vg.no/") != -1) fjernVG()
}

const fjernVG = () => {
    // VG artikler
    var artikler = [].slice.call(document.querySelectorAll('div.article-content'));
    artikler = artikler.filter( (artikkel) => {
        var sjekk = 0;
        ord.forEach( (o) => {
            if (artikkel.innerText.toLowerCase().includes(o.toLowerCase())){
                sjekk = 1;
            }
        })
        return sjekk > 0;
    })

    artikler.forEach( (artikkel) => {

        if (gjemHele) artikkel.parentElement.className += " gjemHele"
        else artikkel.parentElement.className += " artikkelHel";
        artikkel.href ="#"
    })

    // VG Livefeed
    var livefeed = [].slice.call(document.querySelectorAll("li"));

    livefeed = livefeed.filter( (feed) => {
        var sjekk = 0;
        ord.forEach( (o) => {
            if (feed.className.includes("Livefeed") && feed.innerText.toLowerCase().includes(o.toLowerCase())){
                sjekk = 1;
            }
        })
        return sjekk > 0;
    })

    livefeed.forEach( (feed) => {
        if (gjemHele) feed.className += " gjemHele"
        else feed.className += " artikkelHel"
    })
}
