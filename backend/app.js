const path = require('path');
const { getFiles, loadAlbumJson, saveAlbumJson } = require('./util');

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
exports.saveAlbum = async function (albumName, body) {
  console.log('saveAlbumです', albumName, body);
  if (!albumName) {
    return { error: 'albumName is not provided' };
  }
  const saved = await saveAlbumJson(albumName, body);
  if (!saved) {
    return { error: 'can not write json for', albumName };
  }
  return { saved: true };
};

/**
 * loadAlbum
 */
exports.loadAlbum = async function (albumName) {
  if (!albumName) {
    return { error: 'albumName is not provided' };
  }

  const loaded = await loadAlbumJson(albumName);
  if (!loaded) {
    return { error: 'can not read json for', albumName };
  }
  return { [albumName]: loaded };
};

/**
 * listAlbums
 */
exports.listAlbums = async function () {
  const dirs = await getFiles(path.resolve(__dirname, '../public/albums/*'));
  if (dirs === null) {
    return { error: 'can not read album list' };
  }
  return {
    albums: dirs.map((path) => {
      return { name: path.split('/').pop(), path };
    }),
  };
};
