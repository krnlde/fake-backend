const {Router} = require('express');
const path     = require('path');

const route = Router();

const sendFileOptions = Object.freeze({
  root: path.resolve('./public'),
  dotfiles: 'deny',
});

module.exports = route;

///////////////////////////

route.get('/some-json', (req, res) => {
  res.sendFile('test.json', sendFileOptions);
});
