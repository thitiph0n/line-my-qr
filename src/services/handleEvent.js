const validUrl = require('valid-url');
const fs = require('fs');

const { generateQR } = require('../services/generateQR');
const { uploadQR } = require('../services/uploadQR');
const { line } = require('../helpers/line');

module.exports.handleEvent = async (event) => {
  if (event.type === 'message') {
    if (event.message.type === 'text') {
      //check isUrl
      const url = event.message.text.trim();
      if (validUrl.isUri(url)) {
        //Create QR code
        const { error: genErr, result: imgPath } = await generateQR(
          url,
          event.message.id
        );
        if (genErr) {
          throw genErr;
        }
        const { error: uploadErr, result: upload } = await uploadQR(imgPath);
        if (uploadErr) {
          throw uploadErr;
        }
        //Reply
        let replyError = false;
        const body = {
          messages: [
            {
              type: `text`,
              text: url,
            },
            {
              type: 'image',
              originalContentUrl: upload.mediaLink,
              previewImageUrl: upload.mediaLink,
            },
          ],
        };
        try {
          await line.post('/reply', {
            replyToken: event.replyToken,
            ...body,
          });
        } catch (error) {
          console.log('reply error');
          replyError = true;
        }
        //if reply error
        if (replyError) {
          console.log('try to push message');
          try {
            await line.post('/push', { to: event.source.userId, ...body });
          } catch (error) {
            throw error;
          }
        }
        //delete temp file
        try {
          fs.unlinkSync(imgPath);
          console.log('Successfully deleted the file.');
        } catch (err) {
          throw err;
        }
      }
    }
  }
};
