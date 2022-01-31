const fs = require('fs-extra');
const cors = require('cors');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const {
  listAlbums,
  saveAlbum,
  changeAlbumId,
  loadAlbum,
  removeAlbumItem,
  resetAlbum,
  deleteAlbum,
  exportAlbum,
} = require('./app');
const { backupAlbumJson, pathPublic } = require('./util');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    // debug: true,
  })
);
app.use(bodyParser.json());

app.use(
  cors({
    origin: 'http://localhost:3000', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);

// ------------------------
// get
// ------------------------

/**
 * index
 */
app.get('/', async (req, res) => {
  res.json({ msg: 'now or never' });
});

/**
 * list albums
 */
app.get('/albums', async (req, res) => {
  const ret = await listAlbums();
  if (ret.error) {
    res.json({ error: ret.error });
    return;
  }
  res.json({ albums: ret.albums });
});

/**
 * get album
 */
app.get('/albums/:albumId', async (req, res) => {
  const { albumId } = req.params;
  const result = await loadAlbum(albumId);

  res.json(result);
});

// ------------------------
// post
// ------------------------

/**
 * save image
 */
app.post('/albums/:albumId/image', (req, res) => {
  const { albumId } = req.params;
  if (!req.files) {
    res.json({ error: 'No files were uploaded.' });
    return;
  }
  if (!albumId) {
    res.json({ error: 'albumId is not provided.' });
    return;
  }

  const uploadPath = path.join(pathPublic, `/albums/${albumId}/img`);
  console.log('pathPublic => ', pathPublic);
  console.log('uploadPath => ', uploadPath);
  fs.ensureDirSync(uploadPath);

  const { myimg } = req.files;
  const imgPath = path.join(uploadPath, myimg.name);

  myimg.mv(imgPath, function (err) {
    if (err) return res.status(500).send({ error: err });
    res.json({ imgSaved: true });
  });
});

/**
 * backup album
 */
app.post('/albums/:albumId/backup', async (req, res) => {
  const { albumId } = req.params;
  // バックアップ
  await backupAlbumJson(albumId);
  res.json({ backup: true });
});

/**
 * export
 */
app.post('/albums/:albumId/export', async (req, res) => {
  const { albumId } = req.params;
  await exportAlbum(albumId);

  res.json({ export: true });
});

/**
 * save album
 */
app.post('/albums/:albumId/detail', async (req, res) => {
  const { albumId } = req.params;
  const result = await saveAlbum(albumId, req.body);
  res.json(result);
});

/**
 * change album ID
 */
app.post('/albums/:albumId/id', async (req, res) => {
  const { albumId } = req.params;
  console.log('save album ハンドラ', albumId);
  const result = await changeAlbumId(albumId, req.body);

  res.json(result);
});

// ------------------------
// delete
// ------------------------

/**
 * delete image
 */
app.delete('/albums/:albumId/image/:itemId', async (req, res) => {
  const { albumId, itemId } = req.params;
  const result = await loadAlbum(albumId);
  if (result.error) {
    res.json(result);
  }
  const { items } = result;
  if (!items) {
    res.json({ error: 'no items' });
  }

  const find = items.find((i) => {
    return i.id === itemId;
  });
  if (!find) {
    res.json({ error: 'can not find target', itemId });
    return;
  }
  const result2 = await removeAlbumItem(albumId, itemId);
  if (result2.error) {
    res.json(result2);
    return;
  }

  res.json({ imgRemove: true, itemId, items: items.length, find });
});

/**
 * reset image
 */
app.delete('/albums/:albumId/reset', async (req, res) => {
  const { albumId } = req.params;
  const result = await resetAlbum(albumId);
  if (result.error) {
    res.json(result);
    return;
  }

  res.json({ reset: true });
});

/**
 * delete Album
 */
app.delete('/albums/:albumId/detail', async (req, res) => {
  const { albumId } = req.params;
  const result = await deleteAlbum(albumId);
  if (result.error) {
    res.json(result);
    return;
  }

  res.json({ removed: true });
});

app.listen(9000);
