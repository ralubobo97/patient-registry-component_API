const express = require('express'); 
const mysql = require('mysql');
const logger = require('morgan');
const config = require('./config');
const bodyParser = require('body-parser')

const app = express();
const router = express.Router();

const routes = require('./routes/index.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));

const db = mysql.createConnection(config.dbConfig);

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
});

global.db = db;

app.use('/api', routes(router));

app.listen('3000', () => {
  console.log(`Server started at localhost:3000`);
});

module.exports = app;