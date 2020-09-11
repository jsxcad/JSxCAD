import { log, read } from '@jsxcad/sys';

const sleep = (duration) =>
  new Promise((resolve, reject) => setTimeout(resolve, duration));

export const getAccessToken = async (service) => {
  const token = await read(`auth/${service}/accessToken`, {
    workspace: '.system',
    useCache: false,
    decode: 'utf8',
  });
  if (typeof token !== 'string') {
    return new TextDecoder('utf8').decode(token);
  }
  return token;
};

export const getNewAccessToken = async (
  service,
  oldToken = undefined,
  attempts = 10
) => {
  await log({
    op: 'text',
    text: `Re-Authenticating ${service}`,
    level: 'serious',
  });
  window.open(
    `http://167.99.163.104:3000/auth/${service}?${service}Callback=${window.location.href}`
  );
  while (--attempts > 0) {
    const token = await getAccessToken(service);
    if (token === undefined || token === oldToken) {
      await sleep(1000);
    }
    if (token !== oldToken) {
      return token;
    }
  }
};
