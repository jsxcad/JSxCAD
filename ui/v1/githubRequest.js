import { getAccessToken, getNewAccessToken } from './accessToken.js';

export const OK = 200;
export const CREATED = 201;
export const CONFLICT = 409;

export const eq = (...values) => (match) => values.includes(match);

export const request = async (isOk, path, method, body, { attempts = 2, format = 'json', service } = {}) => {
  let token = await getAccessToken(service);
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'JSxCAD v0.0.79',
    'Authorization': `token ${token}`
  };
  if (body !== undefined) {
    body = JSON.stringify(body);
  }
  const request = { method, headers, body };
  while (--attempts > 0) {
    if (token === undefined) {
      token = await getNewAccessToken(service, token);
      if (token === undefined) {
        return;
      }
    }
    console.log(`QQ/request/headers: ${JSON.stringify(headers)}`);
    console.log(`QQ/request/body: ${JSON.stringify(body)}`);
    const response = await window.fetch(`https://api.github.com/${path}`, request);
    console.log(`QQ/response/status: ${response.status}`);
    if (isOk(response.status)) {
      switch (format) {
        case 'json': {
          const body = await response.json();
          console.log(`QQ/response/body: ${JSON.stringify(body)}`);
          return body;
        }
        case 'bytes': {
          const body = await response.arrayBuffer();
          console.log(`QQ/response/body: ${JSON.stringify(body)}`);
          return body;
        }
        default: {
          return;
        }
      }
    }
    token = undefined;
  }
};
