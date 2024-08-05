

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


function roundToLastNMinutes(date, n_minutes) {
    console.log(date)
    const minutes = date.getMinutes();
    const roundedMinutes = Math.floor(minutes / n_minutes) * n_minutes;
    date.setMinutes(roundedMinutes, 0, 0);
    return date;
}


function RelativeDateFormat(date, currentDate) {

    var DayStr = "";
    var HourStr = "";

    daysDifference = Math.floor((date - currentDate) / (24 * 1000 * 60 * 60));

    // Manipulate currentDate locally without affecting the global variable by creating a new local copy of var
    currentDateMidnight = new Date(currentDate);
    // Če boš naredil tako kot spodaj, boš v resnici spreminjal vrednost globalne variable, ki si jo poslal v funckijo kot currentDate
    // var currentDateMidnight = currentDate
    currentDateMidnight.setHours(0,0,0,0)

    if (date.getHours() >= 23) {
        HourStr = "ponoči"
    } else if (date.getHours() >= 18) {
        HourStr = "zvečer"
    } else if (date.getHours() >= 12) {
        HourStr = "popoldne"
    } else if (date.getHours() >= 8) {
        HourStr = "dopoldne"
    } else if (date.getHours() >= 6) {
        HourStr = "zjutraj"
    } else {
        HourStr = "ponoči"
    }

    // Če je večji od pojutrišnjem
    if (date > new Date(currentDateMidnight.getTime() + 3 * 24 * 60 * 60 * 1000)) {
        DayStr = "čez " + daysDifference + " dni"
        HourStr = ""
    // Če je večji od polnoč + 2 dni, je potem lahko samo še pojutrišnjem
    } else if (date >= new Date(currentDateMidnight.getTime() + 2 * 24 * 60 * 60 * 1000)) {
        DayStr = "pojutrišnjem "
    // Če je večji od polnoč + 1 dni, je potem lahko samo še jutri
    } else if (date >= new Date(currentDateMidnight.getTime() + 1 * 24 * 60 * 60 * 1000)) {
        DayStr = "jutri "
    // Če je večji od polnoč, je potem lahko samo še danes
    } else if (date >= currentDateMidnight.getTime()) {
        DayStr = "danes "
    // Naredi še za preteklost
    } else if (date >= new Date(currentDateMidnight.getTime() - 1 * 24 * 60 * 60 * 1000)) {
        DayStr = "včeraj "
        // Če je večji od polnoč + 1 dni, je potem lahko samo še jutri
    } else if (date >= new Date(currentDateMidnight.getTime() - 2 * 24 * 60 * 60 * 1000)) {
        DayStr = "predvčerajšnjim "
    } else {
        DayStr = "pred " + Math.abs(daysDifference) + " dni" 
        HourStr = ""
    }

    return DayStr + HourStr

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
    };

    return date.toLocaleDateString('sl-SI', options) + " " +  date.getDate() + "." + (date.getMonth() + 1) + ". " + date.getHours() + ":" + String(date.getMinutes()).padStart(2, '0') //+ " " + timeZoneName


}


function toggleVisibleContent(class_name, dataset_name, dataset_value) {

    // Funkcija skrije vse elemente z classom content in nato odmaskira samo tistega, ki ima ustrezno vrednost dataset taba

    var contentDivs = document.getElementsByClassName(class_name);
    for (var i = 0; i < contentDivs.length; i++) {
        if (contentDivs[i].dataset[dataset_name] === dataset_value) {
            // console.log("Prižigam", class_name,  contentDivs[i].dataset[dataset_name])
            contentDivs[i].style.display = "block";
        } else {
            // console.log("Ugašam", class_name,  contentDivs[i].dataset[dataset_name])
            contentDivs[i].style.display = "none";

        }
    }

    placeMainBelowNavbar()

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
    

    navbar = document.getElementById('navBar')
    var navbarHeight = navbar.offsetHeight;

    var main = document.getElementById('main')

    // Če je na smartphonu in je dol, potem naštimaj margin spodaj, sicer pa zgoraj
    if (window.getComputedStyle(navbar).bottom === "0px" || navbar.style.bottom === "0px") {
        main.style.marginBottom = navbarHeight + 'px';
                
        main.style.marginTop = document.getElementById('current-datetime-small').offsetHeight + 'px';

    } else {
        
        main.style.marginBottom = '0px';
        main.style.marginTop = navbarHeight + 'px';
    }
}


function SetElementVisibilty(element_id, value) {

    div = document.getElementById(element_id);
    div.style.setProperty('display', value, 'important');  // Use !important to override other styles


}



function parseAviationForecastData(container) {
    var url = "https://meteo.arso.gov.si/uploads/probase/www/aviation/fproduct/text/sl/aviation.txt"
    url = 'https://corsproxy.io/?' + encodeURIComponent(url+'?timestamp='+ Date.now());


    function parseData(data) {
        const lines = data.split('\r\n');

        createElement(container, 'p', "Datum: " + lines[1].replace("IZDANO: ", ""));

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


// Function to update the image order
function updateImageOrder(gridId, order) {
    console.log(order)
    order.forEach((imageId) => {
        let imageElement = document.getElementById(imageId);
        if (imageElement) {
            document.getElementById(gridId).appendChild(imageElement.parentNode);
        }
    });
}


// Function to handle drag and drop events
function handleImageReorder(event) {
    event.preventDefault();
    const draggedImageId = event.dataTransfer.getData('text/plain');
    
    // Pogruntaj kontekst iz imageId.
    console.log("V roki si držal: ", draggedImageId)
    gridId = document.querySelector('[data-image="' + draggedImageId + '"]').parentNode.id
    console.log(gridId)
    //Preberi trenutni imageorder
    order = imageOrder[gridId]
    const draggedIndex = order.indexOf(draggedImageId);
    console.log(order)
    
    // Najdi ime in id target lokacije
    const targetDraggableElement = event.target.closest('[draggable="true"]');

    if (!targetDraggableElement) {
        console.error('No draggable element found.');
        return;
    }
    
    // LI
    const dropIndex = order.indexOf(targetDraggableElement.dataset.image);
    console.log(targetDraggableElement.dataset.image)
    console.log(draggedIndex, dropIndex)
    // Swap the positions in the order array using a temporary variable
    const temp = order[draggedIndex];
    order[draggedIndex] = order[dropIndex];
    order[dropIndex] = temp;

    // Update the order in localStorage
    imageOrder[gridId] = order
    console.log("Novi red je: ", order)
    localStorage.setItem('imageOrder', JSON.stringify(imageOrder));

    // Update the visual order
    updateImageOrder(gridId, order);
}



function parseGeneralForecastData(container) {
    var url = "https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/fcast_si_text.xml"
    var url = 'https://corsproxy.io/?' + encodeURIComponent(url + '?timestamp=' + Date.now());

    function parseData(data) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');

        // Naslov
        var osvezeno = xmlDoc.querySelector('articleinfo').querySelector('pubdate').textContent.split(", ")[1]
        createElement(container, 'p', "Datum: " + osvezeno);


        //Preveri, če je opozorilo!
        var warning = xmlDoc.querySelector('#warning_SLOVENIA para').textContent
        if (warning != "Dodatnega opozorila ni.") {
            createElement(container, 'h6', "OPOZORILO", "warning")
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