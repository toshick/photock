const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const JSON_FILE_NAME = 'data.json';

/**
 * getFiles
 */
exports.getFiles = (path) => {
  return new Promise((resolve) => {
    return glob(`${path}/**/*`, (err, files) => {
      if (err) {
        resolve(null);
        return;
      }
      const ret = files.filter((file) => {
        console.log('file', file);
        if (file.toLowerCase().match(/(jpg|jpeg|png|gif)$/)) return true;
        return false;
      });
      resolve(ret);
    });
  });
};

/**
 * saveJson
 */
exports.saveJson = (path, data) => {
  return fs
    .writeJson(path, data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log('err', err);
      return false;
    });
};

/**
 * saveAlbumJson
 */
exports.saveAlbumJson = (albumName, data) => {
  const dir = path.resolve(__dirname, '../public/albums', albumName);
  try {
    fs.ensureDirSync(dir);
  } catch (error) {
    return false;
  }

  return exports.saveJson(path.resolve(dir, JSON_FILE_NAME), data);
};

/**
 * loadAlbumJson
 */
exports.loadAlbumJson = (albumName) => {
  const filepath = path.resolve(
    __dirname,
    '../public/albums',
    albumName,
    JSON_FILE_NAME,
  );
  try {
    const data = fs.readJsonSync(filepath);
    return data;
  } catch (error) {
    return null;
  }
};
