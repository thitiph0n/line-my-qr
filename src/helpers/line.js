const axios = require('axios');

module.exports.line = axios.create({
  baseURL: 'https://api.line.me/v2/bot/message',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.ACCESSTOKEN}`,
  },
});
