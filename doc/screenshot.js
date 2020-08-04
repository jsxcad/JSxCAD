import puppeteer from 'puppeteer';

export const screenshot = async (html, { width, height }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 512, height: 512 });
  // page.on('console', (msg) => console.log(msg.text()));
  page.on('error', (msg) => console.log(msg.text()));
  await page.setContent(html);
  await page.waitForSelector('.notebook.loaded');
  const pngData = await page.screenshot({ fullPage: true });
  const imageUrls = [];
  for (const element of await page.$$('.note')) {
    const property = await element.getProperty('src');
    imageUrls.push(await property.jsonValue());
  }
  await browser.close();
  return { pngData, imageUrls };
};
