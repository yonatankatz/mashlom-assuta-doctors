const puppeteer = require('puppeteer');

const noNeedCare = 'לא נדרש טיפול באור'
const needCare = 'נדרש טיפול באור'

const getResult = async (isUnder38, isRisky, bilirobinValue, ageInHours) => {
  const browser = await puppeteer.launch({headless: false, devtools: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/phototherapy/');


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

  // await page.$eval('#bilirubin', (el, value) => el.value = value, bilirobinValue);
  // await page.$eval('#ageInHours', (el, value) => el.value = value, ageInHours);

  await page.focus('#bilirubin');
  await page.keyboard.type(bilirobinValue.toString());
  await page.focus('#ageInHours');
  await page.keyboard.type(ageInHours.toString());

  // await for element with id root-diagnose to appear
  await page.waitForSelector('#root-diagnose');

  // get value of element with id root-diagnose
  const result = await page.$eval('#root-diagnose', el => el.textContent);

  await browser.close();

  return result.trim()
}


describe('Phototherapy-e2e', () => {

  it('should display correct result for risky baby with bilirubin 10 and age 10', async () => {
    const result = await getResult(true, true, 10, 10)
    expect(result).toBe(needCare);
  });

});