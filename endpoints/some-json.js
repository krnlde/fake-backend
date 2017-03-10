const {Router} = require('express');
const path     = require('path');

const router = Router();

const sendFileOptions = Object.freeze({
  root: path.resolve('./public'),
  dotfiles: 'deny',
});

module.exports = router;

///////////////////////////

router.route('/some-json')
  .get((req, res) => res.sendFile('test.json', sendFileOptions))
  .post((req, res) => {})
  .put((req, res) => {})
  .delete((req, res) => {})
  .options((req, res) => {})
  .trace((req, res) => {})
  ;
