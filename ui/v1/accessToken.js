import { log, readFile } from '@jsxcad/sys';

const sleep = (duration) => new Promise((resolve, reject) => setTimeout(resolve, duration));

export const getAccessToken = async (service) =>
  readFile({ project: '.system', useCache: false }, `auth/${service}/accessToken`);

export const getNewAccessToken = async (service, oldToken = undefined, attempts = 10) => {
  await log({ op: 'text', text: `Re-Authenticating ${service}`, level: 'serious' });
  window.open(`http://167.99.163.104:3000/auth/${service}?${service}Callback=${window.location.href}`);
  while (--attempts > 0) {
    const token = await readFile({ project: '.system', useCache: false }, `auth/${service}/accessToken`);
    if (token === undefined || token === oldToken) {
      await sleep(1000);
    }
    if (token !== oldToken) {
      return token;
    }
  }
};
