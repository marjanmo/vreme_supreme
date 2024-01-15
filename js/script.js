
// Set a base datetime, rounded to last hour
var baseDatetime = new Date();
baseDatetime.setMinutes(0);
baseDatetime.setSeconds(0);
console.log(baseDatetime)
// določi začetne vrednosti
var currentDatetime = baseDatetime
var currentDatetimeUtc = new Date(currentDatetime.getTime() - 1 * 60 * 60 * 1000)
var currentDatetimeUtcRounded = new Date(currentDatetimeUtc.getTime())
var lastAladinSimulationGuessUtc = roundToLast12Hours(new Date(currentDatetimeUtc.getTime() - 5 * 60 * 60 * 1000)) // predpostavljaš, da se 5 ur računa nov run
var lastEcmwfSimulationGuessUtc = roundToLast1200(new Date(currentDatetimeUtc.getTime() - 7 * 60 * 60 * 1000)) // predpostavljaš, da se 7 ur računa nov run  (zadnji dan ob 12h)


function setForecastingSteps() {

    const rangeSlider = document.getElementById('napovedSlider');

    // min forecasting hour
    var start = lastAladinSimulationGuessUtc.getTime() - currentDatetimeUtc.getTime()
    var start = Math.round((start / (1000 * 60 * 60)))
    console.log(lastAladinSimulationGuessUtc)
    console.log(currentDatetimeUtc)
    console.log(start)
    rangeSlider.min = start + 3;  // čisto zadnjega ne najde


    // max forecasting hour
    const lastAladinLastDate = new Date(lastAladinSimulationGuessUtc.getTime() + 72 * 60 * 60 * 1000)

    var end = lastAladinLastDate.getTime() - currentDatetimeUtc.getTime()
    var end = Math.round((end / (1000 * 60 * 60)))
    console.log(lastAladinLastDate)
    console.log(currentDatetimeUtc)
    console.log(end)
    rangeSlider.max = end;

}

const PROBASE_URL = 'https://meteo.arso.gov.si/uploads/probase/www/'


// Function to show content, update preferences, and toggle active class
function handleMainButtonClick(button) {

    // Prikaži kateri glavni tab je aktiven in updajtaj variablo
    toggleActive(button, 'main-buttons');


    // Preberi data-kategorijo, iz aktivnega gumba 
    const tab = button.dataset.tab

    // Save the active button in localStorage
    localStorage.setItem('activeTab', tab);

    // Poišči elemente s tem tabom in jih prikaži
    // Moras imeti syncane data-tab propertyje med main-button, controlbar in contentom
    showContent(tab, 'content');
    showContent(tab, 'controlBar');
    
    if (tab == "analiza") {
        updateAnaliza()

        focusOnSlider("analizaSlider")


    } else if (tab == "napoved") {
        var activeArea = localStorage.getItem('activeArea') || "si-neighbours"

        // Pohandlaj kot da je že kliknil tudi na zadnji aktivni button.
        activeAreaButton = document.querySelector('button[data-area="' + activeArea + '"]')
        handleAreaButtonClick(activeAreaButton)

        setForecastingSteps()

        focusOnSlider("napovedSlider")


    } else if (tab == "casovniPresek") {
        var activePlace = localStorage.getItem('activePlace') || "ljubljana-bezigrad"

        activePlaceButton = document.querySelector('#controlBarCasovniPresek button[data-place="' + activePlace + '"]')
        handlePlaceCasovniButton(activePlaceButton)
        
        updateCasovniPresek()

    } else if (tab == "verjetnostnaNapoved") {
        var activePlace = localStorage.getItem('activePlace') || "ljubljana-bezigrad"
        
        activePlaceButton = document.querySelector('#controlBarVerjetnostnaNapoved button[data-place="' + activePlace + '"]')
        handlePlaceVerjetnostnaButton(activePlaceButton)

        updateVerjetnostna()
    }



}


function handleAreaButtonClick(button) {
    
    // Javi kot poklikano
    toggleActive(button, "area-buttons");

    // Preberi data 
    var area = button.dataset.area

    // Shrani v browser bazo
    localStorage.setItem("activeArea", area)

    // Updajtaj vsebino
    updateNapoved()

    //bug - slider ne dobi nove spremembe area.

}


function handlePlaceCasovniButton(button) {

    toggleActive(button, "place-buttons")

    var place = button.dataset.place

    // Save the active button in localStorage. Share it with Verjetnostna
    localStorage.setItem('activePlace', place);

    updateCasovniPresek()


}

function handlePlaceVerjetnostnaButton(button) {

    toggleActive(button, "place-buttons")

    var place = button.dataset.place

    // Save the active button in localStorage. Share it with Casovni
    localStorage.setItem('activePlace', place);

    updateVerjetnostna()



}

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

function updateNapoved() {
    
    // Save the active button in localStorage. To moraš po vsakem updatu, da ker lahko vmes preklopiš area
    area = localStorage.getItem('activeArea');


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

    document.getElementById('AladinWind0Image').src = PROBASE_URL + 'model/aladin/field/ad_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vm-va10m_' + wind_area + '_' + forecasting_hour + '.png';

};


function updateCasovniPresek() {

    // Preveri, o katerem place je govora
    place = localStorage.getItem('activePlace');

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

function updateVerjetnostna() {

    // Preveri, o katerem place je govora
    place = localStorage.getItem('activePlace');

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

    // Preberi user nastavitve iz cache. Če ga ni, predpostavi napoved
    var activeTab = localStorage.getItem('activeTab') || "napoved";

    // Najti ustrezen gumb in ga pohandlaj.
    activeTabButton = document.querySelector('button[data-tab="'+activeTab+'"]')
    handleMainButtonClick(activeTabButton);


    // Poskrbi, da bo vedno content pod navbarom
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


});



