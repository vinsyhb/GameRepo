function GameModel(){
	this.gameData = null;
}

GameModel.prototype.getInitialGameData = function(canvasWidth, canvasHeight){
		var data = {
			
		}
		
		data[ 'startingPoint' ] = {
			x:30,
			y:10
		};
		
		data['endingPoint'] = {
			x:canvasWidth-10,
			y:canvasHeight-10
		};
		var distance = 20;
		
		data['sheepsLeft'] = 16;
		data[ 'movablePoints' ] = [];
		var canWidth = data['endingPoint'].x - data['startingPoint'].x;
		var canHeight = data['endingPoint'].y - data['startingPoint'].y;
		var linePoints = [];
		data['linePoints'] = linePoints;
		//Line 1
		var lineObj = {
			_from:{
				x:canWidth/2,
				y:data['startingPoint'].y
			},
			_to:{
				x:canWidth/2,
				y:data['endingPoint'].y
			}
		}
		linePoints.push(lineObj);
		//Line 2
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:canWidth/2,
			y:data['startingPoint'].y
		}
		lineObj._to = {
			x:canWidth/4,
			y:data['endingPoint'].y
		}
		linePoints.push(lineObj);
		//Line 3
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:canWidth/2,
			y:data['startingPoint'].y
		}
		lineObj._to = {
			x:canWidth*3/4,
			y:data['endingPoint'].y
		}
		linePoints.push(lineObj);
		//Line 4
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:canWidth/4,
			y:data['endingPoint'].y
		}
		lineObj._to = {
			x:canWidth*3/4,
			y:data['endingPoint'].y
		}
		linePoints.push(lineObj);
		
		//Line 5
		lineObj= {_from:'',_to:''};
		var firstHorizontalLineUnit = distance*10;
		lineObj._from = {
			x:data.startingPoint.x,
			y:firstHorizontalLineUnit
		}
		lineObj._to = {
			x:data.endingPoint.x,
			y:firstHorizontalLineUnit
		}
		linePoints.push(lineObj);
		
		//Line 6
		lineObj= {_from:'',_to:''};
		var secondHorizontalLineUnit = distance*18;
		lineObj._from = {
			x:data.startingPoint.x,
			y:secondHorizontalLineUnit
		}
		lineObj._to = {
			x:data.endingPoint.x,
			y:secondHorizontalLineUnit
		}
		linePoints.push(lineObj);
		
		//Line 7
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:distance*10,
			y:firstHorizontalLineUnit - distance*5
		}
		lineObj._to = {
			x:distance*10,
			y:secondHorizontalLineUnit + distance*5
		}
		linePoints.push(lineObj);
		
		//Line 8
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:data.startingPoint.x,
			y:firstHorizontalLineUnit
		}
		lineObj._to = {
			x:distance*10,
			y:firstHorizontalLineUnit - distance*5
		}
		linePoints.push(lineObj);
		
		//Line 9
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:data.startingPoint.x,
			y:secondHorizontalLineUnit
		}
		lineObj._to = {
			x:distance*10,
			y:secondHorizontalLineUnit + distance*5
		}
		linePoints.push(lineObj);
		
		//Line 10
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:data.endingPoint.x - distance*10,
			y:firstHorizontalLineUnit - distance*5
		}
		lineObj._to = {
			x:data.endingPoint.x - distance*10,
			y:secondHorizontalLineUnit + distance*5
		}
		linePoints.push(lineObj);
		
		//Line 11
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x:data.endingPoint.x - distance*10,
			y:firstHorizontalLineUnit - distance*5
		}
		lineObj._to = {
			x:data.endingPoint.x,
			y:firstHorizontalLineUnit
		}
		linePoints.push(lineObj);
		
		//Line 12
		lineObj= {_from:'',_to:''};
		lineObj._from = {
			x : data.endingPoint.x,
			y : secondHorizontalLineUnit
		}
		lineObj._to = {
			x:data.endingPoint.x - distance*10,
			y:secondHorizontalLineUnit + distance*5
		}
		linePoints.push(lineObj);
		
		this.gameData= {
			lineData: data,
			movablePoints:[],
			whoseMove:'elephant',
			elephantValidPoints:{},
			sheepValidPoints:{},
			objectMap:{},
			elephants:[],
			sheeps:[],
			sheepsKilledArea : {x:5,y:0,width:canvasWidth/4,canvasHeight:80},
			killedSheeps:0,
			sheepsLeft:16,
			sheepsArea: {x:canvasWidth*3/4,y:0,width:canvasHeight/4,height:80}
		}
		this.gameData.movablePoints.push({x:canWidth/2,y:data['startingPoint'].y,occupied:false,position:1});
		this.gameData.movablePoints.push({x:canWidth/2,y:data['endingPoint'].y,occupied:false,position:21});
		this.gameData.movablePoints.push({x:canWidth/4,y:data['endingPoint'].y,occupied:false,position:20});
		this.gameData.movablePoints.push({x:canWidth*3/4,y:data['endingPoint'].y,occupied:false,position:22});
		this.gameData.movablePoints.push({x:canWidth/2,y:firstHorizontalLineUnit,occupied:false,position:7});
		
		//Find other intersecting points
		var opp = canHeight;
		var adjacent = canWidth/2- canWidth/4;
		var hyp = Math.sqrt(opp*opp + adjacent*adjacent);
		
		var topAngleCosTheta = opp/hyp;
		var topAngle = Math.acos(topAngleCosTheta)*180/Math.PI
		console.log('top angle'+topAngle);
		var height1 = distance*10;
		
		//topAngleCosTheta = height1/hyp1
		//hyp1 = height1/topAngleCosTheta
		var hyp1 = height1 / topAngleCosTheta;
		// hyp1^2 = height1^2+width1^2;
		//width1 = Math.sqrt( hyp1^2-hieght1^2)
		var width1 = Math.sqrt(hyp1*hyp1 - height1*height1);
		//x = width/2-width1
		this.gameData.movablePoints.push( { x : canWidth/2 - width1, y : firstHorizontalLineUnit,occupied:false,position:6} );
		this.gameData.movablePoints.push( { x: canWidth/2 + width1, y : firstHorizontalLineUnit,occupied:false,position:8} );
		this.gameData.movablePoints.push({x:canWidth/2,y:secondHorizontalLineUnit,occupied:false,position:14});
		var height1 = distance*18;
		var hyp1 = height1/topAngleCosTheta;
		var width1 = Math.sqrt(hyp1*hyp1 - height1*height1);
		this.gameData.movablePoints.push({ x : canWidth/2 - width1, y : secondHorizontalLineUnit, occupied:false, position:13});
		this.gameData.movablePoints.push({ x: canWidth/2 + width1, y : secondHorizontalLineUnit, occupied:false, position:15});
		this.gameData.movablePoints.push({ x: distance*10, y : firstHorizontalLineUnit- distance*5, occupied:false,position:2});
		this.gameData.movablePoints.push({ x: distance*10, y : firstHorizontalLineUnit,occupied:false,position:5});
		this.gameData.movablePoints.push({ x: data['startingPoint'].x, y : firstHorizontalLineUnit,occupied:false,position:4});
		this.gameData.movablePoints.push({ x: data['startingPoint'].x, y : secondHorizontalLineUnit,occupied:false,position:11});
		this.gameData.movablePoints.push({ x: distance*10, y : secondHorizontalLineUnit,occupied:false,position:12});
		this.gameData.movablePoints.push({ x: distance*10, y : secondHorizontalLineUnit+distance*5,occupied:false,position:18});
		this.gameData.movablePoints.push({ x: data.endingPoint.x - distance*10, y : firstHorizontalLineUnit- distance*5, occupied:false,position:3});
		this.gameData.movablePoints.push({ x: data.endingPoint.x - distance*10, y : firstHorizontalLineUnit,occupied:false,position:9});
		this.gameData.movablePoints.push({ x: data['endingPoint'].x, y : firstHorizontalLineUnit,occupied:false,position:10});
		this.gameData.movablePoints.push({ x: data.endingPoint.x - distance*10, y : secondHorizontalLineUnit+distance*5,occupied:false,position:19});
		this.gameData.movablePoints.push({ x: data.endingPoint.x - distance*10, y : secondHorizontalLineUnit,occupied:false,position:16});
		this.gameData.movablePoints.push({ x: data['endingPoint'].x, y : secondHorizontalLineUnit,occupied:false,position:17});
		var elephants_local = this.gameData.movablePoints.filter(function(shape){
			switch(shape.position){
				case 1:
				case 6:
				case 7:
				case 8:
					return true;
				default:
					return false;
			}
		});
		this.gameData.elephants = elephants_local.map(function(elep){
			return Object.assign({},elep);
		});
		this.gameData.objectMap = this.gameData.movablePoints.reduce(function(object,item){
			object[item.position] = item;
			return object;
		},{} );
		debugger;
		var that = this;
		this.gameData.elephantValidPoints = getValidPointsMap(true);
		this.gameData.sheepValidPoints = getValidPointsMap();
		
		function getValidPointsMap(isEleph){
		var validPointsMap={};
		for( var i=0; i < that.gameData.movablePoints.length;i++){
			var shape = that.gameData.movablePoints[i];
			var depends = [];
			if( shape.position == 1 ){
					validPointsMap [1] =[];
					depends = filterItems(that.gameData.movablePoints,'position',6);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',7));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',8));
					if(isEleph){
						depends.push({
							6:filterItems(that.gameData.movablePoints,'position',13),
							7:filterItems(that.gameData.movablePoints,'position',14),
							8:filterItems(that.gameData.movablePoints,'position',15),
						});
					}
					validPointsMap[1] = depends;
			}else if(shape.position == 2){
					depends = filterItems(that.gameData.movablePoints,'position',4);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',5));
					if(isEleph){
						depends.push({
							5:filterItems(that.gameData.movablePoints,'position',12)
						});
					}
					validPointsMap[2] = depends;
					
			}else if(shape.position == 3){
					validPointsMap[3]=[];
					depends = filterItems(that.gameData.movablePoints,'position',9);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',10));
					if(isEleph){
						depends.push({
							9:filterItems(that.gameData.movablePoints,'position',16)
						});
					}
					validPointsMap[3] = depends;
			}else if(shape.position == 4){
					validPointsMap[4]=[];
					depends = filterItems(that.gameData.movablePoints,'position',5);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',2));
					if(isEleph){
						depends.push({
							5:filterItems(that.gameData.movablePoints,'position',6)
						});
					}
					validPointsMap[4] = depends;
			}else if(shape.position == 5){
					validPointsMap[5]=[];
					depends = filterItems(that.gameData.movablePoints,'position',2);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',4));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',6));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',12));
					if(isEleph){
						depends.push({
							6:filterItems(that.gameData.movablePoints,'position',7),
							12:filterItems(that.gameData.movablePoints,'position',18)
						});
					}
					validPointsMap[5] = depends;
			}else if(shape.position == 6){
					depends = filterItems(that.gameData.movablePoints,'position',1);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',7));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',5));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',13));
					if(isEleph){
						depends.push({
							7:filterItems(that.gameData.movablePoints,'position',8),
							5:filterItems(that.gameData.movablePoints,'position',4),
							13:filterItems(that.gameData.movablePoints,'position',20)
						});
					}
					validPointsMap[6] = depends;
			}else if(shape.position == 7){
					depends = filterItems(that.gameData.movablePoints,'position',1);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',6));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',8));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',14));
					if(isEleph){
						depends.push({
							6:filterItems(that.gameData.movablePoints,'position',5),
							8:filterItems(that.gameData.movablePoints,'position',9),
							14:filterItems(that.gameData.movablePoints,'position',21)
						});
					}
					validPointsMap[7] = depends;
			}else if(shape.position == 8){
					depends = filterItems(that.gameData.movablePoints,'position',1);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',7));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',9));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',15));
					if(isEleph){
						depends.push({
							7:filterItems(that.gameData.movablePoints,'position',6),
							15:filterItems(that.gameData.movablePoints,'position',22),
							9:filterItems(that.gameData.movablePoints,'position',10)
						});
					}
					validPointsMap[8] = depends;
			}else if(shape.position == 9){
					depends = filterItems(that.gameData.movablePoints,'position',3);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',10));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',8));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',16));
					if(isEleph){
						depends.push({
							8:filterItems(that.gameData.movablePoints,'position',7),
							16:filterItems(that.gameData.movablePoints,'position',19)
						});
					}
					validPointsMap[9] = depends;
			}else if(shape.position == 10){
					depends = filterItems(that.gameData.movablePoints,'position',3);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',9));
					if(isEleph){
						depends.push({
							9:filterItems(that.gameData.movablePoints,'position',8)
						});
					}
					validPointsMap[10] = depends;
			}else if(shape.position == 11){
					depends = filterItems(that.gameData.movablePoints,'position',12);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',18));
					if(isEleph){
						depends.push({
							12:filterItems(that.gameData.movablePoints,'position',15)
						});
					}
					validPointsMap[11] = depends;
			}else if(shape.position == 12){
					depends = filterItems(that.gameData.movablePoints,'position',5);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',11));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',13));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',18));
					if(isEleph){
						depends.push({
							5:filterItems(that.gameData.movablePoints,'position',2),
							13:filterItems(that.gameData.movablePoints,'position',14)
						});
					}
					validPointsMap[12] = depends;
			}else if(shape.position == 13){
					depends = filterItems(that.gameData.movablePoints,'position',12);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',6));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',14));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',20));
					if(isEleph){
						depends.push({
							12:filterItems(that.gameData.movablePoints,'position',11),
							6:filterItems(that.gameData.movablePoints,'position',1),
							14:filterItems(that.gameData.movablePoints,'position',15)
						});
					}
					validPointsMap[13] = depends;
			}else if(shape.position == 14){
					depends = filterItems(that.gameData.movablePoints,'position',7);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',13));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',15));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',21));
					if(isEleph){
						depends.push({
							13:filterItems(that.gameData.movablePoints,'position',12),
							7:filterItems(that.gameData.movablePoints,'position',1),
							15:filterItems(that.gameData.movablePoints,'position',16)
						});
					}
					validPointsMap[14] = depends;
			}else if(shape.position == 15){
					depends = filterItems(that.gameData.movablePoints,'position',14);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',8));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',16));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',22));
					if(isEleph){
						depends.push({
							14:filterItems(that.gameData.movablePoints,'position',13),
							8:filterItems(that.gameData.movablePoints,'position',1),
							16:filterItems(that.gameData.movablePoints,'position',17)
						});
					}
					validPointsMap[15] = depends;
			}else if(shape.position == 16){
					depends = filterItems(that.gameData.movablePoints,'position',15);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',9));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',17));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',19));
					if(isEleph){
						depends.push({
							15:filterItems(that.gameData.movablePoints,'position',14),
							9:filterItems(that.gameData.movablePoints,'position',3)
						});
					}
					validPointsMap[16] = depends;
			}else if(shape.position == 17){
					depends = filterItems(that.gameData.movablePoints,'position',16);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',19));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',15));
					if(isEleph){
						depends.push({
							16:filterItems(that.gameData.movablePoints,'position',15)
						});
					}
					validPointsMap[17] = depends;
			}else if(shape.position == 18){
					depends = filterItems(that.gameData.movablePoints,'position',11);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',12));
					if(isEleph){
						depends.push({
							12:filterItems(that.gameData.movablePoints,'position',5)
						});
					}
					validPointsMap[18] = depends;
			}else if(shape.position == 19){
					depends = filterItems(that.gameData.movablePoints,'position',16);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',17));
					if(isEleph){
						depends.push({
							16:filterItems(that.gameData.movablePoints,'position',19)
						});
					}
					validPointsMap[19] = depends;
			}else if(shape.position == 20){
					depends = filterItems(that.gameData.movablePoints,'position',13);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',21));
					if(isEleph){
						depends.push({
							13:filterItems(that.gameData.movablePoints,'position',6),
							21:filterItems(that.gameData.movablePoints,'position',22)
						});
					}
					validPointsMap[20] = depends;
			}else if(shape.position == 21){
					depends = filterItems(that.gameData.movablePoints,'position',14);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',20));
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',22));
					if(isEleph){
						depends.push({
							14:filterItems(that.gameData.movablePoints,'position',7)
						});
					}
					validPointsMap[21] = depends;
			}else if(shape.position == 22){
					depends = filterItems(that.gameData.movablePoints,'position',21);
					depends = depends.concat(filterItems(that.gameData.movablePoints,'position',15));
					if(isEleph){	
						depends.push({
							21:filterItems(that.gameData.movablePoints,'position',20),
							15:filterItems(that.gameData.movablePoints,'position',8)
						});
					}
					validPointsMap[22] = depends;
			}
		}
		return validPointsMap
	}
	function filterItems(items, key, value){
		return items.filter(function(item){
			if(item[key] && item[key]== value){
				return true;
			}
		})
	}
		return data;
}

GameModel.prototype.updateElephantsMove = function(){
	
}

GameModel.prototype.updateSheepsMove = function(){
	
}

GameModel.prototype.getElephantMoves = function(){
	
}

GameModel.prototype.getSheepMoves = function(){
	
}

GameModel.prototype.deleteSheepFromGame = function(){
	
}

GameModel.prototype.getRemainingSheeps = function(){
	
}

GameModel.prototype.getKilledSheeps = function(){
	
}
GameModel.prototype.saveGameOptions = function( data ,callBack){
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
		   callBack();
		}
	};
	xhttp.open("POST", "/saveGameOptions", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	debugger;
	xhttp.send( JSON.stringify( {request:data} ));
};


GameModel.prototype.getGameData = function( user,opponent, gameInProgress, callBack){
	var xhttp = new XMLHttpRequest();
	var data = this.getAllDataForGame();
	var that = this;
	if(gameInProgress){
		xhttp.onreadystatechange = function(data,data1) {
			if ( this.readyState == 4 && this.status == 200 ) {
			   callBack(JSON.parse(this.response));
			}
		};
		xhttp.open("POST", "/getGameData", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		debugger;
		xhttp.send( JSON.stringify( {user:user,opponent:opponent} ));
	} else {
		xhttp.onreadystatechange = function(data) {
			if ( this.readyState == 4 && this.status == 200 ) {
			   callBack(that.gameData);
			}
		};
		xhttp.open("POST", "/saveGameData", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		debugger;
		this.gameData.elephant = user;
		this.gameData.sheep = opponent;
		xhttp.send( JSON.stringify( this.gameData ));
	}
}

GameModel.prototype.getAllDataForGame = function(){

}
GameModel.prototype.updateMove = function(data, elephant, sheep){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(data) {
			if ( this.readyState == 4 && this.status == 200 ) {
			   //callBack(that.gameData);
			}
		};
		xhttp.open("POST", "/updateMove", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		debugger;
		var request = {
			data:data,
			fileName:elephant+"_"+sheep+".json"
		}
		xhttp.send( JSON.stringify( request ) );
}
