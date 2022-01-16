const uuid = require('uuid');
const path = require('path');
const {
  getFiles,
  loadAlbumJson,
  saveAlbumJson,
  getAlbumImgs,
  removeFiles,
} = require('./util');
const pathPublic = path.join(__dirname, '../public');

/**
 * xxx
 */
exports.xxx = async function () {
  const dir = path.resolve(__dirname, '../public/**/*');
  const files = await getFiles(dir);
  if (!files) {
    console.log('can not get files');
    return null;
  }
  const myfiles = files.filter((file) => {
    console.log('file', file);
    if (file.toLowerCase().match(/(jpg|jpeg|png|gif)$/)) return true;
    return false;
  });

  return { ggg: 7777, files: myfiles, h: 35, message: 'json saved' };
};

/**
 * saveAlbum
 */
exports.saveAlbum = async function (albumId, body) {
  if (!albumId) {
    return { error: 'albumId is not provided' };
  }
  const saved = await saveAlbumJson(albumId, body);
  if (!saved) {
    return { error: 'can not write json for', albumId };
  }
  return { saved: true };
};

/**
 * loadAlbum
 */
exports.loadAlbum = async function (albumId) {
  if (!albumId) {
    return { error: 'albumId is not provided' };
  }

  const loaded = await loadAlbumJson(albumId);
  if (!loaded) {
    return { error: 'can not read json for', albumId };
  }
  const items = loaded.items || [];
  const imgs = (await getAlbumImgs(albumId)) || [];
  imgs.forEach((path) => {
    const imgpath = path.replace(/^.+public/, '');
    const find = items.find((i) => i.img === imgpath);
    if (!find) {
      items.push({ img: imgpath, id: uuid.v4() });
    }
  });

  return { items, albumDescription: loaded.albumDescription || '' };
};

/**
 * listAlbums
 */
exports.listAlbums = async function () {
  const dirs = await getFiles(path.join(__dirname, '../public/albums/*'));
  if (dirs === null) {
    return { error: 'can not read album list' };
  }
  return {
    albums: dirs.map((path) => {
      return { name: path.split('/').pop(), path };
    }),
  };
};

/**
 * removeAlbumItem
 */
exports.removeAlbumItem = async function (albumId, itemId) {
  // load data first
  const loaded = await loadAlbumJson(albumId);
  const items = loaded.items || [];
  // find target
  const item = await getAlbumItem(albumId, itemId);
  if (!item) {
    return { error: 'can not find Album item', itemId };
  }
  const targetPath = path.join(pathPublic, item.img);
  const resultRemove = await removeFiles([targetPath]);
  if (resultRemove.error) {
    return resultRemove;
  }
  // remove item from json
  loaded.items = items.filter((i) => i.id !== item.id);
  const res = await exports.saveAlbum(albumId, loaded);
  if (res.error) {
    return res;
  }
  return { ok: true };
};

/**
 * resetAlbumItem
 */
exports.resetAlbumItem = async function (albumId) {
  const imgs = await getFiles(
    path.join(__dirname, `../public/albums/${albumId}/*`),
  );
  if (imgs === null) {
    return { ok: 'no items' };
  }
  const resultRemove = await removeFiles(imgs);
  if (resultRemove.error) {
    return resultRemove;
  }
  return { ok: true };
};

/**
 * getAlbumItem
 */
async function getAlbumItem(albumId, itemId) {
  const loaded = await loadAlbumJson(albumId);
  if (!loaded) {
    return { error: 'can not read json for', albumId };
  }
  const items = loaded.items || [];
  const find = items.find((i) => i.id === itemId);
  if (find) return find;
  return null;
}
