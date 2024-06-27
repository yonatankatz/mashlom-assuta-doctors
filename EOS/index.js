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

// function definition
function computeApproptx1() {
    // 1 if GBS specific antibiotics are given ≥2 hours prior to deliver OR any antibiotics given 2-3.9 hours prior to delivery, otherwise 0
    if (Approptx === 'GBS-2' || Approptx === 'broad-2') {
      return 1
    } else {
      return 0
    }
}

function computeApproptx2() {
    // 1 if Broad-spectrum antibiotics given ≥4 hours prior to delivery, otherwise 0
    if (Approptx === 'broad-4') {
      return 1
    } else {
      return 0
    }
}

function computeJ_gbscarPlus() {
    // 1 if GBS status is positive, otherwise 0
    if (J_gbscar === 'positive') {
      return 1
    } else {
      return 0
    }
}

function computeJ_gbscarU() {
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

function computeEOSChance() {
        console.log(computeInterceptBeta());
        console.log(0.8680 * tempimp) ;
        console.log(1.2256 * Romimp)
        console.log(6.9325 * ga4mdlng)
        console.log(0.0877 * ga4mdlng_sq)
        console.log(1.0488 * Approptx1)
        console.log(1.1861 * Approptx2)
        console.log((0.5771 * J_gbscarPlus))
        console.log((0.0427 * J_gbscarU))
      //                  intercept              + (0.8680[tempimp])  - (6.9325[ga4mdlng])  + (0.0877 [ga4mdlng_sq]) + (1.2256[romimp])  - (1.0488[approptx1])  - (1.1861[approptx2])  + (0.5771[j_gbscar(+)])   + (0.0427[j_gbscar(u)])
      const Betas =  computeInterceptBeta() + (0.8680 * tempimp) - (6.9325 * ga4mdlng) + (0.0877 * ga4mdlng_sq) + (1.2256 * Romimp) - (1.0488 * Approptx1) - (1.1861 * Approptx2) + (0.5771 * J_gbscarPlus) + (0.0427 * J_gbscarU)
      console.log(Betas)
      alert( (1 / (1 + Math.E ** -Betas)))
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

    const ga4mdlngElement = document.getElementById("ga4mdlng")
    ga4mdlng = ga4mdlngElement.value;
    ga4mdlngElement.addEventListener("input", (event) => {
        ga4mdlng = ga4mdlngElement.value;
        ga4mdlng_sq = Math.pow(ga4mdlng, 2) // square the value
    })

    const ApproptxElement = document.getElementById("Approptx")
    Approptx = ApproptxElement.value;
    ApproptxElement.addEventListener("input", (event) => {
        Approptx = ApproptxElement.value;
        Approptx1 = computeApproptx1()
        Approptx2 = computeApproptx2()
    })

    const J_gbscarElement = document.getElementById("J_gbscar")
    J_gbscar = J_gbscarElement.value;
    J_gbscarElement.addEventListener("input", (event) => {
        J_gbscar = J_gbscarElement.value;
        J_gbscarPlus = computeJ_gbscarPlus()
        J_gbscarU = computeJ_gbscarU()
    })

    const btnElement = document.getElementById("computeEOSButton");
    btnElement.addEventListener("click", (event) => {
        computeEOSChance()
    })
}


