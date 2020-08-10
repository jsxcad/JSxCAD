import puppeteer from 'puppeteer';

export const screenshot = async (html) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 512, height: 2048 });
  page.on('error', (msg) => console.log(msg.text()));
  await page.setContent(html);
  await page.waitForSelector('.notebook.loaded');
  // We set fullPage false so that they're all the same size.
  const pngData = await page.screenshot({ fullPage: false });
  const imageUrls = [];
  for (const element of await page.$$('.note')) {
    const property = await element.getProperty('src');
    imageUrls.push(await property.jsonValue());
  }
  await browser.close();
  return { pngData, imageUrls };
};
