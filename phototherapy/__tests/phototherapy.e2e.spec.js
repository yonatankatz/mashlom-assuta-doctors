const puppeteer = require('puppeteer');
const testCases = require('./testCases')

const LIGHT_TREATMENT = {
  NO_NEED_CARE: 'לא נדרש טיפול באור',
  NEED_CARE: 'נדרש טיפול באור'
}

const BLOOD_TRANSFUSION = {
  ALERT: 'ערך בילירובין מתקרב לסף החלפת דם',
  NEED: 'עובר את סף החלפת דם',
  IVIG: 'ערך בילירובין מתקרב לסף החלפת דם, יש לשקול מתן IVIG',
  NEED_UNDER_SIX: 'עובר את סף החלפת דם (בילירובין גדול מגיל הילד)'
}

const transfusionNameToId = {
  [BLOOD_TRANSFUSION.ALERT]: 'התראה',
  [BLOOD_TRANSFUSION.NEED]: 'עובר',
  [BLOOD_TRANSFUSION.IVIG]: 'התראה IVIG',
  [BLOOD_TRANSFUSION.NEED_UNDER_SIX]: 'עובר גדול מגיל ילוד'
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getPhototherapyResult = async (isAbove38, isRisky, bilirobinValue, ageInHours) => {
  const browser = await puppeteer.launch({headless: true, devtools: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/phototherapy/');


  // Set up the input
  if (isAbove38) {
    await page.click('#above38');
  } else {
    await page.click('#under38');
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
  if (ageInHours <=9){
    await sleep(900);
  }else{
    await sleep(100);
  }

  // Get the result and return it
  const rootDiagnose = await page.$eval('#root-diagnose', el => el.textContent);
  const shouldFollowUp = await page.$eval('#should-followup', el => el.clientHeight > 0);
  const _riskZone = await page.$eval('#risk-zone', el => el.textContent);
  const _transfusionResult = await page.$eval('#transfusion-result', el => el.textContent);
  
  const needLightTreatment = rootDiagnose.trim() === LIGHT_TREATMENT.NO_NEED_CARE ? false : true;
  // check if _riskZone is a number, if so, parse it to int, else parse it to 0
  const riskZone = isNaN(parseInt(_riskZone)) ? 0 : parseInt(_riskZone);
  const transfusionResult = transfusionNameToId[_transfusionResult.trim()] ?? 'ריק';
  
  await browser.close();

  return { needLightTreatment, riskZone, transfusionResult, shouldFollowUp };
}

// should remove
const _sample =    {above38: true, hasRisk: false, ageInHours: 24, bilirubin: 10.5, expectedResult: { needLightTreatment: true, riskZone: 1}}
const sample = [_sample]

describe('Phototherapy-e2e', () => {
  it.each(testCases)(
    "test case %o",
    async ({above38, hasRisk, ageInHours, bilirubin, expectedResult}) => {
      const {needLightTreatment, riskZone, transfusionResult} = await getPhototherapyResult(above38, hasRisk, bilirubin, ageInHours);
      expect(needLightTreatment).toEqual(expectedResult.needLightTreatment)
      expect(riskZone).toEqual(expectedResult.riskZone)
      expect(transfusionResult).toEqual(expectedResult.transfusionResult)
      // expect(shouldFollowUp).toEqual(false)
    }
  );

});
