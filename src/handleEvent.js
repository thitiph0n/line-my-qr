const axios = require('axios');
const validUrl = require('valid-url');
const QRCode = require('qrcode');
const { admin } = require('./firebase');
const fs = require('fs');

module.exports.handleEvent = async (event) => {
  if (event.type === 'message') {
    if (event.message.type === 'text') {
      //check isUrl
      if (validUrl.isUri(event.message.text)) {
        //Create QR code
        await QRCode.toFile(
          `src/tmp/${event.message.id}.png`,
          event.message.text,
          {
            color: {
              dark: '#0AA9CF', // Blue dots
              light: '#ffff', // Transparent background
            },
            width: 512,
            version: 8,
          }
        );

        const bucket = admin.storage().bucket();
        const upload = await bucket.upload(`src/tmp/${event.message.id}.png`, {
          public: true,
        });

        const body = {
          replyToken: event.replyToken,
          messages: [
            {
              type: `text`,
              text: event.message.text,
            },
            {
              type: 'image',
              originalContentUrl: upload[0].metadata.mediaLink,
              previewImageUrl: upload[0].metadata.mediaLink,
            },
          ],
        };
        try {
          await axios({
            method: 'post',
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.ACCESSTOKEN}`,
            },
            data: JSON.stringify(body),
          });
        } catch (error) {
          console.log(error);
        }

        const pathToFile = `src/tmp/${event.message.id}.png`;

        try {
          fs.unlinkSync(pathToFile);
          console.log('Successfully deleted the file.');
        } catch (err) {
          throw err;
        }
      }
    }
  }
};
