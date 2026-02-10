const express = require('express');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = 3000;

// Disable cache
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Continguts estàtics
app.use(express.static('public'));

// Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ✅ Helper OBLIGATORI
hbs.registerHelper('lte', (a, b) => a <= b);

// Partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Utilitat per llegir JSON
const loadJSON = (file) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));

// =======================
// Ruta /
// =======================
app.get('/', (req, res) => {
  const site = loadJSON('site.json');

  res.render('index', site);
});

// =======================
// Ruta /informe
// =======================
app.get('/informe', (req, res) => {
  const site = loadJSON('site.json');
  const cities = loadJSON('cities.json');
  const countries = loadJSON('countries.json');

  res.render('informe', {
    ...site,
    cities: cities.cities,
    countries: countries.countries,
    limit: 800000
  });
});

// Start server
const httpServer = app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log(`http://localhost:${port}/informe`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  httpServer.close();
  process.exit(0);
});
