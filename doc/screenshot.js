const timeout = 120000;

export const screenshot = async (html, { browser }) => {
  let timeoutCount = 0;
  const timeoutLimit = 3;
  const imageUrlList = [];
  for (;;) {
    imageUrlList.length = 0;

    let page;
    try {
      page = await browser.newPage();
      const width = 1024;
      const height = 1024;
      await page.setViewport({ width, height });
      page.on('error', (msg) => console.log(msg.text()));
      try {
        await page.setContent(html, { timeout });
      } catch (error) {
        console.log(error.stack);
        if (timeoutCount++ < timeoutLimit) {
          console.log(`Retry ${timeoutCount}`);
          continue;
        } else {
          throw error;
        }
      }
      timeoutCount = 0;
      try {
        await page.waitForSelector('.notebook.loaded', { timeout });
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
      await page.close();
    }
  }
};
