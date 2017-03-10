const moment   = require('moment');
const {Router} = require('express');
const faker    = require('faker');

const router = Router();

module.exports = router;

///////////////////////////


router.get('/demo', (req, res) => {
  res.json({
    name:       `${faker.name.firstName()} ${faker.name.lastName()}`,
    city:       `${faker.address.city()}`,
    _timestamp: moment().toString(),
  });
});
