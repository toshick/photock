import type { IncomingMessage, ServerResponse } from 'http';
import type { Album } from '@/types/apptype';

/**
 * default
 */
export default async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  console.log('リクエスト', url);
  switch (method) {
    case 'GET':
      return getActions(req, res);
    case 'POST':
      return postActions(req, res);
    default:
      break;
  }
};

/**
 * get
 */
async function getActions(req: IncomingMessage, _res: ServerResponse) {
  const albumId = getAlbumIdFromUrl(req);
  if (albumId) {
    // album detail
    const result = await $fetch(`http://localhost:9000/albums/${albumId}`);
    if (result[albumId]) {
      return result[albumId] as Album;
    }
    return { error: 'can not find album key in response object' };
  } else {
    // album list
    const result = await $fetch('http://localhost:9000/albums');
    return result as { albums: Album[] };
  }
}

/**
 * post
 */
async function postActions(req: IncomingMessage, _res: ServerResponse) {
  const params = await parseSendParams(req);
  if (!params) {
    return { error: 'can not parse req params' };
  }
  const albumId = getAlbumIdFromUrl(req);
  if (albumId) {
    const result = await $fetch(`http://localhost:9000/albums/${albumId}`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
    return result as { albums: Album[] };
  }
  return null;
}

/**
 * getAlbumIdFromUrl
 */
function getAlbumIdFromUrl(req: IncomingMessage): string | null {
  const { url } = req;
  const m = url.match(/\/([^/]+)/);
  return m && m.length === 2 ? m[1] : null;
}

/**
 * parseSendParams
 */
function parseSendParams(req: IncomingMessage): object {
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
        resolve(null);
      }
    });
  });
}
