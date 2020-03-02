
window.addEventListener('DOMContentLoaded', () => {




    const input = document.getElementById('input')
    const tittel = document.getElementById('tittel')
    const form = document.getElementById('form')
    const listeKnapp = document.getElementById('listeA')
    const innstKnapp = document.getElementById('innstillingerA')
    const innstBoks = document.getElementById('innstillinger_boks')
    const liste = document.getElementById('listeOrd')
    const tomListe = document.getElementById('tomListe')
    const gjemHele = document.getElementById('gjemHele')
    const blankStartup = document.getElementById('blankStartup')

    innstBoks.style = "display: none"
    liste.style = "display: none"
    tomListe.style = "display: none"
    var sjekkSide = 0;


    function learnRegExp(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
    }

    // Sjekker om URL er gyldig. ellers blir det bare tull og tøys.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (learnRegExp(tabs[0].url)){
            init()
        } else {
            tittel.innerHTML = "Ugyldig nettside (URL)"
        }
    })


    // metode for å initialisere!
    const init = () => {

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id,
                {melding: "init"}, (resp) => {
                    console.log("init begynner")
                    oppdaterListe(resp.liste)
                    oppdaterGjemHele(resp.gjemHele)
                    oppdaterBlankStartup(resp.blank)
                    console.log("init ferdig")
                }
            )
        })


        listeKnapp.addEventListener('click', () => {
            if (sjekkSide === 0 || sjekkSide === 2){
                if (liste.childNodes.length > 0){
                    liste.style = "display: block"
                    tomListe.style = "display: none"
                    sjekkSide = 1
                } else {
                    tomListe.style = "display: block"
                    liste.style = "display: none"
                    sjekkSide = 3
                }
                innstBoks.style = "display: none"
            }
            else {
                innstBoks.style = "display: none"
                liste.style = "display: none"
                tomListe.style = "display: none"
                sjekkSide = 0
            }
        })

        innstKnapp.addEventListener('click', () => {
            if (sjekkSide != 2){
                liste.style = "display: none"
                tomListe.style = "display: none"
                innstBoks.style = "display: block"
                sjekkSide = 2
            }
            else {
                innstBoks.style = "display: none"
                liste.style = "display: none"
                tomListe.style = "display: none"
                sjekkSide = 0
            }
        })

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (input.value === "") return
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id,
                    {melding: "leggTil", tekst: input.value}, (resp) => {

                        input.value = "";
                        console.log(resp.liste)
                        oppdaterListe(resp.liste)
                        if (sjekkSide === 3){
                            tomListe.style = "display: none"
                            liste.style = "display: block"
                            sjekkSide = 1
                        }
                    }
                )
            })
        })


        gjemHele.addEventListener('change', () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id,
                    {melding: "gjemHele", tekst: gjemHele.checked}, (resp) => {

                        //console.log("FIKK SVAR!")
                    }
                )
            })
        })

        blankStartup.addEventListener('change', () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id,
                    {melding: "blankStartup", tekst: blankStartup.checked}, (resp) => {

                        //console.log("FIKK SVAR HEHE!")
                    }
                )
            })
        })
    }



    const oppdaterListe = (l) => {
        var ul = document.getElementById("listeOrd");
        ul.innerHTML = ""

        l.forEach( (ord) => {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(ord));
            li.addEventListener('click', function(e) {
                fjernListeElement(li)
            });
            ul.appendChild(li);
        })
    }

    const oppdaterGjemHele = (b) => {
        gjemHele.checked = b
    }

    const oppdaterBlankStartup = (b) => {
        blankStartup.checked = b;
    }


    const fjernListeElement = (li) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id,
                {melding: "slett", tekst: li.innerHTML, li: li}, (resp) => {

                    oppdaterListe(resp.liste)
                    if (sjekkSide = 1 && liste.childNodes.length === 0){
                        liste.style = "display: none"
                        tomListe.style = "display: block"
                        sjekkSide = 3
                    }
                }
            )
        })
    }
})
