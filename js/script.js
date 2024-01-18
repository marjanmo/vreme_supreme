
// Set a base datetime, rounded to last hour
var baseDatetime = new Date();
baseDatetime.setMinutes(0);
baseDatetime.setSeconds(0);

// določi začetne vrednosti
var currentDatetime = baseDatetime
var currentDatetimeUtc = new Date(currentDatetime.getTime() - 1 * 60 * 60 * 1000)
var currentDatetimeUtcRounded = new Date(currentDatetimeUtc.getTime())
var lastAladinSimulationGuessUtc = roundToLast12Hours(new Date(currentDatetimeUtc.getTime() - 5 * 60 * 60 * 1000)) // predpostavljaš, da se 5 ur računa nov run
var lastEcmwfSimulationGuessUtc = roundToLast1200(new Date(currentDatetimeUtc.getTime() - 9 * 60 * 60 * 1000)) // predpostavljaš, da se 9 ur računa nov run  (zadnji dan ob 12h - enkrat ob 20.45 še ni bil 12 runa)
var lastRadarGuess = roundToLastNMinutes(new Date(new Date().getTime() - (5 * 60 * 1000)), 10) // predpostavljaš, da se 5 minut obdeluje zadnji radar in na 10 minute se objavljajo.


var isAnalizaPreloaded = false
var isNapovedPreloaded = false

const PROBASE_URL = 'https://meteo.arso.gov.si/uploads/probase/www/'


function setForecastingSteps() {

    const rangeSlider = document.getElementById('napovedSlider');

    // min forecasting hour
    var start = lastAladinSimulationGuessUtc.getTime() - currentDatetimeUtc.getTime()
    var start = Math.round((start / (1000 * 60 * 60)))

    rangeSlider.min = start + 3;  // čisto zadnjega ne najde


    // max forecasting hour
    const lastAladinLastDate = new Date(lastAladinSimulationGuessUtc.getTime() + 72 * 60 * 60 * 1000)

    var end = lastAladinLastDate.getTime() - currentDatetimeUtc.getTime()
    var end = Math.round((end / (1000 * 60 * 60)))

    rangeSlider.max = end;

}


// Function to show content, update preferences, and toggle active class
function handleMainButtonClick(button) {

    // Prikaži kateri glavni tab je aktiven in updajtaj variablo
    toggleActiveButton(button, 'main-buttons');


    // Preberi data-kategorijo, iz aktivnega gumba 
    const tab = button.dataset.tab

    // Save the active button in localStorage
    localStorage.setItem('activeTab', tab);

    // Poišči elemente s tem tabom in jih prikaži
    // Moras imeti syncane data-tab propertyje med main-button, controlbar in contentom
    toggleVisibleContent('content', 'tab', tab);
    toggleVisibleContent('controlBar', 'tab', tab);
    
    if (tab == "analiza") {
        updateAnaliza()

        focusOnSlider("analizaSlider")


    } else if (tab == "napoved") {
        var activeArea = localStorage.getItem('activeArea') || "si-neighbours"

        setForecastingSteps()

        // Pohandlaj kot da je že kliknil tudi na zadnji aktivni button.
        activeAreaButton = document.querySelector('button[data-area="' + activeArea + '"]')
        handleAreaButtonClick(activeAreaButton)


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

    } else if (tab == "textNapoved") {
        var activeText = localStorage.getItem('activeText') || "general"
        
        activeTextNapovedButton = document.querySelector('#controlBarTextNapoved button[data-text="' + activeText + '"]')

        handleTextNapovedButtonClick(activeTextNapovedButton)

    }



}


function handleAreaButtonClick(button) {
    
    // Javi kot poklikano
    toggleActiveButton(button, "area-buttons");

    // Preberi data 
    var area = button.dataset.area

    // Shrani v browser bazo
    localStorage.setItem("activeArea", area)

    // Updajtaj vsebino
    updateNapoved()

    //bug - slider ne dobi nove spremembe area.

}


function handlePlaceCasovniButton(button) {

    toggleActiveButton(button, "place-buttons")

    var place = button.dataset.place

    // Save the active button in localStorage. Share it with Verjetnostna
    localStorage.setItem('activePlace', place);

    updateCasovniPresek()


}

function handlePlaceVerjetnostnaButton(button) {

    toggleActiveButton(button, "place-buttons")

    var place = button.dataset.place

    // Save the active button in localStorage. Share it with Casovni
    localStorage.setItem('activePlace', place);

    updateVerjetnostna()

}


function handleTextNapovedButtonClick(button) {

    toggleActiveButton(button, "text-buttons")

    var text = button.dataset.text

    localStorage.setItem('activeText', text);

    updateTextForecast()

}

function updateAnaliza() {
    
    var slider = document.getElementById('analizaSlider')

    //Updajtaj datume
    // Calculate the new datetime based on the slider value (rounded to 10 minutes)
    currentDatetime = new Date(lastRadarGuess.getTime() + slider.value * 10 * 60 * 1000);
    currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);
    currentDatetimeUtcRounded = new Date(currentDatetimeUtc.getTime());
    currentDatetimeUtcRounded.setMinutes(0);

    
    document.getElementById('currentDatetimeValueAnaliza').textContent = formatDatetime(currentDatetime) + "  (" + RelativeDateFormat(currentDatetime, baseDatetime) + ")";
    document.getElementById('radarImage').src = PROBASE_URL + 'observ/radar/si0_' + utcDateToCommonString(currentDatetimeUtc) + '_zm_si.jpg';
    document.getElementById('satelliteImageSLO').src = PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_hrv_si.jpg';
    document.getElementById('satelliteImageEU').src = PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_ir_sateu.jpg';

    // Ko je default value
    if (!isAnalizaPreloaded) {
        preloadAnaliza()
    }
};


function preloadAnaliza() {

    var slider = document.getElementById('analizaSlider')
    slider.disabled = true;

    // Pokaži loading button
    document.getElementById('loading-icon-analiza').style.visible = 'visible';


    //Sestavi seznam slik za prepingat.
    all_images = []
    // max lahko izkljucis, ker si ga itak že loadal initially na suho.
    for (var i = slider.min; i < slider.max; i++) {

        currentDatetime = new Date(baseDatetime.getTime() + i * 10 * 60 * 1000);
        currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);

        all_images.push(PROBASE_URL + 'observ/radar/si0_' + utcDateToCommonString(currentDatetimeUtc) + '_zm_si.jpg');

        // Samo prvo uro gledaš.
        if (currentDatetime.getMinutes() === 0) {
            all_images.push(PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_hrv_si.jpg');
            all_images.push(PROBASE_URL + 'observ/satellite/msg_' + utcDateToCommonString(currentDatetimeUtcRounded) + '_ir_sateu.jpg');
        }

    }

    // Loopaj po fotkah in jih prelaodaj
    // Ko prepinga vse fotke, lahko ugasneš loader in odblokiraš slider
    preloadImages(all_images)
        .then(() => {

            document.getElementById('loading-icon-analiza').style.visibility = 'hidden';
            slider.disabled = false;

            isAnalizaPreloaded = true;

        })
    .catch((error) => {
        console.error('Error preloading images:', error);
    });




}


function updateNapoved() {
    
    // Save the active button in localStorage. To moraš po vsakem updatu, da ker lahko vmes preklopiš area
    area = localStorage.getItem('activeArea');


    const slider = document.getElementById('napovedSlider');
    
    // V slajderju klices funkcijo brez imena, zato moraš pogruntat, kateri je aktiven gumb. Area se skriva v idju tega gumba
    if (area == undefined) {
        area = getActiveButtonId('area-buttons')
    };

    //Updajtaj datume
    // Calculate the new datetime based on the slider value (rounded to 1 hour)
    currentDatetime = new Date(baseDatetime.getTime() + slider.value * 60 * 60 * 1000);
    currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);

    document.getElementById('currentDatetimeValueNapoved').textContent = formatDatetime(currentDatetime) + "  (" + RelativeDateFormat(currentDatetime, baseDatetime) + ")";


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


    if (!isNapovedPreloaded) {
        preloadNapoved()
    }


};


function preloadNapoved() {

    var slider = document.getElementById('napovedSlider')
    slider.disabled = true;

    // Pokaži loading button
    document.getElementById('loading-icon-napoved').style.visibility = 'visible';


    //Sestavi seznam slik za prepingat.
    all_images = []
    // max lahko izkljucis, ker si ga itak že loadal initially na suho.
    for (var i = slider.min; i < slider.max; i++) {
        

        // Calculate the new datetime based on the slider value (rounded to 1 hour)
        currentDatetime = new Date(baseDatetime.getTime() + i * 60 * 60 * 1000);
        currentDatetimeUtc = new Date(currentDatetime.getTime() - 60 * 60 * 1000);

        //pogruntaj, koliko ur je že od zadnje simulacije
        hoursAfterSimulation = Math.floor((currentDatetimeUtc - lastAladinSimulationGuessUtc) / (1000 * 60 * 60));

        var forecasting_hour = String(Math.floor(hoursAfterSimulation / 3) * 3).padStart(3, '0')

        for (const area of ["si-neighbours", "alps-adriatic"]) {
            //Update radar text and image
            all_images.push(PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_tcc-rr_' + area + '_' + forecasting_hour + '.png');
            all_images.push(PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_t2m_' + area + '_' + forecasting_hour + '.png');
            all_images.push(PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vf925_' + area + '_' + forecasting_hour + '.png');
            all_images.push(PROBASE_URL + 'model/aladin/field/as_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_r-t-vf850_' + area + '_' + forecasting_hour + '.png');

            // Za veter ne obstjaa si-neigbour, ampak samo si
            if (area === "si-neighbours") {
                var wind_area = "si"
            } else {
                var wind_area = area
            };

            all_images.push(PROBASE_URL + 'model/aladin/field/ad_' + utcDateToCommonString(lastAladinSimulationGuessUtc) + '_vm-va10m_' + wind_area + '_' + forecasting_hour + '.png');

        }

    }

    // Loopaj po fotkah in jih prelaodaj
    // Ko prepinga vse fotke, lahko ugasneš loader in odblokiraš slider
    preloadImages(all_images)
        .then(() => {

            document.getElementById('loading-icon-napoved').style.visibility = 'hidden';
            slider.disabled = false;

            isNapovedPreloaded = true;

        })
    .catch((error) => {
        console.error('Error preloading images:', error);
    });




}



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

function updateTextForecast() {

    text = localStorage.getItem("activeText")

    // Najdi textNapoved kontainer.
    let container = document.querySelector('.textNapovedType[data-text="' + text +'"]');
    
    // Prikaži tapravi kontainer. To zato, da ni lahko samo 1x loadaš, ne pa ob vsakem kliku.
    toggleVisibleContent("textNapovedType", "text", text)


    // Če je bil v sessionu že populiran, potem skenslaj.
    if (container.hasChildNodes()) {
        console.log(container)
        return
    }

    if (text == "aviation") {
        parseAviationForecastData(container)
    } else {
        parseGeneralForecastData(container) 
    }
}


document.addEventListener('DOMContentLoaded', function () {

    // Initialize tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({
            // https://stackoverflow.com/questions/33584392/bootstraps-tooltip-doesnt-disappear-after-button-click-mouseleave
            trigger: 'hover',
            // https://stackoverflow.com/questions/15170967/how-to-delay-show-hide-of-bootstrap-tooltips 
            'delay': { show: 1000, hide: 0 },
            'placement': "right"

        })
    });

    if (window.innerWidth < 576) {
        // Find all tooltips and remove their 'data-toggle' attribute
        document.querySelectorAll('[data-toggle="tooltip"]').forEach(function (element) {
            element.removeAttribute('data-toggle');
        });
    }
 

    // Preberi user nastavitve iz cache. Če ga ni, predpostavi napoved
    var activeTab = localStorage.getItem('activeTab') || "napoved";

    // Najti ustrezen gumb in ga pohandlaj.
    activeTabButton = document.querySelector('button[data-tab="'+activeTab+'"]')
    handleMainButtonClick(activeTabButton);


    // Poskrbi, da bo vedno content pod navbarom
    placeMainBelowNavbar()

    window.addEventListener('resize', placeMainBelowNavbar());


});



