const path = require('path');
const { getFiles, loadAlbumJson, saveAlbumJson } = require('./util');

exports.xxx = async function () {
  const dir = path.resolve(__dirname, '../public');
  const files = await getFiles(dir);
  if (!files) {
    console.log('can not get files');
    return null;
  }

  return { ggg: 7777, files, h: 35, message: 'json saved' };
};

exports.saveAlbum = async function (albumName, body) {
  if (!albumName) {
    return { error: 'albumName is not provided' };
  }
  const saved = await saveAlbumJson(albumName, body);
  if (!saved) {
    return { error: 'can not write json for', albumName };
  }
  return { saved: true };
};

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
