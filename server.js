const express           = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const morgan            = require('morgan');
const endpoints         = require('./endpoints');

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

app.use(endpoints);

app.get('/', (req, res) => {
  const availableRoutes = endpoints.stack // registered routes
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

app.listen(PORT, () => {
  console.log(`Fake backend listening on port ${PORT}!`);
});

process.on('exit', (argument) => {
  console.log('Received exit signal');
  app.close();
});
