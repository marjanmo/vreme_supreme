 
function placeControlBarFixedTop() {
    var navbarHeight = document.querySelector('nav').offsetHeight;
    console.log(navbarHeight)
    controlBars = document.getElementsByClassName('controlBar')

    // Loopaj, ker ne veš, kateri je dejansko viden.
    for (var i = 0; i < controlBars.length; i++) {
        if (controlBars[i].style.display === "block") {
            controlBars[i].style.marginTop = navbarHeight + 'px';
            var controlBarHeight = controlBars[i].offsetHeight

            //Premakni še komplet grid tako, da do vse pod search barom.

            console.log(controlBars[i])
        }

    }

}

