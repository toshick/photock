const cors = require('cors');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const { listAlbums, saveAlbum, loadAlbum } = require('./app');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    debug: true,
  }),
);
// app.use(bodyParser.json());

app.use(
  cors({
    origin: 'http://localhost:3000', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  }),
);

const uploadPath = path.resolve(__dirname, './tmp');

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
  if (!req.files) {
    res.json({ error: 'No files were uploaded.' });
    return;
  }
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

app.listen(9000);
