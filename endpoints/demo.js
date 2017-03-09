const moment   = require('moment');
const {Router} = require('express');
const faker    = require('faker');

const route = Router();

module.exports = route;

///////////////////////////


route.get('/test', (req, res) => {
  res.json({
    name:       `${faker.name.firstName()} ${faker.name.lastName()}`,
    city:       `${faker.address.city()}`,
    _timestamp: moment().toString(),
  });
});
