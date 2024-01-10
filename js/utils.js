 


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


function showContent(contentId, class_name) {

    //Funkcija skrije vse elemente z classom content in nato odmaskira samo tistega z željenim id

    var contentDivs = document.getElementsByClassName(class_name);
    for (var i = 0; i < contentDivs.length; i++) {
        if (contentDivs[i].id === contentId) {
            contentDivs[i].style.display = "block";
        } else {
            contentDivs[i].style.display = "none";
        }
    }

    placeMainBelowNavbar()

}

function toggleActive(button, class_name) {
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
    var navbarHeight = document.querySelector('nav').offsetHeight;
    var main = document.getElementById('main')
    console.log(main)

    main.style.marginTop = navbarHeight + 'px';

}



// export { handleOrientationChange, formatDatetime, roundToLast12Hours, utcDateToCommonString, showContent, toggleActive, placeMainBelowNavbar  }