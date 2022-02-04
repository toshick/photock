const { execSync } = require('child_process');
const fs = require('fs-extra');
const uuid = require('uuid');
const path = require('path');
const {
  pathPublic,
  getFiles,
  loadAlbumJson,
  saveAlbumJson,
  getAlbumImgs,
  removeFiles,
} = require('./util');

/**
 * xxx
 */
exports.xxx = async function () {
  const dir = path.join(pathPublic, '/**/*');
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

  // 保存
  const saved = await saveAlbumJson(albumId, body);
  if (!saved) {
    return { error: 'can not write json for', albumId };
  }
  return { saved: true };
};

/**
 * changeAlbumId
 */
exports.changeAlbumId = async function (albumId, body) {
  if (!albumId) {
    return { error: 'albumId is not provided' };
  }
  const currentData = await exports.loadAlbum(albumId);
  if (currentData.error) {
    return currentData.error;
  }
  const { newId } = body;
  if (!newId) {
    return { error: 'target albumId is not provided' };
  }
  if (albumId === newId) {
    return { error: 'name is the same' };
  }
  const from = path.join(pathPublic, `/albums/${albumId}`);
  const to = path.join(pathPublic, `/albums/${newId}`);
  try {
    fs.moveSync(from, to);
  } catch (error) {
    return { error: error.message };
  }
  // copy files
  let json = JSON.stringify(currentData);
  const regex = new RegExp(`/albums/${albumId}/`, 'g');
  json = json.replace(regex, `/albums/${newId}/`);
  const data2 = await exports.saveAlbum(newId, JSON.parse(json));
  if (data2.error) {
    return data2.error;
  }
  return { renamed: true, newId };
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
    const find = items.find((i) => {
      return i.img === imgpath;
    });
    if (!find) {
      items.push({ img: imgpath, id: uuid.v4() });
    }
  });
  return { ...loaded, items };
};

/**
 * listAlbums
 */
exports.listAlbums = async function () {
  const dirs = await getFiles(path.join(pathPublic, '/albums/*'));
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
  if (!loaded) {
    return { error: 'can not load Album json (removeAlbumItem)' };
  }
  const items = loaded.items || [];
  // find target
  const item = await getAlbumItem(albumId, itemId);
  if (item.error) {
    return { error: 'can not find Album item' };
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
 * resetAlbum
 */
exports.resetAlbum = async function (albumId) {
  const imgs = await getFiles(path.join(pathPublic, `/albums/${albumId}/*`));
  if (imgs === null) {
    return { ok: 'no items' };
  }
  const resultRemove = await removeFiles(imgs);
  if (resultRemove.error) {
    return resultRemove;
  }

  const res = await exports.saveAlbum(albumId, {});
  if (res.error) {
    return res.error;
  }
  return { ok: true };
};

/**
 * deleteAlbum
 */
exports.deleteAlbum = async function (albumId) {
  const target = path.join(pathPublic, `/albums/${albumId}`);
  const resultRemove = await removeFiles([target]);
  if (resultRemove.error) {
    return resultRemove;
  }
  return { ok: true };
};

/**
 * exportAlbum
 */
exports.exportAlbum = async function (albumId) {
  const templatePath = path.join(__dirname, '../app/album-template');
  const data = await exports.loadAlbum(albumId);

  const filePath = path.join(pathPublic, `/albums/${albumId}`);
  const distPath = path.join(__dirname, `../dist/${albumId}`);
  fs.ensureDirSync(distPath);
  fs.ensureDirSync(path.join(distPath, 'img'));
  // try {
  //   fs.copySync(filePath, distPath, { overwrite: true });
  // } catch (error) {
  //   return { error: error.message };
  // }

  // sips
  const sipsResult = execSync(
    `sips -Z 1280 ${path.join(filePath, 'img/*')} -o ${path.join(
      distPath,
      'img'
    )}`
  );

  try {
    // index.html
    let html = fs.readFileSync(
      path.join(templatePath, `/public/index.html`),
      'utf-8'
    );
    html = html.replace(/\{album-title\}/g, data.albumTitle);
    html = html.replace(/\{album-id\}/g, albumId);
    fs.writeFileSync(
      path.join(__dirname, `../dist/${albumId}/index.html`),
      html
    );
    // data.json
    fs.copySync(
      path.join(filePath, `data.json`),
      path.join(distPath, `data.json`)
    );

    // css
    fs.copySync(
      path.join(templatePath, `/public/css`),
      path.join(__dirname, `../dist/${albumId}/css`),
      { overwrite: true }
    );
    // parts
    fs.copySync(
      path.join(templatePath, `/public/parts`),
      path.join(__dirname, `../dist/${albumId}/parts`),
      { overwrite: true }
    );
  } catch (error) {
    return { error: error.message };
  }

  // imageoptim
  // const imageoptimResult = execSync(
  //   `imageoptim ${path.join(distPath, 'img/*')}`,
  // );
  // console.log(`sipsResult: ${imageoptimResult.toString()}`);

  return { ok: true };
};

/**
 * getAlbumItem
 */
async function getAlbumItem(albumId, itemId) {
  const loaded = await loadAlbumJson(albumId);
  if (!loaded) {
    return { error: 'can not read json for' };
  }
  const items = loaded.items || [];
  const find = items.find((i) => i.id === itemId);
  if (find) return find;
  return { error: 'can not find item (getAlbumItem)' };
}
