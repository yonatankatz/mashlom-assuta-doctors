const puppeteer = require('puppeteer');
const testCases = require('./testCases')

const LIGHT_TREATMENT = {
  NO_NEED_CARE: 'לא נדרש טיפול באור',
  NEED_CARE: 'נדרש טיפול באור'
}

const TRANSFUSION_RESULT = {
  A: 'עובר את סף החלפת דם (בילירובין גדול מגיל הילד)',
  B: 'עובר את סף החלפת דם',
  C: 'ערך בילירובין מתקרב לסף החלפת דם, יש לשקול מתן IVIG',
  D: 'ערך בילירובין מתקרב לסף החלפת דם',
}

const getPhototherapyResult = async (isUnder38, isRisky, bilirobinValue, ageInHours) => {
  const browser = await puppeteer.launch({headless: true, devtools: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/phototherapy/');


  // Set up the input
  if (isUnder38) {
    await page.click('#under38');
  } else {
    await page.click('#above38');
  }

  if (isRisky) {
    await page.click('#risky');
  } else {
    await page.click('#notRisky');
  }

  await page.focus('#bilirubin');
  await page.keyboard.type(bilirobinValue.toString());
  await page.focus('#ageInHours');
  await page.keyboard.type(ageInHours.toString());

  // Wait for the result to appear
  await page.waitForSelector('#root-diagnose');

  // Sleep for 100ms
  // Hack, but we need to wait for the result to be fully rendered.
  // After moving to react we can move remove the sleep.
  await new Promise(r => setTimeout(r, 100));

  // Get the result and return it
  const rootDiagnose = await page.$eval('#root-diagnose', el => el.textContent);
  const shouldFollowUp = await page.$eval('#should-followup', el => el.clientHeight > 0);
  const _riskZone = await page.$eval('#risk-zone', el => el.textContent);
  const transfusionResult = await page.$eval('#transfusion-result', el => el.textContent);
  
  const needLightTreatment = rootDiagnose.trim() === LIGHT_TREATMENT.NO_NEED_CARE ? false : true;
  // check if _riskZone is a number, if so, parse it to int, else parse it to 0
  const riskZone = isNaN(parseInt(_riskZone)) ? 0 : parseInt(_riskZone);
  await browser.close();

  return { needLightTreatment, riskZone, shouldFollowUp };
}

// should remove
const _sample =    {above38: true, hasRisk: false, ageInHours: 24, bilirubin: 10.5, expectedResult: { needLightTreatment: true, riskZone: 1}}
const sample = [_sample]

describe('Phototherapy-e2e', () => {
  it.each(testCases)(
    "test case %o",
    async ({above38, risk, ageInHours, bilirubin, expectedResult}) => {
      const {needLightTreatment, riskZone, shouldFollowUp} = await getPhototherapyResult(above38, risk, bilirubin, ageInHours);
      expect(needLightTreatment).toEqual(expectedResult.needLightTreatment)
      expect(riskZone).toEqual(expectedResult.riskZone)
      // expect(shouldFollowUp).toEqual(false)
    }
  );

});
