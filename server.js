const pkg               = require('./package.json');

const express           = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const cors              = require('cors');
const morgan            = require('morgan');
const compression       = require('compression');
const moment            = require('moment');
const faker             = require('faker');
const fsp               = require('fs-promise');
const path              = require('path');
const mime              = require('mime-types');

const birthDate = moment().toString();
const PORT      = 3000;
const app       = express();

app.use(helmet({
  noCache: true
}));

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(compression());

app.use(morgan('dev'));

app.engine('.hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    to_state(str) {
      switch (str.toUpperCase()) {
        case 'GET':     return 'success';
        case 'POST':    return 'primary';
        case 'PUT':     return 'warning';
        case 'DELETE':  return 'danger';
        case 'OPTIONS': return 'info';
        default:        return 'default';
      }
    }
  }
}));

app.set('view engine', '.hbs');


// Consistent results everyday
const seed = parseFloat(moment().startOf('day').format('X'));

app.use((request, response, next) => {
  faker.seed(seed);
  next();
});

app.use(express.static('static'));

app.get('/', (request, response) => {
  const {host} = request.headers;
  const availableRoutes = endpoints
    .reduce((previous, endpoint) => [...previous, ...endpoint.stack], []) // registered routes
    .filter(r => r.route) // take out all the middleware
    .map(r => {
      const methods = Object.keys(r.route.methods)
        .filter((method) => r.route.methods[method])
        .map((method) => method.toUpperCase());

      return {
        path: r.route.path,
        methods,
      };
    });

  response.render('listing', {
    birthDate,
    version: pkg.version,
    host,
    availableRoutes
  });
});


let endpoints = [];

(async function () {
  for (let endpointPath of await fsp.readdir('./endpoints')) {
    const fullPath = path.resolve('./endpoints', endpointPath);
    const stat = await fsp.stat(fullPath);

    if (!stat.isFile()) continue;
    if (mime.lookup(endpointPath) !== 'application/javascript') continue;

    const endpoint = require(fullPath);
    app.use('/', endpoint);
    endpoints.push(endpoint);
  }

  // Handle 404
  app.use((request, response) => {
    response.status(404).type('text').send(`Endpoint "${request.method} ${request.url}" is not yet configured`);
  });
})();

app.listen(PORT, () => console.log(`Fake backend listening on port ${PORT}!`) );
