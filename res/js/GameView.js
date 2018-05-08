//import { debug } from "util";

function GameView( canvasElem, domElem ,modalElem ){
	this.canvasElem = canvasElem;
	this.domElem = domElem;
	this.canvasContext  = canvasElem.getContext('2d');
	this.modalElem = modalElem;
	this.socket = io();//Web socket object

	
	this.user ={
		name:null
	}
	
	this.opponent ={
		name:null
	}
	
	this.elephant ={
		name:null
	}
	
	this.sheep = {
		name:null
	}
	this.opponent = {
		name: null
	}
	
	this.gameData = null;
	this.temporary=[];
	
	this.gameHeader = null;
	
	this.movableObject = null;
	this.selectedObject = null;
	
	this.loadGame = null;
	this.saveGameOptions = null;
	this.getMatch = null;
	this.getGameData = null;
	this.updateMove= null;
}

GameView.prototype.render = function( data ){
		this.gameHeader = new GameHeader( this.domElem, this.user, this.elephant, this.sheep, this.opponent );
		this.gameHeader.render();
		this.gameHeader.playerSelected = this.playerSelected.bind(this);

		this.renderGame(true);
		this.initialize1();
		this.drawOutLine(data);
}
GameView.prototype.playerSelected = function( data ){
	this.saveGameOptions( data, this.waitForMatch.bind(this) );
}
GameView.prototype.getDimensions = function(){
		return {
			width:this.canvasElem.width,
			height:this.canvasElem.height
		}

}
GameView.prototype.initialize1 = function(){

	var that = this;
	this.socket.on( 'matchFound', function( user ){
		  console.log('MATCH FOUND');
		  var user = JSON.parse(user);
		  if(user.elephant == that.elephant.name){
			that.opponent.name = user.sheep;
			that.sheep.name = user.sheep;
			that.gameHeader.setCookie('oppName',user.sheep);
			that.gameHeader.removeCookie("waiting");
			//that.checkCookie('oppName', user.sheep);
			that.gameHeader.setCookie('sheep', user.sheep);
		  }else if(user.sheep == that.sheep.name){
			  console.log('remove cookie')
			that.gameHeader.setCookie('oppName', user.elephant);
			that.opponent.name = user.elephant;
			that.elephant.name = user.elephant;	
			that.gameHeader.removeCookie("waiting");
			that.gameHeader.setCookie('elephant', user.elephant);			
		  }
		  that.renderGame();
        });
	this.socket.on('updateMove',function(){
		that.renderGame(true);
	});
	this.canvasElem.addEventListener('mousedown', this.canvasMouseDownListener.bind(this));
}
GameView.prototype.drawOutLine = function(data){
	this.canvasContext.beginPath();
	this.canvasContext.strokeStyle='black';
	this.canvasContext.stroke();
	for(var i=0;i< data.linePoints.length;i++){
		this.canvasContext.beginPath();
		var linePoint = data.linePoints[i];
		console.log('from'+linePoint._from.x+':'+linePoint._from.y)
		this.canvasContext.moveTo( linePoint._from.x , linePoint._from.y);
		this.canvasContext.lineTo( linePoint._to.x , linePoint._to.y);
		console.log('to'+linePoint._to.x+':'+linePoint._to.y)
		this.canvasContext.stroke();
	}
}

GameView.prototype.renderGame = function(gameInProgress){
	var that = this;
	if(this.elephant.name && this.sheep.name)
	this.getGameData(this.elephant.name, this.sheep.name,gameInProgress, function(data){
		that.gameData = data;
		that.clearGameArea();
		that.drawOutLine(data.lineData);
		that.drawElephants(data);
		that.drawSheeps(data);
		that.drawSheepsPlace(false,data);
		that.drawSheepsKilledPlace(data);
		that.gameHeader.render();
		that.checkForWin();
		//that.updatePlayerInfo();
	});
}

GameView.prototype.clearGameArea = function(){
	this.canvasContext.clearRect(0,0,this.canvasElem.width,this.canvasElem.height);
	this.canvasContext.fillStyle='#0e0e1317';
	this.canvasContext.fillRect(0,0,this.canvasElem.width,this.canvasElem.height);
}
GameView.prototype.drawSheepsPlace = function(highlight,data){
	var areaColor = 'green';
	if(highlight && data.sheepsArea){
		this.clearRectangle( data.sheepsArea);
		areaColor = 'yellow';
	}
	
	this.drawRectangle(data.sheepsArea.x,data.sheepsArea.y,data.sheepsArea.width,data.sheepsArea.height, areaColor);
	this.drawText(data.sheepsArea.x+5,data.sheepsArea.height-5,'Remaining');
	var initialX = data.sheepsArea.x + 10;
	var initialY = 15;
	for(var i=0;i<data.sheepsLeft;i++){
		this.drawCircle(initialX, initialY, 8, 'black', i+1);
		initialX += 20;
		if(i==7){
			initialX = data.sheepsArea.x+10;
			initialY = 45;
		}
	}
}

GameView.prototype.drawSheepsKilledPlace = function(data){
	var areaColor = 'lightblue';
	
	this.clearRectangle( data.sheepsKilledArea);
	if( data.sheepsKilledArea && this.killedSheeps > 0){
		areaColor = 'red';
	}
	
	if(data.killedSheeps > 0){

		this.drawRectangle(data.sheepsKilledArea.x,data.sheepsKilledArea.y,data.sheepsKilledArea.width,
			data.sheepsKilledArea.height,areaColor);
		this.drawText(data.sheepsKilledArea.x+10 ,data.sheepsKilledArea.height-10,'Killed');
		var initialX = data.sheepsKilledArea.x+10;
		var initialY = 15;
		for(var i=0;i<data.killedSheeps;i++){
			this.drawCircle(initialX, initialY, 8, 'black', i+1);
			initialX += 20;
			if(i==7){
				initialX = this.canvas.width*3/4+10;
				initialY = 45;
			}
		}
	}
}


GameView.prototype.drawElephants = function(data){
	//Draw Elephants
	for( var i=0; i < data.elephants.length; i++){
		var img = document.getElementById('elephant');
		this.drawRectangle(data.elephants[i].x-25,data.elephants[i].y-15,20,10,'black',img);
		data.objectMap[data.elephants[i].position].occupied='elephant';
	}
}

GameView.prototype.drawSheeps = function(data){
	for(var i=0 ; i < data.sheeps.length ; i++){
		var img = document.getElementById('sheep')
		this.drawCircle(data.sheeps[i].x-25, data.sheeps[i].y-10, 5,'blue', null, img);
		data.objectMap[data.sheeps[i].position].occupied='sheep';
	}
}

GameView.prototype.updateGame = function(){
	
}


GameView.prototype.drawRectangle = function(x,y,width,height,color, img){
	this.canvasContext.beginPath();
	if( img ){
		this.canvasContext.drawImage(img,x,y,50,50);
	}else{
		this.canvasContext.fillStyle = color;
		this.canvasContext.fillRect( x, y, width, height);
		this.canvasContext.stroke();
		
	}
}
GameView.prototype.drawText = function(x,y,text){
	this.canvasContext.beginPath();
	this.canvasContext.fillStyle = 'black';
	this.canvasContext.font="20px Georgia";
	this.canvasContext.fillText(text, x, y);
}
GameView.prototype.drawCircle = function(x,y,radius, color, text1,img){
	this.canvasContext.beginPath();
	if(img){
		this.canvasContext.drawImage(img,x,y,40,40);
	}else{
	
		this.canvasContext.fillStyle = color;
		this.canvasContext.arc(x,y,radius,0,2*Math.PI);
		this.canvasContext.fill();
		this.canvasContext.fillStyle = 'white';
		this.canvasContext.font="12px Georgia";
		if( text1 && text1 >= 10 ){
					this.canvasContext.fillText(text1, x-6, y+2);
		}else if(text1){
			
			this.canvasContext.fillText(text1, x-4, y+2);
		}
	}
}
GameView.prototype.canvasMouseDownListener = function(event){
	var bRect = this.canvasElem.getBoundingClientRect();
	var xCor = event.clientX- bRect.x;
	var yCor = event.clientY- bRect.y;
	var that = this;
	var objectFound = false;
	var dependentFound = false;
	if( this.gameData.whoseMove == 'elephant' && this.user.name && this.user.name == this.elephant.name ){
		for( var i=0; i < that.gameData.elephants.length; i++){
				if(checkForObject(that.gameData.elephants[i],xCor,yCor)){
					that.elephantToMove = true;
					var clickedObject = that.gameData.elephants[i];
					that.selectedObject = clickedObject;
					var depends = that.gameData.elephantValidPoints[clickedObject.position];
					var dependentsDrawn = [];

					for(var j = 0; j < depends.length - 1; j++){
						that.temporary.push(depends[j]);
						if( that.gameData.objectMap[depends[j].position].occupied == 'sheep'){
							var jumpLocation = depends[depends.length-1][depends[j].position];
							if( !jumpLocation){
								continue;
							}
							jumpLocation = jumpLocation[0];
							if(that.gameData.objectMap[jumpLocation.position].occupied != 'elephant' &&
							that.gameData.objectMap[jumpLocation.position].occupied != 'sheep'){
								dependentsDrawn.push(jumpLocation);
								that.drawRectangle(jumpLocation.x-5,jumpLocation.y-5,10,10,'red');
							}
						}else if( that.gameData.objectMap[depends[j].position].occupied != 'elephant'){
							dependentsDrawn.push(depends[j]);
							that.drawRectangle(depends[j].x-5,depends[j].y-5,10,10,'red');
						}
					}
					that.dependentsDrawn = dependentsDrawn;
					that.dependents = depends;
					console.log('dependents size'+depends.length);
					objectFound = true;
					break;
				}
			}
			if( !objectFound && that.dependents){
				for(var i=0; i < that.dependents.length;i++){
					var depend = that.dependents[i];
					if(i==that.dependents.length-1){
						for(var position in depend){
							var jumpLocation = depend[position][0];
							var index = that.dependentsDrawn.findIndex(function(item){
								if(item.x == jumpLocation.x && item.y == jumpLocation.y && item.position == jumpLocation.position){
									return true;
								}
								return false;
							});
							if(index == -1 ){
								continue;
							}
							if(checkForObject(depend[position][0],xCor,yCor) ){
								//Dependent clicked
								that.gameData.objectMap[that.selectedObject.position].occupied = null;
								that.selectedObject.position = depend[position][0].position;
								depend[position][0].occupied  =null;
								if(!that.movableObject){
									that.movableObject = {};
								}
								that.movableObject.x = depend[position][0].x;
								that.movableObject.y = depend[position][0].y;
								that.movableObject.position = depend[position][0].position;
								
								that.killSheep(position);
								dependentFound = true;
								//that.elephantToMove = false;
								that.gameData.whoseMove = 'sheep';
								that.redrawGame();
								break;
							}	
						}
						break;
					}else{
						for(var index =0;index<that.dependentsDrawn.length; index++){
							var item = that.dependentsDrawn[index];
							if(item.x == depend.x && item.y == depend.y && item.position == depend.position){
								break;
							}
						}
						if(index == that.dependentsDrawn.length ){
							continue;
						}
						if(checkForObject(that.dependents[i],xCor,yCor)){
							//Dependent clicked
							that.gameData.objectMap[that.selectedObject.position].occupied = null;
							that.selectedObject.position = that.dependents[i].position;
							that.dependents[i].occupied = null;
							if(!that.movableObject){
									that.movableObject = {};
								}
							that.movableObject.x = that.dependents[i].x;
							that.movableObject.y = that.dependents[i].y;
							that.movableObject.position = that.dependents[i].position;
							dependentFound = true;
							that.elephantToMove = false;
							that.gameData.whoseMove = 'sheep';
							that.redrawGame();
							break;
						}
					}
				}
				if(dependentFound){
					that.dependents = [];
					that.dependentsDrawn=[]
				}
			}
	}else if(this.gameData.whoseMove == 'sheep' &&this.user.name && this.user.name == this.sheep.name){
		if( !that.sheepToMove && that.gameData.sheepsLeft > 0){
				if(checkForSheeepsMove(that.gameData.sheepsArea,xCor,yCor)){
					//Sheeps collection clicked
					that.redrawGame();
					that.sheepToMove = true;
					that.drawSheepsPlace(true, that.gameData)
				}else{
					that.drawSheepsPlace(false,that.gameData);
				}
			}
			if( that.sheepToMove ){
				for(var i=0 ; i < that.gameData.movablePoints.length ; i++ ){
					if(checkForObject(that.gameData.movablePoints[i],xCor,yCor)){
						var clickedObject = that.gameData.movablePoints[i];
						that.gameData.movablePoints[i].occupied = null;
						//that.gameData.objectMap[clickedObject.position].occupied = null;
						that.gameData.sheeps.push(Object.assign({},clickedObject));
						if(that.gameData.sheepsLeft)
							that.gameData.sheepsLeft--;
						that.gameData.whoseMove = 'elephant';
						that.sheepToMove = false;
						this.updateMove( that.gameData, that.elephant.name, that.sheep.name);
						that.redrawGame();
						break;
					}
				}	
			}
			if( that.gameData.sheepsLeft == 0 && that.gameData.whoseMove == 'sheep'){
				var objectFound1 = false;
				for(var i=0 ; i < that.gameData.sheeps.length ; i++ ){
					if( checkForObject( that.gameData.sheeps[i],xCor,yCor ) ){
	
						var clickedObject = that.gameData.sheeps[i];
						var depends = that.gameData.sheepValidPoints[clickedObject.position];
						that.selectedObject = clickedObject;
						for(var j=0;j<depends.length;j++){
							console.log('creating object at('+depends[j].x+':'+depends[j].y+')');
							that.temporary.push(depends[j]);
							if(!that.gameData.objectMap[depends[j].position].occupied){
								that.drawRectangle(depends[j].x,depends[j].y,5,5,'red');
							}
						}
						objectFound1 = true;
						that.sheepDependents = depends;
						//that.redrawGame();
						that.sheepToMoveDep = true;
						break;
					}
				}
				if( !objectFound1 && that.sheepToMoveDep ){
					for( var i=0;i<that.sheepDependents.length;i++){
						if(checkForObject(that.sheepDependents[i],xCor,yCor)){
							that.gameData.objectMap[that.selectedObject.position].occupied = null;
							that.selectedObject.position = that.sheepDependents[i].position;
							if(!that.movableObject){
								that.movableObject = {};
							}
							that.movableObject.x = that.sheepDependents[i].x;
							that.movableObject.y = that.sheepDependents[i].y;
							that.movableObject.position = that.sheepDependents[i].position;
						}
					}
					that.gameData.whoseMove='elephant';
					that.sheepToMoveDep=false;
					that.redrawGame();
				}
			}
	}
	function checkForSheeepsMove(shape,x,y){
		var xFound = false;
		var yFound = false;
		if(x - shape.x > 0 && x - shape.x < shape.width){
			xFound = true;
		}
		if(y - shape.y > 0&& y - shape.y < shape.height ){
				yFound = true;
		}
		if(xFound && yFound){
			return true;
		}
		return false;
	}
	function checkForObject(shape,x,y){
			var xFound = false;
			var yFound = false;
			if( Math.abs( shape.x - x )< 20 ){
				xFound = true;
			}
			if( Math.abs(shape.y - y)< 20 ){
				yFound = true;
			}
			if(xFound && yFound){
				return true;
			}
			return false;
	}
	
}
GameView.prototype.clearRectangle = function(shape){
	this.canvasContext.clearRect(shape.x, shape.y,shape.width,shape.height);
	this.canvasContext.stroke();
}
GameView.prototype.getUserName = function () {

}
GameView.prototype.waitForMatch = function(){
	console.log('waiting');
	this.gameHeader.waitForMatch();
}
GameView.prototype.moveObject = function(interval){
	var that = this;
	if(!this.selectedObject && !this.movableObject ){
		//this.updateMove( that.gameData, that.elephantName, that.sheepsName );
		clearInterval(this.interval1);
		return;
	}
	console.log('move objectx'+this.selectedObject.x+"-----move object y"+this.selectedObject.y+'----position'+this.selectedObject.position);
	if(this.selectedObject.x == this.movableObject.x && this.selectedObject.y == this.movableObject.y){
		this.movableObject = null;
		this.selectedObject = null;
		this.updateMove( that.gameData, that.elephant.name, that.sheep.name );
		clearInterval(this.interval1);
		return false;
	}
	if( this.selectedObject.x == this.movableObject.x && this.selectedObject.y <= this.movableObject.y ){
		var diff = Math.abs( this.selectedObject.y - this.movableObject.y );
		if(diff <0.5){
			this.selectedObject.y = this.movableObject.y;
		}else{
			
			this.selectedObject.y += 9/10;
		}
		
	}else if(this.selectedObject.x == this.movableObject.x && this.selectedObject.y > this.movableObject.y){
		var diff = Math.abs( this.selectedObject.y - this.movableObject.y );
		if(diff <0.5){
			this.selectedObject.y = this.movableObject.y;
		}else{
			
		this.selectedObject.y -= 9/10;
		}
	}else if(this.selectedObject.x <= this.movableObject.x && this.selectedObject.y == this.movableObject.y){
		var diff = Math.abs( this.selectedObject.x - this.movableObject.x );
		if(diff <0.5){
			this.selectedObject.x = this.movableObject.x;
		}else{
			
		this.selectedObject.x += 9/10;
		}
		
	}else if(this.selectedObject.x > this.movableObject.x && this.selectedObject.y == this.movableObject.y){
		var diff = Math.abs( this.selectedObject.x - this.movableObject.x );
		if(diff <0.5){
			this.selectedObject.x = this.movableObject.x;
		}else{
			
			this.selectedObject.x -= 9/10;
		}
	}else if(this.selectedObject.x > this.movableObject.x && this.selectedObject.y > this.movableObject.y){
		this.selectedObject.y = this.movableObject.y;
	}else if(this.selectedObject.x < this.movableObject.x && this.selectedObject.y > this.movableObject.y){
		this.selectedObject.y = this.movableObject.y;
	}else if(this.selectedObject.x > this.movableObject.x && this.selectedObject.y < this.movableObject.y){
		this.selectedObject.x = this.movableObject.x;
	}else if(this.selectedObject.x < this.movableObject.x && this.selectedObject.y < this.movableObject.y){
		this.selectedObject.x = this.movableObject.x;
	}
	that.clearGameArea();
	that.drawOutLine(this.gameData.lineData);
	that.drawElephants(this.gameData);
	that.drawSheeps(this.gameData);
	that.drawSheepsPlace(false,this.gameData);
	that.drawSheepsKilledPlace(this.gameData);
	that.gameHeader.render();
	
}
GameView.prototype.startNewGame= function(){
	this.gameHeader.startNew();
	//this.renderGame(true);
	this.loadGame();
}
GameView.prototype.redrawGame = function(){
	this.gameData.movablePoints.forEach(function(item){
		item.occupied = null;
	});
	
	this.clearGameArea();
	this.drawOutLine(this.gameData.lineData);
	this.drawElephants(this.gameData);
	this.drawSheeps(this.gameData);
	var that = this;
	this.interval1 = setInterval( function(){
		that.moveObject();
	},1);
	this.drawSheepsPlace(false,this.gameData);
	this.drawSheepsKilledPlace(this.gameData);
}
GameView.prototype.killSheep = function( position ){
	var index = this.gameData.sheeps.findIndex(function(item){
		if(item.position == position){
			return true;
		}
		return false;
	});
	this.gameData.sheeps.splice(index,1);
	this.gameData.killedSheeps++;
	this.gameData.objectMap[position].occupied = null;
}
GameView.prototype.checkForWin = function(){
	if ( this.gameData.whoseMove=="elephant" ){
		var moveFound = false;
		for(var i=0;i<this.gameData.elephants.length;i++){
			var clickedObject = this.gameData.elephants[i];
			var depends = this.gameData.elephantValidPoints[clickedObject.position];
			

			for(var j = 0; j < depends.length - 1; j++){
				if( this.gameData.objectMap[depends[j].position].occupied == 'sheep'){
					var jumpLocation = depends[depends.length-1][depends[j].position];
					if( !jumpLocation){
						continue;
					}
					jumpLocation = jumpLocation[0];
					if(this.gameData.objectMap[jumpLocation.position].occupied != 'elephant' &&
					this.gameData.objectMap[jumpLocation.position].occupied != 'sheep'){
						moveFound = true;
						break;
					}
				}else if( this.gameData.objectMap[depends[j].position].occupied != 'elephant'){
					moveFound = true;
					break;
				}
			}
			if(moveFound){
				break;
			}
		}
		if(!moveFound){
			if(confirm("**Sheep Wins**. Start New Game?")){
				alert("sheep wins")
				this.startNewGame();
				//document.cookie
				//delete the cookies
			}else{
				//Leave wherever it is
			}
		}
	}
}