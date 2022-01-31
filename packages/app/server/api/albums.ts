import type { IncomingMessage, OutgoingMessage } from 'http';
import config from '#config';

type Req = IncomingMessage & { originalUrl: string };

/**
 * default
 */
export default async (req: Req, res: OutgoingMessage) => {
  const { method } = req;
  const path = getUrlPath(req);
  switch (method) {
    case 'GET':
      return getActions(path, req, res);
    case 'POST':
      return postActions(path, req, res);
    default:
      break;
  }
};

/**
 * get
 */
async function getActions(path: string, req: Req, _res: OutgoingMessage) {
  const result = await $fetch(`${config.backendURL}/${path}`);
  return result;
}

/**
 * post
 */
async function postActions(path: string, req: Req, _res: OutgoingMessage) {
  const body = await parseSendParams(req);
  // console.log('そうしんparams', req.headers);
  const result = await $fetch(`${config.backendURL}/${path}`, {
    method: 'POST',
    body,
  });
  return result;
}

/**
 * getUrlPath
 */
function getUrlPath(req: Req): string {
  const { originalUrl } = req;
  return originalUrl.replace('/api/', '');
}

/**
 * getAlbumIdFromUrl
 */
function getAlbumIdFromUrl(req: Req): string | null {
  const { url } = req;
  const m = url.match(/\/([^/]+)/);
  return m && m.length === 2 ? m[1] : null;
}

/**
 * parseSendParams
 */
function parseSendParams(req: Req): object {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (data) => {
      body += data;
    });
    req.on('end', () => {
      try {
        const params = JSON.parse(body);
        resolve(params);
      } catch (error) {
        resolve(body);
      }
    });
  });
}
