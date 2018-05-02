const express = require('express')
const app = express()
const port = 3000;
var fs = require('fs');
var path    = require("path");
var bodyParser = require("body-parser");

var http = require('http').Server(app);
var io = require('socket.io')(http);



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/res", express.static(__dirname + "/res"));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname+'/index.html'));

});

app.post('/saveGameOptions', (request, response) => {
    console.log('save game options');
	
	//var data = JSON.parse(request.body);
	var data1 = request.body;
	var gameOption = null;
	fs.readFile('GameOption.json', (err, data) => {  
		console.log(data+'data')

		var gameOption = JSON.parse(data);
		if( !gameOption || !gameOption.elephantPlayers){
			gameOption = {};
			gameOption.elephantPlayers = [];
		}

		if( !gameOption || !gameOption.sheepPlayers){
			gameOption.sheepPlayers = [];
		}

		gameOption[data1.request.name] = data1.request;
		if(data1.request.isElephant){
			
			if( gameOption.sheepPlayers && gameOption.sheepPlayers.length > 0 ){
				var sheepPlayer = gameOption.sheepPlayers[ gameOption.sheepPlayers.length-1 ] ;
				var players = {
					elephant:data1.request.name,
					sheep: sheepPlayer.name
				}
				gameOption.sheepPlayers.splice(gameOption.sheepPlayers.length-1,1);
				io.emit('matchFound', JSON.stringify(players));
			}else{
				gameOption.elephantPlayers.push(data1.request);
			}
		}else{
			
			if( gameOption.elephantPlayers && gameOption.elephantPlayers.length > 0 ){
				var elephantPlayer = gameOption.elephantPlayers[ gameOption.elephantPlayers.length-1 ] ;
				var players = {
					elephant:elephantPlayer.name,
					sheep: data1.request.name
				}
				gameOption.elephantPlayers.splice(gameOption.elephantPlayers.length-1,1);
				io.emit('matchFound', JSON.stringify(players));			
			}else{
				gameOption.sheepPlayers.push(data1.request);
			}
		}
		var json = JSON.stringify( gameOption );
		console.log('json '+json)
		fs.writeFile('GameOption.json', json, 'utf8', function(){console.log('Success')});
		response.statusCode = 200;
		response.setHeader('Content-Type', 'text/plain');
		response.end();
	});
});
app.post('/saveGameData', function( request, response ){
	var data1 = request.body;
	var fileName = data1.elephant+"_"+data1.sheep+".json";
	fs.writeFile( fileName , JSON.stringify(data1), 'utf8', function(){
		console.log('Success');
		response.statusCode = 200;
		response.setHeader('Content-Type', 'text/plain');
		response.end();
	});
});

app.post('/getGameData', function( request, response ){
	var data1 = request.body;
	var fileName = data1.user+"_"+data1.opponent+".json";
	fs.readFile( fileName , (err, data)=>{
		console.log('Success');
		var gameData = JSON.parse(data);
		response.statusCode = 200;
		response.setHeader('Content-Type', 'text/plain');
		response.send(JSON.stringify(gameData));
	});
});
app.post('/updateMove', function( request, response ){
	var data1 = request.body;
	var fileName = data1.fileName;
	fs.writeFile( fileName , JSON.stringify( data1.data ), 'utf8', function(){
		io.emit('updateMove', "updateMove");	
		console.log('Success');
		response.statusCode = 200;
		response.setHeader('Content-Type', 'text/plain');
		response.end();
	});
});


console.log('before connecting');

io.on('connection', function(socket){
  console.log('a user connected');
  
  /* socket.on('matchFound', function(msg){
    io.emit('matchFound', msg);
  }); */
  
});


http.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})