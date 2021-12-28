const express = require('express');
const bodyParser = require('body-parser');

const { xxx, saveAlbum, loadAlbum } = require('./app');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  console.log('nya-go2');
  res.json({ error: 'index' });
});

app.post('/albums/:albumId', async (req, res) => {
  const { albumId } = req.params;
  const result = await saveAlbum(albumId, req.body);

  res.json(result);
});

app.get('/albums/:albumId', async (req, res) => {
  const { albumId } = req.params;
  const result = await loadAlbum(albumId);

  res.json(result);
});

app.listen(9000);
