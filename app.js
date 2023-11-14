const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Parsing middelware

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

//static files
app.use(express.static('public'));

// Templating Engine
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', 'hbs');

// Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to db
pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log('Connected as ID ', connection.threadId);
});

// Routes rendering
// you can use 
// app.get('', (req, res) => {
//     res.render('home');
// });

//or
const routes = require('./server/routes/user');

app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});