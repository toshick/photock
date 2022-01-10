const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const JSON_FILE_NAME = 'data.json';
const initialData = { items: [], description: '' };

/**
 * getFiles
 */
exports.getFiles = (path) => {
  return new Promise((resolve) => {
    return glob(`${path}`, (err, files) => {
      if (err) {
        resolve(null);
        return;
      }
      resolve(files);
    });
  });
};

/**
 * removeFiles
 */
exports.removeFiles = (paths) => {
  return Promise.all(
    paths.map(async (path) => {
      const exist = await fs.pathExists(path);
      if (!exist) {
        throw new Error(`file not exitst: ${path}`);
      }
      return fs.remove(path);
    }),
  )
    .then(() => {
      return { ok: true };
    })
    .catch((err) => {
      return { error: err.message };
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
exports.saveAlbumJson = (albumId, data) => {
  const dir = path.join(__dirname, '../public/albums', albumId);
  try {
    fs.ensureDirSync(dir);
  } catch (error) {
    return false;
  }

  return exports.saveJson(path.join(dir, JSON_FILE_NAME), data);
};

/**
 * loadAlbumJson
 */
exports.loadAlbumJson = async (albumId) => {
  const filepath = path.join(
    __dirname,
    '../public/albums',
    albumId,
    JSON_FILE_NAME,
  );

  const exist = await fs.pathExists(filepath);
  if (!exist) {
    await exports.saveAlbumJson(albumId, initialData);
  }
  try {
    const data = fs.readJsonSync(filepath);
    return data;
  } catch (error) {
    return null;
  }
};

/**
 * getAlbumImgs
 */
exports.getAlbumImgs = (albumId) => {
  const filepath = path.join(__dirname, '../public/albums', albumId, 'img/*');
  return exports.getFiles(filepath);
};
