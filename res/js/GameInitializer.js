function GameInitializer(blockElem){
	this.domElem = blockElem;
}
GameInitializer.prototype.initialize = function(){
	//debugger;
	var elem = document.createElement("img");
	elem.setAttribute('id','pickElephant');
	elem.setAttribute('src','res/img/Elephant_Archigraphs.png');
	elem.setAttribute('width','35');
	elem.setAttribute('height','35');
	this.domElem.appendChild(elem);
	
	elem = document.createElement("img");
	elem.setAttribute('id','pickSheep');
	elem.setAttribute('src','res/img/BritishSheep_Archigraphs1.png');
	elem.setAttribute('width','35');
	elem.setAttribute('height','35');
	this.domElem.appendChild(elem);
	
	this.domElem.appendChild(elem);
}