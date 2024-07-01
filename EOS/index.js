// initialize variables
let intercept = 0;
let tempimp = 0;
let Romimp = 0
let ga4mdlng = 0
let ga4mdlng_sq = 0;
let Approptx = '';
let Approptx1 = 0
let Approptx2 = 0
let J_gbscar = '';
let J_gbscarPlus = 0
let J_gbscarU = 0
let days = 0;

// function definition
function computeApproptx1() {
    const radios = document.getElementsByName('antibiotics');
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            Approptx = radios[i].value
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    // 1 if GBS specific antibiotics are given ≥2 hours prior to deliver OR any antibiotics given 2-3.9 hours prior to delivery, otherwise 0
    if (Approptx === 'GBS-2' || Approptx === 'broad-2') {
      return 1
    } else {
      return 0
    }
}

function computeApproptx2() {
    const radios = document.getElementsByName('antibiotics');
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            Approptx = radios[i].value
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    // 1 if Broad-spectrum antibiotics given ≥4 hours prior to delivery, otherwise 0
    if (Approptx === 'broad-4') {
      return 1
    } else {
      return 0
    }
}

function computeJ_gbscarPlus() {
    const radios = document.getElementsByName('GBS');
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            J_gbscar = radios[i].value
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    // 1 if GBS status is positive, otherwise 0
    if (J_gbscar === 'positive') {
      return 1
    } else {
      return 0
    }
}

function computeJ_gbscarU() {
    const radios = document.getElementsByName('GBS');
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            J_gbscar = radios[i].value
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    // 1 if GBS status is unknown, otherwise 0
    if (J_gbscar === 'unknown') {
      return 1
    } else {
      return 0
    }
}

function computeInterceptBeta() {
    // EOS incidence 0.3/1000 Live Births	40.0528
    // EOS incidence 0.4/1000 Live Births	40.3415
    // EOS incidence 0.5/1000 Live Births	40.5656
    // EOS incidence 0.6/1000 Live Births	40.7489
    if (intercept === "0.3") {
        return 40.0528
    } else if (intercept === "0.4") {
        return 40.3415
    } else if (intercept === "0.5") {
        return 40.5656
    } else if (intercept === "0.6") {
        return 40.7489
    } else {
        return 0
    }
}

function computega4mdlng() {
    return (Number(ga4mdlng) + (Number(days) / 7));
}

function computeEOSChance() {
        console.log(computeInterceptBeta());
        console.log(0.8680 * tempimp) ;
        console.log(1.2256 * Romimp)
        console.log(6.9325 * computega4mdlng())
        console.log(0.0877 * ga4mdlng_sq)
        console.log(1.0488 * computeApproptx1())
        console.log(1.1861 * computeApproptx2())
        console.log((0.5771 * computeJ_gbscarPlus()))
        console.log((0.0427 * computeJ_gbscarU()))
      //                  intercept              + (0.8680[tempimp])  - (6.9325[ga4mdlng])  + (0.0877 [ga4mdlng_sq]) + (1.2256[romimp])  - (1.0488[approptx1])  - (1.1861[approptx2])  + (0.5771[j_gbscar(+)])   + (0.0427[j_gbscar(u)])
      const Betas =  computeInterceptBeta() + (0.8680 * tempimp) - (6.9325 * computega4mdlng()) + (0.0877 * ga4mdlng_sq) + (1.2256 * Romimp) - (1.0488 * computeApproptx1()) - (1.1861 * computeApproptx2()) + (0.5771 * computeJ_gbscarPlus()) + (0.0427 * computeJ_gbscarU())
      alert( ((1 / (1 + Math.E ** -Betas)) * 1000))
}

// listen to variables
window.onload =  () => {
    const interceptElement = document.getElementById("intercept")
    intercept = interceptElement.value;
    interceptElement.addEventListener("input", (event) => {
        intercept = interceptElement.value;
    })

    const tempimpElement = document.getElementById("tempimp")
    tempimp = (tempimpElement.value * (9/5)) + 32
    tempimpElement.addEventListener("input", (event) => {
        tempimp = (tempimpElement.value * (9/5)) + 32 // convert to C from F;
    })

    const RomimpElement = document.getElementById("Romimp")
    Romimp = Math.pow((Number(RomimpElement.value) + 0.05), 0.2)
    RomimpElement.addEventListener("input", (event) => {
        Romimp = Math.pow((Number(RomimpElement.value) + 0.05), 0.2)
    })

    const ga4mdlngElement = document.getElementById("ga4mdlng-weeks")
    ga4mdlng = ga4mdlngElement.value;
    ga4mdlngElement.addEventListener("input", (event) => {
        ga4mdlng = ga4mdlngElement.value;
        ga4mdlng_sq = Math.pow(ga4mdlng, 2) // square the value
    })

    const daysElement = document.getElementById("ga4mdlng-days")
    daysElement.value = 0;
    daysElement.addEventListener('input', (event) => {
        days = daysElement.value;
    })

    const btnElement = document.getElementById("computeEOSButton");
    btnElement.addEventListener("click", (event) => {
        computeEOSChance()
    })
}


