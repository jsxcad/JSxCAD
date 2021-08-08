import puppeteer from 'puppeteer';

export const screenshot = async (html) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const width = 1024;
  const height = 1024;
  await page.setViewport({ width, height });
  page.on('error', (msg) => console.log(msg.text()));
  await page.setContent(html);
  await page.waitForSelector('.notebook.loaded');
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`QQ/height: ${height}`);
  // We set fullPage false so that they're all the same size.
  const pngDataList = [];
  for (let y = 0; y < pageHeight; y += height) {
    pngDataList.push(await page.screenshot({ x: 0, y, width, height, fullPage: true }));
  }
  // TODO: Scroll down and take screenshots until we reach the end.
  const imageUrlList = [];
  for (const element of await page.$$('.note')) {
    const property = await element.getProperty('src');
    imageUrlList.push(await property.jsonValue());
  }
  await browser.close();
  return { pngDataList, imageUrlList };
};
