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
  const pageHeight = await page.evaluate(() => {
    let pageHeight = 0;

    const findHighestNode = (nodesList) => {
      for (let i = nodesList.length - 1; i >= 0; i--) {
        if (nodesList[i].scrollHeight && nodesList[i].clientHeight) {
          const elHeight = Math.max(
            nodesList[i].scrollHeight,
            nodesList[i].clientHeight
          );
          pageHeight = Math.max(elHeight, pageHeight);
        }
        if (nodesList[i].childNodes.length) {
          findHighestNode(nodesList[i].childNodes);
        }
      }
    };

    findHighestNode(document.documentElement.childNodes);

    return pageHeight;
  });
  await page.setViewport({ width, height: pageHeight });
  // We set fullPage false so that they're all the same size.
  const pngDataList = [];
  for (let y = 0; y < pageHeight; y += 1024) {
    pngDataList.push(
      await page.screenshot({
        clip: { x: 0, y, width: 1024, height: 1024 },
        captureBeyondViewport: true,
      })
    );
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
