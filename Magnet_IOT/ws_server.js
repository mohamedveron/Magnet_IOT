var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 9090 });
var express = require('express');
var app = express();

var clientsInfo = {};
var boardClientsInfo = {};

wss.on('connection', function (client) {
    client.send("hello from nodejs");
    client.on('message',function(data){
      var info = data.split(';');
      
      var group = info[0];
      var id = info[1];
      var type = info[2];
      
      // if client is the device itself
      if(type == 'board'){
        if(!clientsInfo[group]){
          boardClientsInfo[group] = {};
        }
          boardClientsInfo[group][id] = client;
          console.log(boardClientsInfo);  

      // if client is the mobile app
      }else if(type == 'mobile'){
        if(!clientsInfo[group]){
          clientsInfo[group] = {};
        }
          clientsInfo[group][id] = client;
          console.log(clientsInfo);
      }
        
    });         
 });

// Start REST server on port 8081
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Websocket event broadcaster REST API listening on http://%s:%s", host, port);
});
 
// Broadcast updates to all WebSocketServer mobile clients
app.get('/alert', function (req, res) {
   var id = req.query["id"];
   var group = req.query["group"];
   //var ctype = req.query["type"];

  if(clientsInfo[group]){
      if(clientsInfo[group][id] && clientsInfo[group][id].readyState == 1){
          clientsInfo[group][id].send("ma7alak byetsere2");
      }
      
      //broadcast to all clients from the same group
      for(var key in clientsInfo[group]){
          if(clientsInfo[group]){
              if(key != id){
                clientsInfo[group][key].send("ma7alak zemelek byetsere2");
              }            
          }
      }
  }
   res.sendStatus(200);
});

