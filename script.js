
document.addEventListener('DOMContentLoaded', function () {
    
    // Že kar takoj ob loadu osveži vrednost sliderja
    updateContent()

    focusOnRangeSlider()

    document.getElementById("locationDropdown").textContent = profileLocation;


    });

// Function to set focus on the range slider
function focusOnRangeSlider() {
    const slider = document.getElementById('slider');
    slider.focus();
}

var profileLocation = "SILES";



// Set a base datetime, rounded to last hour
var baseDatetime = new Date();
baseDatetime.setMinutes(0);
baseDatetime.setSeconds(0);

// določi začetne vrednosti
var currentDatetime = baseDatetime
var currentDatetimeUtc = new Date(currentDatetime.getTime() - 1 * 60 * 60 * 1000)
var lastAladinSimulationGuessUtc = roundToLast12Hours(new Date(currentDatetimeUtc.getTime() - 5 * 60 * 60 * 1000)) // predpostavljaš, da se 5 ur računa nov run

var profileLocation = "SILES";

function updateContent() {
    const sliderValue = document.getElementById('slider').value;

    //Updajtaj datume
    // Calculate the new datetime based on the slider value (rounded to 1 hour)
    currentDatetime = new Date(baseDatetime.getTime() + sliderValue * 60 * 60 * 1000);
    currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);


    //pogruntaj, koliko ur je že od zadnje simulacije
    hoursAfterSimulation = Math.floor((currentDatetimeUtc - lastAladinSimulationGuessUtc) / (1000 * 60 * 60));
    
    var forecasting_hour = String(Math.floor(hoursAfterSimulation / 3) * 3).padStart(3, '0')
    
    // Format the datetime as needed
    const formattedDatetime = currentDatetime.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

    document.getElementById('currentDatetimeValue').textContent = formattedDatetime;


    //Update radar text and image
    if (currentDatetime <= baseDatetime) {
        document.getElementById('radarText').textContent = ' (Radarska slika)';
        document.getElementById('radarImage').src = 'https://meteo.arso.gov.si/uploads/probase/www/observ/radar/si0_' + utcDateToCommonString(currentDatetimeUtc) + '_zm_si.jpg';

    }
    else {
        document.getElementById('radarText').textContent = " (Napoved Aladin)"
        document.getElementById('radarImage').src = 'https://meteo.arso.gov.si/uploads/probase/www/model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_tcc-rr_si-neighbours_' + forecasting_hour + '.png';
        console.log(document.getElementById('radarImage').src)
    }

    //Update Satellite Image
    document.getElementById('satelliteImage').src = 'https://meteo.arso.gov.si/uploads/probase/www/observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtc) + '_ir_sateu.jpg';

    //Update wind text and image
    document.getElementById('windImage').src = 'https://meteo.arso.gov.si/uploads/probase/www/model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_va10m_si_' + forecasting_hour + '.png';


    updateProfiles(profileLocation);
};


function updateProfiles(place) {
    //update location variable
    profileLocation = place;

    document.getElementById("locationDropdown").textContent = profileLocation;


    document.getElementById('cloudProfile').src = 'https://meteo.arso.gov.si/uploads/probase/www/model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_rh-t_' + profileLocation + '.png';

    // Profil temperature
    document.getElementById('temperatureProfile').src = 'https://meteo.arso.gov.si/uploads/probase/www/model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_tgrad_' + profileLocation + '.png';

    // Profil vlage
    document.getElementById('humidityProfile').src = 'https://meteo.arso.gov.si/uploads/probase/www/model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_rh-va_' + profileLocation + '.png';

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




// Text napoved
//https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/fcast_si_text.html


// Text napoved za letalce
// https://meteo.arso.gov.si/uploads/probase/www/aviation/fproduct/text/sl/aviation.txt

// Radarska slika
// https://meteo.arso.gov.si/uploads/probase/www/observ/radar/si0_20240107-2240_zm_si.jpg


// Satelitska slika Evropa
// https://meteo.arso.gov.si/uploads/probase/www/observ/satellite/msg_20240107-1000_ir_sateu.jpg

// Satelitska slika Slovenija
// https://meteo.arso.gov.si/uploads/probase/www/observ/satellite/msg_20240108-1000_hrv_si.jpg

// Padavine Napoved SLO
// https://meteo.arso.gov.si/uploads/probase/www/model/aladin/field/as_20240108-0000_tcc-rr_si-neighbours_069.png?1704712225313

// Veter Napoved SLO
// https://meteo.arso.gov.si/uploads/probase/www/model/aladin/field/as_20240108-0000_va10m_si_024.png?1704712293943

//

// Profil oblačnosti (SILESce, SIBOVec, SIPOStojna, SIPORtorož, SILJUbljana, SIPTUj, SISGRadec, SIMNOmesto, SIKOCevje, SIMSObota)
// https://meteo.arso.gov.si/uploads/probase/www/model/aladin/point/as_20240108-0000_rh-t_SILES.png

// Profil temperature 
// https://meteo.arso.gov.si/uploads/probase/www/model/aladin/point/as_20240108-0000_tgrad_SILES.png

// Profil vlage
// https://meteo.arso.gov.si/uploads/probase/www/model/aladin/point/as_20240108-0000_rh-va_SILES.png

// Profil vetra
// https://meteo.arso.gov.si/uploads/probase/www/model/aladin/point/as_20240108-0000_vm-va_SILES.png






