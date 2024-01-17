

function preloadImages(urlList) {
  
  //Vrne funkcijo, ko popinga komplet seznam slik.
  
  const imagePromises = [];

  for (const url of urlList) {
    
    const imagePromise = new Promise((resolve) => {
    
      const img = new Image();
      img.src = url;
      img.onload = () => resolve({ success: true, url });
      img.onerror = () => resolve({ success: false, url });
    });

    imagePromises.push(imagePromise);
  }

  return Promise.all(imagePromises);
}


function focusOnSlider(sliderId) {
    // Find the visible range slider and set focus
    const visibleRangeSlider = document.getElementById(sliderId);

    if (visibleRangeSlider) {
        visibleRangeSlider.focus();
    }
}

// Function to handle orientation change
function handleOrientationChange() {
    var orientation = window.orientation;

    // Lock to portrait mode
    if (orientation !== 0 && orientation !== 180) {
        // If the orientation is not portrait (0 or 180 degrees), force it to portrait
        if (window.screen.orientation) {
            if (window.screen.orientation.lock) {
                window.screen.orientation.lock("portrait").catch(function (error) {
                    console.error("Failed to lock the screen orientation:", error);
                });
            }
        } else {
            // For browsers that do not support screen.orientation
            console.warn("Screen orientation API not supported");
        }
    }
}


function utcDateToCommonString(utcdate) {
    const year = utcdate.getFullYear();
    const month = String(utcdate.getMonth() + 1).padStart(2, '0');
    const day = String(utcdate.getDate()).padStart(2, '0');
    const hours = String(utcdate.getHours()).padStart(2, '0');
    const minutes = String(utcdate.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}-${hours}${minutes}`
}


function roundToLast12Hours(date) {
    const roundedDate = date;

    const hours = date.getHours();
    const roundedHours = (hours >= 12) ? 12 : 0; // Round to the last full 12:00 or 00:00

    roundedDate.setHours(roundedHours, 0, 0, 0);
    return roundedDate;
}


function roundToLast1200(date) {
    var roundedDate = date;

    // Če je datum pred 12, potem moraš vzeti prejšnji dan    
    if (roundedDate.getHours() < 12) {
        roundedDate.setDate(roundedDate.getDate() - 1);
    }

    // V vsakem primeru daj na 12
    roundedDate.setHours(12, 0, 0, 0);
    return roundedDate;
}


function formatDatetime(date) {

    // Pridobi informacijo o trenutnem timezonu
    // var currentDate = new Date();
    // var options = { timeZoneName: 'short' };

    // // Get the time zone name including daylight saving time information
    // var timeZoneName = new Intl.DateTimeFormat('en', options).formatToParts(currentDate)
    //     .find(part => part.type === 'timeZoneName').value;


    var options = {
        weekday: 'long', // Ponedeljek
        day: 'numeric',  // 14
        month: 'long',   // oktober
        year: 'numeric',  // 2024
        hour: 'numeric',  // 13
        minute: 'numeric' // 00
    };

    return date.toLocaleDateString('sl-SI', options) //+ " " + timeZoneName


}


function toggleVisibleContent(class_name, dataset_name, dataset_value) {

    // Funkcija skrije vse elemente z classom content in nato odmaskira samo tistega, ki ima ustrezno vrednost dataset taba

    var contentDivs = document.getElementsByClassName(class_name);
    for (var i = 0; i < contentDivs.length; i++) {
        if (contentDivs[i].dataset[dataset_name] === dataset_value) {
            contentDivs[i].style.display = "block";
        } else {
            contentDivs[i].style.display = "none";
        }
    }

    // placeMainBelowNavbar()

}


function toggleActiveButton(button, class_name) {
    var navbarButtons = document.getElementsByClassName(class_name);
    for (var i = 0; i < navbarButtons.length; i++) {
        navbarButtons[i].classList.remove('active');
    }
    button.classList.toggle('active');
}


function getActiveButtonId(className) {
    var activeButton = document.querySelector('.' + className + '.active');

    if (activeButton) {
        return activeButton.id;
    } else {
        return null; // No active button found
    }
}


function placeMainBelowNavbar() {
    

    navbar = document.querySelector('nav')

    var navbarHeight = navbar.offsetHeight;
    var main = document.getElementById('main')

    // Če je na smartphonu in je dol, potem naštimaj margin spodaj, sicer pa zgoraj
    if (window.getComputedStyle(navbar).bottom === "0px" || navbar.style.bottom === "0px") {
        main.style.marginBottom = navbarHeight + 'px';
        main.style.marginTop = '0px';

    } else {
        
        main.style.marginBottom = '0px';
        main.style.marginTop = navbarHeight + 'px';
    }
}


function parseAviationForecastData(container) {
    var url = "https://meteo.arso.gov.si/uploads/probase/www/aviation/fproduct/text/sl/aviation.txt"
    url = 'https://corsproxy.io/?' + encodeURIComponent(url+'?timestamp='+ Date.now());


    function parseData(data) {
        const lines = data.split('\r\n');
        console.log(lines)
        var osvezeno = document.createElement('h5');
        osvezeno.textContent = lines[1].replace("IZDANO: ", "");
        container.appendChild(osvezeno);

        //Loopaj vse od 4 vrstice naprej in filaj pare naslov, text
        for (let i = 3; i < lines.length; i++) {
            let el = lines[i];

            if (el.length == 0) {
                // prazna vrstica
            }

            // Če je narejen
            else if (el.toUpperCase() === el) {
                const title = document.createElement('h6');
                title.textContent = el;
                container.appendChild(title);

            } else {
                // Ne rabiš tega.
                if (el.startsWith('NASLEDNJA NAPOVED')) {
                    break;
                }

                const parapraph = document.createElement('p');
                parapraph.textContent = el;
                container.appendChild(parapraph);
            }

        };
    }

    // Make a GET request using the fetch API
    fetch(url)
        .then(response => {
            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            // Return the response text
            return response.text();
        })
        .then(parseData)
        .catch(error => {
            console.error('Error:', error);
        });





}


function parseGeneralForecastData(container) {
    var url = "https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/fcast_si_text.xml"
    var url = 'https://corsproxy.io/?' + encodeURIComponent(url + '?timestamp=' + Date.now());

    function parseData(data) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');

        // Naslov
        var osvezeno = xmlDoc.querySelector('articleinfo').querySelector('pubdate').textContent.split(", ")[1]
        createElement(container, 'h5', osvezeno);


        //Preveri, če je opozorilo!
        var warning = xmlDoc.querySelector('#warning_SLOVENIA para').textContent
        if (warning != "Dodatnega opozorila ni.") {
            createElement(container, 'h4', "NAPOVED ZA SLOVENIJO", "warning")
            createElement(container, 'p', warning, "warning")
        }



        // Napoved za Slovenijo
        createElement(container, 'h6', "NAPOVED ZA SLOVENIJO")
        createElement(container, 'p', "POVZETEK: " + xmlDoc.querySelector('#fcast_summary_SLOVENIA_d1-d2 para').textContent, "povzetek")
        var paragraphs = xmlDoc.querySelector('#fcast_SLOVENIA_d1').querySelectorAll("para")
        parTextContent = ""
        for (let j = 0; j < paragraphs.length; j++) {
            parTextContent += (" " + paragraphs[j].textContent)
        }
        createElement(container, 'p', parTextContent)

        // Obeti za Slovenijo
        createElement(container, 'h6', "OBETI")
        var paragraphs = xmlDoc.querySelector('#fcast_SLOVENIA_d3-d5').querySelectorAll("para")
        parTextContent = ""
        for (let j = 0; j < paragraphs.length; j++) {
            parTextContent += (" " + paragraphs[j].textContent)
        }
        createElement(container, 'p', parTextContent)


        // Sosednje pokrajine
        createElement(container, 'h6', "NAPOVED ZA SOSEDNJE POKRAJINE")
        var paragraphs = xmlDoc.querySelectorAll('#fcast_SI_NEIGHBOURS_d1 para,#fcast_SI_NEIGHBOURS_d2 para')
        parTextContent = ""
        for (let j = 0; j < paragraphs.length; j++) {
            parTextContent += (" " + paragraphs[j].textContent)
        }
        createElement(container, 'p', parTextContent)


        // Vremenska slika
        createElement(container, 'h6', "VREMENSKA SLIKA")
        var paragraphs = xmlDoc.querySelector('#fcast_EUROPE_d1').querySelectorAll("para")
        parTextContent = ""
        for (let j = 0; j < paragraphs.length; j++) {
            parTextContent += (" " + paragraphs[j].textContent)
        }
        createElement(container, 'p', parTextContent)


    }

    // Make a GET request using the fetch API
    fetch(url)
        .then(response => {
            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            // Return the response text
            return response.text();
        })
        .then(parseData)
        .catch(error => {
            console.error('Error:', error);
        });





}


function createElement(parent, type, text, className) {
    const el = document.createElement(type);
    el.textContent = text;

    if (className) {
        el.classList.add(className);
    }

    parent.appendChild(el);
}