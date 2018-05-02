function Game(elephants){
	this.isMobile = true;
	this.elephants= elephants;
	this.canvas = document.getElementById('elephantGame');
	this.canElement = document.getElementById('elephantGame').getContext('2d');
	this.movablePoints = [];
	this.validPoints ={};
	this.validPointsMap = {};
	this.elephants = [];
	this.temporary =[];
	this.sheeps = [];
	this.elephantValidPoints = {};
	this.sheepValidPoints = {};
	this.elephantToMove = false;
	this.sheepToMove = false;
	this.dependents = [];
	this.dependentsDrawn = [];
	this.selectedObject = null;
	this.movableObject = {};
	this.interval1 = null;
	this.sheepsLeft = 16;
	this.whoseMove = 'elephant';
	this.killedSheeps = 0;
	this.canvasWidth = this.canvas.width;
	this.canvasHeight = this.canvas.height;
	this.startingPosition = {
		x:30,
		y:15
	}
	
}
Game.prototype.drawGame = function(redraw){
	//draw rectangles / lines
	var canHeight = this.canvasHeight-35;
	var canWidth = this.canvasWidth - 30;
	this.canElement.clearRect(0,0,this.canvasWidth,this.canvasHeight);
	this.canElement.fillStyle='#0e0e1317';
	this.canElement.fillRect(0,0,this.canvasWidth,this.canvasHeight);
	this.canElement.beginPath();
	if ( this.whoseMove == 'elephant'){
			var img = document.getElementById('elephant');
			this.canElement.drawImage(img,canWidth/2+80,20,30,30);
			this.drawText(canWidth/2+30,40,'Move');
	}else{
		var img = document.getElementById('sheep');
		this.canElement.drawImage(img,canWidth/2+80,20,30,30);
		this.drawText(canWidth/2+30,40,'Move');
		//this.drawText(canWidth/2+40,40,'Sheep\'s move');
	}
	var distance = 20;
	//Vertical line
	 /* for(var i=0;i<=canWidth;i += distance){
		this.canElement.moveTo(i,canHeight);
		this.canElement.lineTo(i,0);
	} */
	//Horizontal line
	/* for(var i=0;i<=canHeight;i += distance){
		this.canElement.moveTo(canWidth,i);
		this.canElement.lineTo(0,i);
	} */
	this.canElement.stroke();
	//draw centre line
	this.canElement.beginPath();
	this.canElement.strokeStyle='black';
	this.canElement.moveTo(canWidth/2,this.startingPosition.y);
	this.canElement.lineTo(canWidth/2,canHeight);
	
	this.canElement.moveTo(canWidth/2,this.startingPosition.y);
	this.canElement.lineTo(canWidth/4,canHeight);
	
	this.canElement.moveTo(canWidth/2,this.startingPosition.y);
	this.canElement.lineTo(canWidth*3/4,canHeight);
	
	this.canElement.moveTo(canWidth/4,canHeight);
	this.canElement.lineTo(canWidth*3/4,canHeight);
	if(!redraw){
		this.movablePoints.push({x:canWidth/2,y:this.startingPosition.y,occupied:false,position:1});
		this.movablePoints.push({x:canWidth/2,y:canHeight,occupied:false,position:21});
		this.movablePoints.push({x:canWidth/4,y:canHeight,occupied:false,position:20});
		this.movablePoints.push({x:canWidth*3/4,y:canHeight,occupied:false,position:22});
	}
	
	var firstHorizontalLineUnit = distance*10;
	this.canElement.moveTo( this.startingPosition.x, firstHorizontalLineUnit );
	this.canElement.lineTo( canWidth , firstHorizontalLineUnit );
	if(!redraw){
		this.movablePoints.push({x:canWidth/2,y:firstHorizontalLineUnit,occupied:false,position:7});
	}
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
	if(!redraw){
		this.movablePoints.push( { x : canWidth/2 - width1, y : firstHorizontalLineUnit,occupied:false,position:6} );
		this.movablePoints.push( { x: canWidth/2 + width1, y : firstHorizontalLineUnit,occupied:false,position:8} );
	}
	debugger;
	//Elephant's starting points
	//this.elephants.push({ x : canWidth/2 - width1, y : firstHorizontalLineUnit});
	//this.elephants.push({ x: canWidth/2 + width1, y : firstHorizontalLineUnit} );

	//
	var secondHorizontalLineUnit = distance*18;
	this.canElement.moveTo(this.startingPosition.x,secondHorizontalLineUnit);
	this.canElement.lineTo(canWidth,secondHorizontalLineUnit);
	if(!redraw){
		this.movablePoints.push({x:canWidth/2,y:secondHorizontalLineUnit,occupied:false,position:14});
	}
	
	
	var height1 = distance*18;
	var hyp1 = height1/topAngleCosTheta;
	var width1 = Math.sqrt(hyp1*hyp1 - height1*height1);
	debugger;
	if(!redraw){
		this.movablePoints.push({ x : canWidth/2 - width1, y : secondHorizontalLineUnit, occupied:false, position:13});
		this.movablePoints.push({ x: canWidth/2 + width1, y : secondHorizontalLineUnit, occupied:false, position:15});
	}

	//Draw side part
	this.canElement.moveTo(distance*5,firstHorizontalLineUnit- distance*5);
	this.canElement.lineTo(distance*5,secondHorizontalLineUnit + distance*5);
	
	
	this.canElement.moveTo(distance*5,firstHorizontalLineUnit- distance*5);
	this.canElement.lineTo(this.startingPosition.x,firstHorizontalLineUnit);
	
	this.canElement.moveTo(distance*5,secondHorizontalLineUnit + distance*5);
	this.canElement.lineTo(this.startingPosition.x,secondHorizontalLineUnit);
	if(!redraw){
	
		this.movablePoints.push({ x: distance*5, y : firstHorizontalLineUnit- distance*5, occupied:false,position:2});
		this.movablePoints.push({ x: distance*5, y : firstHorizontalLineUnit,occupied:false,position:5});
		this.movablePoints.push({ x: this.startingPosition.x, y : firstHorizontalLineUnit,occupied:false,position:4});
		this.movablePoints.push({ x: this.startingPosition.x, y : secondHorizontalLineUnit,occupied:false,position:11});
		this.movablePoints.push({ x: distance*5, y : secondHorizontalLineUnit,occupied:false,position:12});
		this.movablePoints.push({ x: distance*5, y : secondHorizontalLineUnit+distance*5,occupied:false,position:18});
	}
	//
	this.canElement.moveTo(canWidth - distance*5,firstHorizontalLineUnit- distance*5);
	this.canElement.lineTo(canWidth - distance*5,secondHorizontalLineUnit + distance*5);
	
	this.canElement.moveTo(canWidth - distance*5,firstHorizontalLineUnit- distance*5);
	this.canElement.lineTo(canWidth ,firstHorizontalLineUnit);
	
	this.canElement.moveTo(canWidth - distance*5,secondHorizontalLineUnit + distance*5);
	this.canElement.lineTo(canWidth ,secondHorizontalLineUnit);
	this.canElement.stroke();
	
	if(!redraw){

		this.movablePoints.push({ x: canWidth - distance*5, y : firstHorizontalLineUnit- distance*5, occupied:false,position:3});
		this.movablePoints.push({ x: canWidth - distance*5, y : firstHorizontalLineUnit,occupied:false,position:9});
		this.movablePoints.push({ x: canWidth, y : firstHorizontalLineUnit,occupied:false,position:10});
		this.movablePoints.push({ x: canWidth - distance*5, y : secondHorizontalLineUnit+distance*5,occupied:false,position:19});
		this.movablePoints.push({ x: canWidth - distance*5, y : secondHorizontalLineUnit,occupied:false,position:16});
		this.movablePoints.push({ x: canWidth, y : secondHorizontalLineUnit,occupied:false,position:17});
		
		var movMap = {};
		debugger;
		var elephants_local = this.movablePoints.filter(function(shape){
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
		this.elephants = elephants_local.map(function(elep){
			return Object.assign({},elep);
		});
		this.objectMap = this.movablePoints.reduce(function(object,item){
			object[item.position] = item;
			return object;
		},{} );
		debugger;
		var that = this;
		this.elephantValidPoints = getValidPointsMap(true);
		this.sheepValidPoints = getValidPointsMap();
	}	
	function getValidPointsMap(isEleph){
		var validPointsMap={};
		for( var i=0; i < that.movablePoints.length;i++){
			var shape = that.movablePoints[i];
			var depends = [];
			if( shape.position == 1 ){
					validPointsMap [1] =[];
					depends = filterItems(that.movablePoints,'position',6);
					depends = depends.concat(filterItems(that.movablePoints,'position',7));
					depends = depends.concat(filterItems(that.movablePoints,'position',8));
					if(isEleph){
						depends.push({
							6:filterItems(that.movablePoints,'position',13),
							7:filterItems(that.movablePoints,'position',14),
							8:filterItems(that.movablePoints,'position',15),
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',13));
						// depends = depends.concat(filterItems(that.movablePoints,'position',14));
						// depends = depends.concat(filterItems(that.movablePoints,'position',15));
					}
					validPointsMap[1] = depends;
			}else if(shape.position == 2){
					depends = filterItems(that.movablePoints,'position',4);
					depends = depends.concat(filterItems(that.movablePoints,'position',5));
					if(isEleph){
						depends.push({
							5:filterItems(that.movablePoints,'position',12)
						});
						//depends = depends.concat(filterItems(that.movablePoints,'position',12));
					}
					validPointsMap[2] = depends;
					
			}else if(shape.position == 3){
					validPointsMap[3]=[];
					depends = filterItems(that.movablePoints,'position',9);
					depends = depends.concat(filterItems(that.movablePoints,'position',10));
					if(isEleph){
						depends.push({
							9:filterItems(that.movablePoints,'position',16)
						});
						//depends = depends.concat(filterItems(that.movablePoints,'position',16));
					}
					validPointsMap[3] = depends;
			}else if(shape.position == 4){
					validPointsMap[4]=[];
					depends = filterItems(that.movablePoints,'position',5);
					depends = depends.concat(filterItems(that.movablePoints,'position',2));
					if(isEleph){
						depends.push({
							5:filterItems(that.movablePoints,'position',6)
						});
					}
					validPointsMap[4] = depends;
			}else if(shape.position == 5){
					validPointsMap[5]=[];
					depends = filterItems(that.movablePoints,'position',2);
					depends = depends.concat(filterItems(that.movablePoints,'position',4));
					depends = depends.concat(filterItems(that.movablePoints,'position',6));
					depends = depends.concat(filterItems(that.movablePoints,'position',12));
					if(isEleph){
						depends.push({
							6:filterItems(that.movablePoints,'position',7),
							12:filterItems(that.movablePoints,'position',18)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',7));
						// depends = depends.concat(filterItems(that.movablePoints,'position',18));
					}
					validPointsMap[5] = depends;
			}else if(shape.position == 6){
					depends = filterItems(that.movablePoints,'position',1);
					depends = depends.concat(filterItems(that.movablePoints,'position',7));
					depends = depends.concat(filterItems(that.movablePoints,'position',5));
					depends = depends.concat(filterItems(that.movablePoints,'position',13));
					if(isEleph){
						depends.push({
							7:filterItems(that.movablePoints,'position',8),
							5:filterItems(that.movablePoints,'position',4),
							13:filterItems(that.movablePoints,'position',20)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',4));
						// depends = depends.concat(filterItems(that.movablePoints,'position',8));
						// depends = depends.concat(filterItems(that.movablePoints,'position',20));
					}
					validPointsMap[6] = depends;
			}else if(shape.position == 7){
					depends = filterItems(that.movablePoints,'position',1);
					depends = depends.concat(filterItems(that.movablePoints,'position',6));
					depends = depends.concat(filterItems(that.movablePoints,'position',8));
					depends = depends.concat(filterItems(that.movablePoints,'position',14));
					if(isEleph){
						depends.push({
							6:filterItems(that.movablePoints,'position',5),
							8:filterItems(that.movablePoints,'position',9),
							14:filterItems(that.movablePoints,'position',21)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',5));
						// depends = depends.concat(filterItems(that.movablePoints,'position',9));
						// depends = depends.concat(filterItems(that.movablePoints,'position',21));
					}
					validPointsMap[7] = depends;
			}else if(shape.position == 8){
					depends = filterItems(that.movablePoints,'position',1);
					depends = depends.concat(filterItems(that.movablePoints,'position',7));
					depends = depends.concat(filterItems(that.movablePoints,'position',9));
					depends = depends.concat(filterItems(that.movablePoints,'position',15));
					if(isEleph){
						depends.push({
							7:filterItems(that.movablePoints,'position',6),
							15:filterItems(that.movablePoints,'position',22),
							9:filterItems(that.movablePoints,'position',10)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',6));
						// depends = depends.concat(filterItems(that.movablePoints,'position',10));
						// depends = depends.concat(filterItems(that.movablePoints,'position',22));
					}
					validPointsMap[8] = depends;
			}else if(shape.position == 9){
					depends = filterItems(that.movablePoints,'position',3);
					depends = depends.concat(filterItems(that.movablePoints,'position',10));
					depends = depends.concat(filterItems(that.movablePoints,'position',8));
					depends = depends.concat(filterItems(that.movablePoints,'position',16));
					if(isEleph){
						depends.push({
							8:filterItems(that.movablePoints,'position',7),
							16:filterItems(that.movablePoints,'position',19)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',7));
						// depends = depends.concat(filterItems(that.movablePoints,'position',19));
					}
					validPointsMap[9] = depends;
			}else if(shape.position == 10){
					depends = filterItems(that.movablePoints,'position',3);
					depends = depends.concat(filterItems(that.movablePoints,'position',9));
					if(isEleph){
						depends.push({
							9:filterItems(that.movablePoints,'position',8)
						});
						//depends = depends.concat(filterItems(that.movablePoints,'position',8));
					}
					validPointsMap[10] = depends;
			}else if(shape.position == 11){
					depends = filterItems(that.movablePoints,'position',12);
					depends = depends.concat(filterItems(that.movablePoints,'position',18));
					if(isEleph){
						depends.push({
							12:filterItems(that.movablePoints,'position',15)
						});
						//depends = depends.concat(filterItems(that.movablePoints,'position',13));
						
					}
					validPointsMap[11] = depends;
			}else if(shape.position == 12){
					depends = filterItems(that.movablePoints,'position',5);
					depends = depends.concat(filterItems(that.movablePoints,'position',11));
					depends = depends.concat(filterItems(that.movablePoints,'position',13));
					depends = depends.concat(filterItems(that.movablePoints,'position',18));
					if(isEleph){
						depends.push({
							5:filterItems(that.movablePoints,'position',2),
							13:filterItems(that.movablePoints,'position',14)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',2));
						// depends = depends.concat(filterItems(that.movablePoints,'position',14));
					}
					validPointsMap[12] = depends;
			}else if(shape.position == 13){
					depends = filterItems(that.movablePoints,'position',12);
					depends = depends.concat(filterItems(that.movablePoints,'position',6));
					depends = depends.concat(filterItems(that.movablePoints,'position',14));
					depends = depends.concat(filterItems(that.movablePoints,'position',20));
					if(isEleph){
						depends.push({
							12:filterItems(that.movablePoints,'position',11),
							6:filterItems(that.movablePoints,'position',1),
							14:filterItems(that.movablePoints,'position',15)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',1));
						// depends = depends.concat(filterItems(that.movablePoints,'position',11));
						// depends = depends.concat(filterItems(that.movablePoints,'position',15));
					}
					validPointsMap[13] = depends;
			}else if(shape.position == 14){
					depends = filterItems(that.movablePoints,'position',7);
					depends = depends.concat(filterItems(that.movablePoints,'position',13));
					depends = depends.concat(filterItems(that.movablePoints,'position',15));
					depends = depends.concat(filterItems(that.movablePoints,'position',21));
					if(isEleph){
						depends.push({
							13:filterItems(that.movablePoints,'position',12),
							7:filterItems(that.movablePoints,'position',1),
							15:filterItems(that.movablePoints,'position',16)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',12));
						// depends = depends.concat(filterItems(that.movablePoints,'position',1));
						// depends = depends.concat(filterItems(that.movablePoints,'position',16));
					}
					validPointsMap[14] = depends;
			}else if(shape.position == 15){
					depends = filterItems(that.movablePoints,'position',14);
					depends = depends.concat(filterItems(that.movablePoints,'position',8));
					depends = depends.concat(filterItems(that.movablePoints,'position',16));
					depends = depends.concat(filterItems(that.movablePoints,'position',22));
					if(isEleph){
						depends.push({
							14:filterItems(that.movablePoints,'position',13),
							8:filterItems(that.movablePoints,'position',1),
							16:filterItems(that.movablePoints,'position',17)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',13));
						// depends = depends.concat(filterItems(that.movablePoints,'position',1));
						// depends = depends.concat(filterItems(that.movablePoints,'position',17));
					}
					validPointsMap[15] = depends;
			}else if(shape.position == 16){
					depends = filterItems(that.movablePoints,'position',15);
					depends = depends.concat(filterItems(that.movablePoints,'position',9));
					depends = depends.concat(filterItems(that.movablePoints,'position',17));
					depends = depends.concat(filterItems(that.movablePoints,'position',19));
					if(isEleph){
						depends.push({
							15:filterItems(that.movablePoints,'position',14),
							9:filterItems(that.movablePoints,'position',3)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',3));
						// depends = depends.concat(filterItems(that.movablePoints,'position',14));
					}
					validPointsMap[16] = depends;
			}else if(shape.position == 17){
					depends = filterItems(that.movablePoints,'position',16);
					depends = depends.concat(filterItems(that.movablePoints,'position',19));
					if(isEleph){
						depends.push({
							16:filterItems(that.movablePoints,'position',15)
						});
						depends = depends.concat(filterItems(that.movablePoints,'position',15));
					}
					validPointsMap[17] = depends;
			}else if(shape.position == 18){
					depends = filterItems(that.movablePoints,'position',11);
					depends = depends.concat(filterItems(that.movablePoints,'position',12));
					if(isEleph){
						depends.push({
							12:filterItems(that.movablePoints,'position',5)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',5));
					}
					validPointsMap[18] = depends;
			}else if(shape.position == 19){
					depends = filterItems(that.movablePoints,'position',16);
					depends = depends.concat(filterItems(that.movablePoints,'position',17));
					if(isEleph){
						depends.push({
							16:filterItems(that.movablePoints,'position',19)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',3));
					}
					validPointsMap[19] = depends;
			}else if(shape.position == 20){
					depends = filterItems(that.movablePoints,'position',13);
					depends = depends.concat(filterItems(that.movablePoints,'position',21));
					if(isEleph){
						depends.push({
							13:filterItems(that.movablePoints,'position',6),
							21:filterItems(that.movablePoints,'position',22)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',6));
						// depends = depends.concat(filterItems(that.movablePoints,'position',22));
					}
					validPointsMap[20] = depends;
			}else if(shape.position == 21){
					depends = filterItems(that.movablePoints,'position',14);
					depends = depends.concat(filterItems(that.movablePoints,'position',20));
					depends = depends.concat(filterItems(that.movablePoints,'position',22));
					if(isEleph){
						depends.push({
							14:filterItems(that.movablePoints,'position',7)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',7));
					}
					validPointsMap[21] = depends;
			}else if(shape.position == 22){
					depends = filterItems(that.movablePoints,'position',21);
					depends = depends.concat(filterItems(that.movablePoints,'position',15));
					if(isEleph){
						depends.push({
							21:filterItems(that.movablePoints,'position',20),
							15:filterItems(that.movablePoints,'position',8)
						});
						// depends = depends.concat(filterItems(that.movablePoints,'position',20));
						// depends = depends.concat(filterItems(that.movablePoints,'position',8));
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
	
}
Game.prototype.drawElephants = function(){
	//Draw Elephants
	for( var i=0; i < this.elephants.length; i++){
		var img = document.getElementById('elephant');
		this.drawRectangle(this.elephants[i].x-25,this.elephants[i].y-15,20,10,'black',img);
		this.objectMap[this.elephants[i].position].occupied='elephant';
	}
}
Game.prototype.drawSheeps = function(){
	for(var i=0 ; i < this.sheeps.length ; i++){
		var img = document.getElementById('sheep')
		this.drawCircle(this.sheeps[i].x-25, this.sheeps[i].y-10, 5,'blue', null, img);
		this.objectMap[this.sheeps[i].position].occupied='sheep';
	}
}
Game.prototype.initializeEvents = function(){
	debugger;
	this.canvas.addEventListener('mousedown', mouseDownListener);

	var that = this;
	function mouseDownListener (event){
		//debugger;
		var bRect = that.canvas.getBoundingClientRect();
		var xCor = event.clientX- bRect.x;
		var yCor = event.clientY- bRect.y;
		for( var i = 0;i < that.temporary.length; i++ ){
			that.clearRectangle(that.temporary[i]);
		}
		that.temporary.length = 0;
		var objectFound = false;
		var dependentFound = false;
		if(that.whoseMove=='elephant'){
			for(var i=0;i<that.elephants.length;i++){
				if(checkForObject(that.elephants[i],xCor,yCor)){
					that.elephantToMove = true;
					var clickedObject = that.elephants[i];
					that.selectedObject = clickedObject;
					var depends = that.elephantValidPoints[clickedObject.position];
					var dependentsDrawn = [];

					for(var j = 0; j < depends.length - 1; j++){
						that.temporary.push(depends[j]);
						if( that.objectMap[depends[j].position].occupied == 'sheep'){
							var jumpLocation = depends[depends.length-1][depends[j].position];
							if( !jumpLocation){
								continue;
							}
							jumpLocation = jumpLocation[0];
							if(that.objectMap[jumpLocation.position].occupied != 'elephant' &&
							that.objectMap[jumpLocation.position].occupied != 'sheep'){
								dependentsDrawn.push(jumpLocation);
								that.drawRectangle(jumpLocation.x-5,jumpLocation.y-5,10,10,'red');
							}
						}else if( that.objectMap[depends[j].position].occupied != 'elephant'){
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
								debugger;
								// that.selectedObject.x = depend[position][0].x;
								// that.selectedObject.y = depend[position][0].y;
								that.selectedObject.position = depend[position][0].position;
								
								that.movableObject.x = depend[position][0].x;
								that.movableObject.y = depend[position][0].y;
								that.movableObject.position = depend[position][0].position;
								
								that.killSheep(position);
								dependentFound = true;
								that.elephantToMove = false;
								that.whoseMove = 'sheep';
								that.redrawGame();
								break;
							}	
						}
						break;
					}else{
						var index = that.dependentsDrawn.findIndex(function(item){
								if(item.x == depend.x && item.y == depend.y && item.position == depend.position){
									return true;
								}
								return false;
							});
						if(index == -1 ){
							continue;
						}
						if(checkForObject(that.dependents[i],xCor,yCor)){
							//Dependent clicked
							debugger;
							// that.selectedObject.x = that.dependents[i].x;
							// that.selectedObject.y = that.dependents[i].y;
							 that.selectedObject.position = that.dependents[i].position;
							that.movableObject.x = that.dependents[i].x;
							that.movableObject.y = that.dependents[i].y;
							that.movableObject.position = that.dependents[i].position;
							dependentFound = true;
							that.elephantToMove = false;
							that.whoseMove = 'sheep';
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
		}
		if( !that.sheepToMove && that.whoseMove == 'sheep' && that.sheepsLeft > 0){
			if(checkForSheeepsMove(that.sheepsArea,xCor,yCor)){
				//Sheeps collection clicked
				that.redrawGame();
				that.sheepToMove = true;
				that.drawSheepsCollection(true)
				debugger;
			}else{
				that.drawSheepsCollection(false);
			}
		}
		if(that.sheepToMove && !that.elephantToMove){
			debugger;
			for(var i=0 ; i < that.movablePoints.length ; i++ ){
				if(checkForObject(that.movablePoints[i],xCor,yCor)){

					var clickedObject = that.movablePoints[i];
					that.sheeps.push(Object.assign({},clickedObject));
					if(that.sheepsLeft)
						that.sheepsLeft--;
					that.whoseMove = 'elephant';
					that.sheepToMove = false;
					that.redrawGame();
					break;
				}
			}	
		}
		if( that.sheepsLeft == 0 && that.whoseMove == 'sheep'){
			debugger;
			var objectFound1 = false;
			for(var i=0 ; i < that.sheeps.length ; i++ ){
				if( checkForObject( that.sheeps[i],xCor,yCor ) ){

					var clickedObject = that.sheeps[i];
					var depends = that.sheepValidPoints[clickedObject.position];
					that.selectedObject = clickedObject;
					for(var j=0;j<depends.length;j++){
						console.log('creating object at('+depends[j].x+':'+depends[j].y+')');
						that.temporary.push(depends[j]);
						if(!that.objectMap[depends[j].position].occupied){
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
				debugger;
				for( var i=0;i<that.sheepDependents.length;i++){
					if(checkForObject(that.sheepDependents[i],xCor,yCor)){
						
						// that.selectedObject.x = that.sheepDependents[i].x;
						// that.selectedObject.y = that.sheepDependents[i].y;
						 that.selectedObject.position = that.sheepDependents[i].position;
						that.movableObject.x = that.sheepDependents[i].x;
						that.movableObject.y = that.sheepDependents[i].y;
						that.movableObject.position = that.sheepDependents[i].position;
					}
				}
				that.whoseMove='elephant';
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
Game.prototype.drawRectangle = function(x,y,width,height,color, img){
	this.canElement.beginPath();
	if( img ){
		this.canElement.drawImage(img,x,y,50,50);
	}else{
		this.canElement.fillStyle = color;
		this.canElement.fillRect( x, y, width, height);
		this.canElement.stroke();
		
	}
}
Game.prototype.drawText = function(x,y,text){
	this.canElement.beginPath();
	this.canElement.fillStyle = 'black';
	this.canElement.font="20px Georgia";
	this.canElement.fillText(text, x, y);
}
Game.prototype.drawCircle = function(x,y,radius, color, text1,img){
	this.canElement.beginPath();
	if(img){
		this.canElement.drawImage(img,x,y,40,40);
	}else{
	
		this.canElement.fillStyle = color;
		this.canElement.arc(x,y,radius,0,2*Math.PI);
		//this.canElement.stroke();
		this.canElement.fill();
		this.canElement.fillStyle = 'white';
		this.canElement.font="12px Georgia";
		if(text1 && text1 >= 10){
					this.canElement.fillText(text1, x-6, y+2);
		}else if(text1){
			
			this.canElement.fillText(text1, x-4, y+2);
		}
	}
}
Game.prototype.clearRectangle = function(shape){
	this.canElement.clearRect(shape.x, shape.y,shape.width,shape.height);
	//this.canElement.fillRect( shape.x, shape.y, 2, 2);
	this.canElement.stroke();
}
Game.prototype.createGame = function(){
	this.drawGame();
	this.drawElephants();
	this.drawSheepsCollection();
	this.drawKilledSheepsCollection();
	this.drawSheeps();
}
Game.prototype.drawSheepsCollection = function(highlight){
	var areaColor = 'green';
	if(highlight && this.sheepsArea){
		this.clearRectangle( this.sheepsArea);
		areaColor = 'yellow';
	}
	this.sheepsArea = {x:this.canvas.width*3/4,y:0,width:this.canvas.width/4,height:80};;
	this.drawRectangle(this.canvas.width*3/4,0,this.canvas.width/4,80,areaColor);
	this.drawText(this.sheepsArea.x+5,this.sheepsArea.height-5,'Remaining');
	var initialX = this.canvas.width*3/4+10;
	var initialY = 15;
	for(var i=0;i<this.sheepsLeft;i++){
		this.drawCircle(initialX, initialY, 8, 'black', i+1);
		initialX += 20;
		if(i==7){
			initialX = this.canvas.width*3/4+10;
			initialY = 45;
		}
	}
}
Game.prototype.drawKilledSheepsCollection = function(){
	var areaColor = 'lightblue';
	if( this.sheepsKilledArea && this.killedSheeps > 0){
		this.clearRectangle( this.sheepsKilledArea);
		areaColor = 'red';
	}else{
		this.sheepsKilledArea = {x:5,y:0,width:this.canvas.width/4,height:80};;
	}
	if(this.killedSheeps > 0){

		this.drawRectangle(this.sheepsKilledArea.x,this.sheepsKilledArea.y,this.sheepsKilledArea.width,
			this.sheepsKilledArea.height,areaColor);
		this.drawText(this.sheepsKilledArea.x+10 ,this.sheepsKilledArea.height-10,'Killed');
		var initialX = this.sheepsKilledArea.x+10;
		var initialY = 15;
		for(var i=0;i<this.killedSheeps;i++){
			this.drawCircle(initialX, initialY, 8, 'black', i+1);
			initialX += 20;
			if(i==7){
				initialX = this.canvas.width*3/4+10;
				initialY = 45;
			}
		}
	}
}
Game.prototype.redrawGame = function(){
	this.movablePoints.forEach(function(item){
		item.occupied = false;
	});
	this.drawGame(true);
	this.drawElephants();
	this.drawSheeps();
	var that = this;
	this.interval1 = setInterval( function(){
		that.moveObject();
	},1);
	this.drawSheepsCollection();
	this.drawKilledSheepsCollection();
}
Game.prototype.moveObject = function(interval){
	debugger;
	if(!this.selectedObject && !this.movableObject){
		
		clearInterval(this.interval1);
		return;
	}
	console.log('move objectx'+this.selectedObject.x+"-----move object y"+this.selectedObject.y+'----position'+this.selectedObject.position);
	if(this.selectedObject.x == this.movableObject.x && this.selectedObject.y == this.movableObject.y){
		this.movableObject = {};
		this.selectedObject = {};
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
	this.drawGame(true);
	this.drawElephants();
	this.drawSheeps();
	this.drawSheepsCollection();
	this.drawKilledSheepsCollection();
}
Game.prototype.killSheep = function( position ){
	var index = this.sheeps.findIndex(function(item){
		if(item.position == position){
			return true;
		}
		return false;
	});
	this.sheeps.splice(index,1);
	this.killedSheeps++;
	this.objectMap[position].occupied == null;
}

//document.addEventListener('load', function(e) {
	console.log('document loaded');
	/* var initializer = new GameInitializer(document.getElementById('initializer'));
	initializer.initialize(); */
	var gameView = new GameView( document.getElementById('elephantGame') ,document.getElementById('initializer'),
	document.getElementById('myModal'));
	var gameModel = new GameModel();
	var gameController = new GameController(gameView,gameModel);
	gameView.loadGame();
	//var game = new Game();
	//game.createGame();
	//game.initializeEvents();
//}, true);