import puppeteer from 'puppeteer';

export const screenshot = async (html) => {
  let timeoutCount = 0;
  const timeoutLimit = 3;
  const imageUrlList = [];
  for (;;) {
    let browser;
    try {
      imageUrlList.length = 0;

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      const width = 1024;
      const height = 1024;
      await page.setViewport({ width, height });
      page.on('error', (msg) => console.log(msg.text()));
      await page.setContent(html);
      try {
        await page.waitForSelector('.notebook.loaded', { timeout: 60000 });
      } catch (error) {
        console.log(error.stack);
        if (timeoutCount++ < timeoutLimit) {
          console.log(`Retry ${timeoutCount}`);
          continue;
        } else {
          throw error;
        }
      }
      for (const element of await page.$$('.note.view')) {
        const property = await element.getProperty('src');
        imageUrlList.push(await property.jsonValue());
      }
      return { imageUrlList };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
};
