require('dotenv').config();
const path = require('path');
const { upload } = require(path.join(__dirname, 'script/helper'));

const imgpath = path.join(__dirname, 'tmp/dog2.png');
const filename = path.basename(imgpath);
// バケット上でのパス
const distpath = `album/${filename}`;

exports.firebaseUpload = () => {
  console.log('あっぷろーどじゃ');
  return upload(imgpath, distpath).then((res) => {
    if (res.error) {
      console.log('エラー', res.error);
      return { error: res.error };
    }
    console.log('アップロード成功', res);
    return res;
  });
};
