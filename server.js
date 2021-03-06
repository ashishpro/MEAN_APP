var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var winston = require('winston');
var logger = require('./logFormat');

var app = express();

mongoose.connect(config.database,function(err){
  if(err){
    console.log(err.stack);
  }
  else
  {
    console.log("DB Connection Successfull ....");
    console.log("Log Format Runnnig...");
  }
});



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static( __dirname + '/public'));

var api = require('./app/routes/api')(app, express);
app.use('/api',api);

app.get('*',function(req,res){
  res.sendFile(__dirname + '/public/app/views/index.html');
});

app.listen(config.port,function(err){
  if(err){
    console.error(err);
  }
  else {
    console.log("Server running on 2000 port !");
  }
});
