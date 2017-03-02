const express           = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const morgan            = require('morgan');
const moment            = require('moment');
const faker             = require('faker');
const fsp               = require('fs-promise');
const path              = require('path');

const PORT = 3000;
const app = express();

app.use(helmet({
  noCache: true
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(morgan('dev'));

app.engine('.hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: '.hbs',
}));
app.set('view engine', '.hbs');


// Consistent results everyday
const seed = parseFloat(moment().startOf('day').format('X'));

app.use((req, res, next) => {
  faker.seed(seed);
  next();
});

app.get('/', (req, res) => {
  const availableRoutes = endpoints.reduce((previous, endpoint) => [...previous, ...endpoint.stack], []) // registered routes
    .filter(r => r.route)        // take out all the middleware
    .map(r => {
      const methods = Object.keys(r.route.methods)
        .filter((method) => r.route.methods[method])
        .map((method) => method.toUpperCase());

      return {
        path: r.route.path,
        methods
      };
    });

  res.render('listing', {availableRoutes});
});


let endpoints = [];

(async function () {
  for (let endpointPath of await fsp.readdir('./endpoints')) {
    const endpoint = require(path.resolve('./endpoints', endpointPath));
    app.use(endpoint);
    endpoints.push(endpoint);
  }

  // Handle 404
  app.use((request, response) => {
    response.status(404).type('text').send(`Endpoint "${request.method} ${request.url}" is not yet configured`);
  });
})();

app.listen(PORT, () => {
  console.log(`Fake backend listening on port ${PORT}!`);
});
