require('dotenv').config();
const path = require('path');
const fs = require('fs-extra');
const { upload } = require('./helper');

const imgpath = path.join(__dirname, '../tmp/dog2.png');
const filename = path.basename(imgpath);
// バケット上でのパス
const distpath = `album/${filename}`;

upload(imgpath, distpath).then((res) => {
  if (res.error) {
    console.log('エラー', res.error);
    return;
  }
  console.log('アップロード成功', res);
});
