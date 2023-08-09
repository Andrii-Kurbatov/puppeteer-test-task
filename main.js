import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const googleUsername = process.env.EMAIL;
const googlePassword = process.env.PASSWORD;

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args:[
            '--no-sandbox',
            '--disable-gpu',
            '--enable-webgl',
            '--window-size=800,800'
        ]
    });

    const loginUrl = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=AXo7B7Ux3491mLiBVbhDdATvda-aP4KZVoiOjvj9oOO4AJkh80EJtbci_1of-8SdJniy8i5l1Mag5g&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S520176430%3A1691139886644803";
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
    const page = await browser.newPage();

    await page.setUserAgent(ua);
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', googleUsername);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await page.type('input[type="password"]', googlePassword);
    await page.keyboard.press('Enter');

    const cssSelector = '.bsU';

    await page.waitForSelector(cssSelector);
    const text = await page.evaluate(selector => {
        const divElement = document.querySelector(selector);
        if (divElement) {
            return divElement.textContent;
        } else {
            return 'Selector isn\'t found';
        }
    }, cssSelector);

    console.log(text);

    await browser.close();
})();