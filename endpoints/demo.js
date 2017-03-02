const moment   = require('moment');
const {Router} = require('express');
const faker    = require('faker');
const path     = require('path');

const route = Router();

const sendFileOptions = Object.freeze({
  root: path.resolve('./public'),
  dotfiles: 'deny',
});

module.exports = route;

///////////////////////////


route.get('/test', (req, res) => {
  res.json({
    name:       `${faker.name.firstName()} ${faker.name.lastName()}`,
    city:       `${faker.address.city()}`,
    _timestamp: moment().toString(),
  });
});

route.get('/some-json', (req, res) => {
  res.sendFile('test.json', sendFileOptions);
});