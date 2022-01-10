const fs = require('fs-extra');
const cors = require('cors');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const {
  listAlbums,
  saveAlbum,
  loadAlbum,
  removeAlbumItem,
  resetAlbumItem,
} = require('./app');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    // debug: true,
  }),
);
app.use(bodyParser.json());

app.use(
  cors({
    origin: 'http://localhost:3000', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  }),
);

// ------------------------
// get
// ------------------------

/**
 * index
 */
app.get('/', async (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  res.json({ msg: 'now or never' });
});

/**
 * list albums
 */
app.get('/albums', async (req, res) => {
  // res.sendFile(__dirname + '/index.html');
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

  const uploadPath = path.resolve(__dirname, `../public/albums/${albumId}/img`);
  fs.ensureDirSync(uploadPath);

  const { myimg } = req.files;
  const imgPath = path.resolve(uploadPath, myimg.name);

  myimg.mv(imgPath, function (err) {
    if (err) return res.status(500).send({ error: err });
    res.json({ imgSaved: true });
  });
});

/**
 * save album
 */
app.post('/albums/:albumId/detail', async (req, res) => {
  const { albumId } = req.params;
  console.log('save album ハンドラ', albumId);
  const result = await saveAlbum(albumId, req.body);

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
  const { items } = result;
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
  const result = await resetAlbumItem(albumId);
  if (result.error) {
    res.json(result);
    return;
  }

  res.json({ reset: true });
});

app.listen(9000);
