// import { handleOrientationChange, formatDatetime, roundToLast12Hours, utcDateToCommonString, showContent, toggleActive, placeMainBelowNavbar } from './utils.js';


// Set a base datetime, rounded to last hour
var baseDatetime = new Date();
baseDatetime.setMinutes(0);
baseDatetime.setSeconds(0);

// določi začetne vrednosti
var currentDatetime = baseDatetime
var currentDatetimeUtc = new Date(currentDatetime.getTime() - 1 * 60 * 60 * 1000)
var currentDatetimeUtcRounded = new Date(currentDatetimeUtc.getTime())
var lastAladinSimulationGuessUtc = roundToLast12Hours(new Date(currentDatetimeUtc.getTime() - 5 * 60 * 60 * 1000)) // predpostavljaš, da se 5 ur računa nov run
var lastEcmwfSimulationGuessUtc = roundToLast1200(new Date(currentDatetimeUtc.getTime() - 7 * 60 * 60 * 1000)) // predpostavljaš, da se 7 ur računa nov run  (zadnji dan ob 12h)

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
    document.getElementById('currentDatetimeValueAnaliza').textContent = formatDatetime(currentDatetime);

    // Update radar image
    document.getElementById('radarImage').src = PROBASE_URL + 'observ/radar/si0_' + utcDateToCommonString(currentDatetimeUtc) + '_zm_si.jpg';


    //Update Satellite Image SLO
    document.getElementById('satelliteImageSLO').src = PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_hrv_si.jpg';

    //Update Satellite Image EU
    document.getElementById('satelliteImageEU').src = PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_ir_sateu.jpg';

};

function updateNapoved(area) {
    const sliderValue = document.getElementById('napovedSlider').value;
    
    // V slajderju klices funkcijo brez imena, zato moraš pogruntat, kateri je aktiven gumb. Area se skriva v idju tega gumba
    if (area == undefined) {
        area = getActiveButtonId('area-buttons')
    };

    //Updajtaj datume
    // Calculate the new datetime based on the slider value (rounded to 1 hour)
    currentDatetime = new Date(baseDatetime.getTime() + sliderValue * 60 * 60 * 1000);
    currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);

    // Update datum text
    document.getElementById('currentDatetimeValueNapoved').textContent = formatDatetime(currentDatetime);


    //pogruntaj, koliko ur je že od zadnje simulacije
    hoursAfterSimulation = Math.floor((currentDatetimeUtc - lastAladinSimulationGuessUtc) / (1000 * 60 * 60));

    var forecasting_hour = String(Math.floor(hoursAfterSimulation / 3) * 3).padStart(3, '0')


    //Update radar text and image
    document.getElementById('AladinRainImage').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_tcc-rr_' + area + '_' + forecasting_hour + '.png';
    document.getElementById('AladinTempImage').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_t2m_' + area + '_' + forecasting_hour + '.png';
    document.getElementById('AladinWind700Image').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vf925_' + area + '_' + forecasting_hour + '.png';
    document.getElementById('AladinWind1500Image').src = PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_r-t-vf850_' + area + '_' + forecasting_hour + '.png';

    // Za veter ne obstjaa si-neigbour, ampak samo si
    if (area === "si-neighbours") {
        var wind_area = "si"
    } else {
        var wind_area = area
    };
    console.log(wind_area)
    document.getElementById('AladinWind0Image').src = PROBASE_URL + 'model/aladin/field/ad_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vm-va10m_' + wind_area + '_' + forecasting_hour + '.png';


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

function updateVerjetnostna(place) {

    //update location variable
    console.log(place)
    console.log(utcDateToCommonString(lastEcmwfSimulationGuessUtc))


    var placeToVerjetnostnaCode = {
        "ljubljana-bezigrad": "SLOVENIA_MIDDLE",
        "murska-sobota": "SLOVENIA_NORTH-EAST",
        "portoroz": "SLOVENIA_SOUTH-WEST",
        "novo-mesto": "SLOVENIA_SOUTH-EAST",
        "ratece": "SLOVENIA_NORTH-WEST",
    }

    document.getElementById('rain6hProbability').src = PROBASE_URL + 'model/ecmwf/ef_' + utcDateToCommonString(lastEcmwfSimulationGuessUtc) + '_pp_' + placeToVerjetnostnaCode[place] + '_.png';
    document.getElementById('rain24hProbability').src = PROBASE_URL + 'model/ecmwf/ef_' + utcDateToCommonString(lastEcmwfSimulationGuessUtc) + '_tpd_' + placeToVerjetnostnaCode[place] + '_.png';
    document.getElementById('cloudProbability').src = PROBASE_URL + 'model/ecmwf/ef_' + utcDateToCommonString(lastEcmwfSimulationGuessUtc) + '_tccd_' + placeToVerjetnostnaCode[place] + '_.png';
    document.getElementById('tempProbablity').src = PROBASE_URL + 'model/ecmwf/ef_' + utcDateToCommonString(lastEcmwfSimulationGuessUtc) + '_tmnx2m_' + placeToVerjetnostnaCode[place] + '_.png';
    document.getElementById('windSpeedProbability').src = PROBASE_URL + 'model/ecmwf/ef_' + utcDateToCommonString(lastEcmwfSimulationGuessUtc) + '_ff10d_' + placeToVerjetnostnaCode[place] + '_.png';
    document.getElementById('windDirProbability').src = PROBASE_URL + 'model/ecmwf/ef_' + utcDateToCommonString(lastEcmwfSimulationGuessUtc) + '_dd10d_' + placeToVerjetnostnaCode[place] + '_.png';

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


    // Listen for orientation changes
    window.addEventListener("orientationchange", handleOrientationChange);

    // Initial setup to handle the current orientation
    handleOrientationChange();


 
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



