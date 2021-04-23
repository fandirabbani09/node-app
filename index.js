/*  

const express = require('express');
const app = express()
const port = 3100;

app.get('/', (req, res) => res.send('Welcome!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


    Uses express, dbcon for database connection, body parser to parse form data 
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 3306);
app.set('mysql', mysql);

app.use('/planets', require('./planets.js'));
app.use('/characters', require('./characters.js'));
app.use('/dragonballs', require('./dragonballs.js'));
app.use('/techniques', require('./techniques.js'));
app.use('/character_techniques', require('./character-techniques.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + 3306 + '; press Ctrl-C to terminate.');
});
