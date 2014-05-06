// Express initialization
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express(); 
app.use(bodyParser());
app.use(logger());
app.set('title', 'nodeapp');

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';

var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

var documentScores;

app.get('/', function (request, response) {
  var html = "";
  response.set('Content-Type', 'text/html');
    db.collection("scores", function(error, collection){
      if(error){
        throw error;
      } else{
        collection.find().sort({score : -1}).toArray(function(error, documents){
          if(error || documents == null){
            throw error;
          } else { 
            html += "<!DOCTYPE html><html><head><title>2048-gamecenter</title>";
            html += "<style>body{ font-family: 'Calibri'; background-color: rgb(250,248,239); color: rgb(249,246,242); } h1{ text-align: center; color: rgb(119,110,101); font-size: 100px; } table{ font-size: 40px; text-align: center; border-collapse: collapse; } td{ border-width: 5px; border-style: solid; padding: 10px; background-color: rgb(238,228,218); border-color: rgb(187,173,160); color: rgb(249,246,242); } .C2048{ background-color: rgb(237,194,48); } .C1024{ background-color: rgb(237,197,63); } .C512{ background-color: rgb(237,200,80); } .C256{ background-color: rgb(237,204,97); } .C128{ background-color: rgb(236,207,113); } .C64{ background-color: rgb(246,94,59); } .C32{ background-color: rgb(246,124,94); } .C16{ background-color: rgb(244,152,99); } .C8{ background-color: rgb(242,177,120); } .C4{ background-color: rgb(237,224,200); color: rgb(119,110,101); } .C2{ background-color: rgb(238,228,218); color: rgb(119,110,101); } </style>";
            html += '</head><body><h1>Top 2048 Scores!</h1><table align = "center">';
                  for (var i = 0; i < documents.length; i++){
                    html += "<tr>";

                    html += "<td" 
                    html += color() 
                    html += ">" + documents[i]["username"] + "</td>";

                    html += "<td" 
                    html += color() 
                    html += ">" + documents[i]["score"] + "</td>";

                    html += "<td" 
                    html += color() 
                    html += ">" + documents[i]["created_at"] + "</td>";
                    
                    html += "</tr>";
                  }
                  
                  html += "</table></body></html>";

            response.send(html);
          }
        });
      }
    });
  });


app.get('/scores.json', function(request, response) {
  var json = "[";
  user = request.query.username;
  response.set('Content-Type', 'text/html');

  db.collection("scores", function(error, collection){
    collection.find().sort({score : -1}).toArray(function(error, documents){
      for (var i = 0; i < documents.length; i++){
        if(documents[i]["username"] == user){
          json += '{"username" : "' + documents[i]['username'] + '", ';
          json += '"score" : "' + documents[i]['score'] + '", ';
          json += '"grid" : ' + documents[i]['grid'] + ', ';
          json += '"created_at" : "' + documents[i]['created_at'] + '"},';
        }
      }
      if(user != null){
        json = json.slice(0,-1);
      }
      json += "]";
      response.send(json);
    });
  });
});

app.post('/submit.json', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  db.collection('scores', function(error, collection) {
    if(!error){
      var name = request.body.username;
      var score = parseInt(request.body.score);
      var grid = request.body.grid;
      var time = request.body.created_at;
      collection.insert({"username" : name, "score" : score, "grid" : grid, "created_at" : time}, function(error, g){});
      response.send();
    }
  });
});


app.listen(process.env.PORT || 3000);


function color () {
  var rand = Math.round(Math.random()*10);
  var colorHTML = "";
  if (rand == 0){
    colorHTML = ' class = "C2048"';
  }else if(rand == 1){
    colorHTML = ' class = "C1024"';
  }else if(rand == 0){
    colorHTML = ' class = "C512"';
  }else if(rand == 2){
    colorHTML = ' class = "C256"';
  }else if(rand == 3){
    colorHTML = ' class = "C128"';
  }else if(rand == 4){
    colorHTML = ' class = "C64"';
  }else if(rand == 5){
    colorHTML = ' class = "C32"';
  }else if(rand == 6){
    colorHTML = ' class = "C16"';
  }else if(rand == 7){
    colorHTML = ' class = "C8"';
  }else if(rand == 8){
    colorHTML = ' class = "C4"';
  }else{
    colorHTML = ' class = "C2"';
  }
  return colorHTML;
}
