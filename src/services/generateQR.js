const QRCode = require('qrcode');
const path = require('path');
const os = require('os');

module.exports.generateQR = async (url, fileName) => {
  const tempFilePath = path.join(os.tmpdir(), `${fileName}.png`);
  try {
    await QRCode.toFile(tempFilePath, url, {
      color: {
        dark: '#0AA9CF',
        light: '#ffff',
      },
      width: 512,
      version: 8,
    });
    return { result: tempFilePath, error: null };
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
};
