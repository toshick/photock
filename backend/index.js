const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const { listAlbums, saveAlbum, loadAlbum } = require('./app');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: 'http://localhost:3000', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  }),
);

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
 * save album
 */
app.post('/albums/:albumId', async (req, res) => {
  const { albumId } = req.params;
  console.log('reqちぇっく', req.body);
  const result = await saveAlbum(albumId, req.body);

  res.json(result);
});

/**
 * get album
 */
app.get('/albums/:albumId', async (req, res) => {
  const { albumId } = req.params;
  const result = await loadAlbum(albumId);

  res.json(result);
});

app.listen(9000);
