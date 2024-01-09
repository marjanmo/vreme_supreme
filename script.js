function placeMainBelowNavbar() {
    var navbarHeight = document.querySelector('nav').offsetHeight;
    main = document.getElementById('main')

    main.style.marginTop = navbarHeight + 'px';

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

// Set a base datetime, rounded to last hour
var baseDatetime = new Date();
baseDatetime.setMinutes(0);
baseDatetime.setSeconds(0);

// določi začetne vrednosti
var currentDatetime = baseDatetime
var currentDatetimeUtc = new Date(currentDatetime.getTime() - 1 * 60 * 60 * 1000)
var currentDatetimeUtcRounded = new Date(currentDatetimeUtc.getTime())
var lastAladinSimulationGuessUtc = roundToLast12Hours(new Date(currentDatetimeUtc.getTime() - 5 * 60 * 60 * 1000)) // predpostavljaš, da se 5 ur računa nov run

const PROBASE_URL = 'https://meteo.arso.gov.si/uploads/probase/www/'


function updateAnaliza() {
    const sliderValue = document.getElementById('analizaSlider').value;

    //Updajtaj datume
    // Calculate the new datetime based on the slider value (rounded to 10 minutes)
    currentDatetime = new Date(baseDatetime.getTime() + sliderValue * 10 * 60 * 1000);
    currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);
    currentDatetimeUtcRounded = new Date(currentDatetimeUtc.getTime());
    currentDatetimeUtcRounded.setMinutes(0);

    // Update datum text
    var formattedDatetime = currentDatetime.toLocaleDateString('si-SI', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    document.getElementById('currentDatetimeValueAnaliza').textContent = formattedDatetime;

    // Update radar image
    document.getElementById('radarImage').src = PROBASE_URL + 'observ/radar/si0_' + utcDateToCommonString(currentDatetimeUtc) + '_zm_si.jpg';


    //Update Satellite Image SLO
    document.getElementById('satelliteImageSLO').src = PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_hrv_si.jpg';

    //Update Satellite Image EU
    document.getElementById('satelliteImageEU').src = PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_ir_sateu.jpg';

};

function updateNapoved() {
    const sliderValue = document.getElementById('napovedSlider').value;

    //Updajtaj datume
    // Calculate the new datetime based on the slider value (rounded to 1 hour)
    currentDatetime = new Date(baseDatetime.getTime() + sliderValue * 60 * 60 * 1000);
    currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);

    // Update datum text
    var formattedDatetime = currentDatetime.toLocaleDateString('si-SI', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    document.getElementById('currentDatetimeValueNapoved').textContent = formattedDatetime;


    //pogruntaj, koliko ur je že od zadnje simulacije
    hoursAfterSimulation = Math.floor((currentDatetimeUtc - lastAladinSimulationGuessUtc) / (1000 * 60 * 60));

    var forecasting_hour = String(Math.floor(hoursAfterSimulation / 3) * 3).padStart(3, '0')


    //Update radar text and image
    document.getElementById('AladinRainImage').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_tcc-rr_si-neighbours_' + forecasting_hour + '.png';
    document.getElementById('AladinTempImage').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_t2m_si-neighbours_' + forecasting_hour + '.png';
    document.getElementById('AladinWind0Image').src = PROBASE_URL + 'model/aladin/field/ad_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vm-va10m_si_' + forecasting_hour + '.png';
    document.getElementById('AladinWind700Image').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vf925_si-neighbours_' + forecasting_hour + '.png';
    document.getElementById('AladinWind1500Image').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_r-t-vf850_si-neighbours_' + forecasting_hour + '.png';


    //Update wind text and image
    //document.getElementById('windImage').src = PROBASE_URL + 'www/model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_va10m_si_' + forecasting_hour + '.png';

};


function updateProfiles(place) {
        
    //update location variable
    console.log(place)
    console.log(utcDateToCommonString(lastAladinSimulationGuessUtc))

    // Ti vzamejo ljubljana-bezigrad, murska-sobota,...
    document.getElementById('rainProfile').src = PROBASE_URL + '/model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_t-r_' + place + '.png'

    document.getElementById('windProfile').src = PROBASE_URL + '/model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vm-va_' + place + '.png'

    var placeToJadralciCode = {
        "ljubljana-bezigrad": "SILJU",
        "murska-sobota": "SIMSO",
        "portoroz": "SIPOR",
        "novo-mesto": "SINMO",
        "ratece": "SILES",

    }
    document.getElementById('cloudProfile').src = PROBASE_URL + 'model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_rh-t_' + placeToJadralciCode[place] + '.png';

    // Profil temperature
    document.getElementById('temperatureProfile').src = PROBASE_URL + 'model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_tgrad_' + placeToJadralciCode[place] + '.png';

    // Profil vlage
    document.getElementById('humidityProfile').src = PROBASE_URL + 'model/aladin/point/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_rh-va_' + placeToJadralciCode[place] + '.png';

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

document.addEventListener('DOMContentLoaded', function () {


    // Default je analiza
    showContent("analiza", "content")
    // Pokaži samo svoj filter
    showContent("analiza", "controlBar")

    updateAnaliza()

    //focusOnRangeSlider()

    placeMainBelowNavbar()

    window.addEventListener('resize', placeMainBelowNavbar());


 
    // document.addEventListener('keydown', function (event) {
        
    //     //find active slider
    //     //najdi slider, ki je viden.

    //     if (document.getElementById('analiza').display === 'block') {
    //         var visibleSlider = document.getElementById("analizaSlider")
    //     } else {
    //         var visibleSlider = document.getElementById("napovedSlider")
    //     }
    //     console.log(visibleSlider)
    //     if (event.key === 'ArrowLeft') {
    //         // Move the slider left
    //         visibleSlider.value = parseInt(visibleSlider.value, 10) - 1;
    //     } else if (event.key === 'ArrowRight') {
    //         // Move the slider right
    //         visibleSlider.value = parseInt(visibleSlider.value, 10) + 1;
    //     }

    //     // Trigger the input event manually
    //     const inputEvent = new Event('input', { bubbles: true });
    //     visibleSlider.dispatchEvent(inputEvent);
    // });





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




});



