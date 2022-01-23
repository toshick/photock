const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const JSON_FILE_NAME = 'data.json';
const JSON_FILE_NAME_BK = 'data-bk.json';
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
 * backupAlbumJson
 */
exports.backupAlbumJson = async (albumId) => {
  const dir = path.join(__dirname, '../public/albums', albumId);
  const filePath = path.join(dir, JSON_FILE_NAME);
  const fileBkPath = path.join(dir, JSON_FILE_NAME_BK);
  // backup
  const exist = await fs.pathExists(filePath);
  if (exist) {
    try {
      console.log('バックアップ実行', fileBkPath);
      fs.copySync(filePath, fileBkPath, { overwrite: true });
    } catch (error) {
      console.log('バックアップ失敗');
    }
  }
};

/**
 * saveAlbumJson
 */
exports.saveAlbumJson = async (albumId, data) => {
  const dir = path.join(__dirname, '../public/albums', albumId);
  try {
    fs.ensureDirSync(dir);
  } catch (error) {
    return false;
  }
  const filePath = path.join(dir, JSON_FILE_NAME);
  return exports.saveJson(filePath, data);
};

/**
 * loadAlbumJson
 */
exports.loadAlbumJson = async (albumId) => {
  const filePath = path.join(
    __dirname,
    '../public/albums',
    albumId,
    JSON_FILE_NAME,
  );

  const exist = await fs.pathExists(filePath);
  if (!exist) {
    await exports.saveAlbumJson(albumId, initialData);
  }
  try {
    const data = fs.readJsonSync(filePath);
    return data;
  } catch (error) {
    return null;
  }
};

/**
 * getAlbumImgs
 */
exports.getAlbumImgs = (albumId) => {
  const filePath = path.join(__dirname, '../public/albums', albumId, 'img/*');
  return exports.getFiles(filePath);
};
