function GameHeader(domElem, userName,elephantName, sheepName, oppName){
	this.domElem = domElem;
	this.user = userName;
	this.elephant = elephantName;
	this.sheep = sheepName;
	this.opponent = oppName;
	this.checkForCookies();
	this.playerSelected = null;
}
GameHeader.prototype.checkForCookies = function(){
	if( this.checkCookie( 'gName' ) ){
			this.user.name = this.checkCookie('gName');
	}
	if( this.checkCookie('elephant') ){
		this.elephant.name = this.checkCookie('elephant');
	}
	if( this.checkCookie('sheep') ){
		this.sheep.name = this.checkCookie('sheep');
	}
	if( this.checkCookie( 'oppName' ) ){
		this.opponent.name = this.checkCookie('oppName');
	}
}
GameHeader.prototype.render = function(gameData){
	//debugger;
	$(this.domElem).empty();
	var elem = $('<span>')
	if(this.user.name && this.user.name == this.elephant.name){
		elem.appendTo($(this.domElem));
		elem.append("<h1 style='float:left;margin-top: 8px;'>Hi </h1><span> "+this.user.name+",</span>");
		elem.append("<span> Your player : <img src='res/img/Elephant_Archigraphs.png' height=35 width=35/></span>");
		if(this.opponent.name){
			elem.append("<span> Your Oppenent : <img src='res/img/BritishSheep_Archigraphs1.png' height=35 width=35/>"+this.opponent.name+"</span>");
		}
		this.checkForProgress();
	}else if(this.user.name && this.user.name == this.sheep.name){
		elem.appendTo( $(this.domElem) );
		elem.append("<h1 style='float:left;margin-top: 8px;'>Hi </h1><span> "+this.user.name+",</span>");
		elem.append("<span> Your player : <img src='res/img/BritishSheep_Archigraphs1.png' height=35 width=35/></span>");
		elem.append("<span> Your Opponent : <img src='res/img/Elephant_Archigraphs.png' height=35 width=35/>"+this.opponent.name+"</span>");
		//elem.append( "<h1>Hi </h1><span>"+this.user.name+"</span>" );
		//elem.append("<span>You have selected<img src='res/img/BritishSheep_Archigraphs1.png' height=35 width=35/></span>");
		this.checkForProgress();
	}else{
		var elem = document.createElement("img");
		elem.setAttribute('id','pickElephant');
		elem.setAttribute('src','res/img/Elephant_Archigraphs.png');
		elem.setAttribute('width','35');
		elem.setAttribute('height','35');
		elem.onclick = this.selectElephant.bind(this);
		this.domElem.appendChild(elem);
		
		elem = document.createElement("img");
		elem.setAttribute('id','pickSheep');
		elem.setAttribute('src','res/img/BritishSheep_Archigraphs1.png');
		elem.setAttribute('width','35');
		elem.onclick = this.selectSheep.bind(this);
		elem.setAttribute('height','35');
		this.domElem.appendChild(elem);
	}
}

GameHeader.prototype.selectElephant = function( event ){

	var modal = document.getElementById('myModal');
	modal.style.display = 'block';
	var option = new GameOption();
	var i = option.getGameOption(),
	that = this;

	$('#myModal').append($(i));
	$('#myModal').find('button').on('click', function(){
		debugger;
		var gOption = document.querySelector('input[name="gameOption"]:checked').value;
		var gName = document.querySelector('.yourName').value;
		that.user.name = gName;
		that.checkCookie('gName', gName );
		that.checkCookie('elephant', gName );
		that.elephant.name = gName;
		that.playerSelected( { name:gName, gOption:gOption ,isElephant:true });
		modal.style.display = 'none';
	});
}

GameHeader.prototype.selectSheep = function( event ){
	var modal = document.getElementById('myModal');
	modal.style.display = 'block';

	var option = new GameOption();
	var i = option.getGameOption(),
	that = this;

	$('#myModal').append($(i));
	$('#myModal').find('button').on('click', function(){
		debugger;
		var gOption = document.querySelector('input[name="gameOption"]:checked').value;
		var gName = document.querySelector('.yourName').value;
		that.user.name = gName;
		that.checkCookie('gName', gName);
		that.checkCookie('sheep', gName );
		that.sheep.name = gName;
		that.playerSelected( { name:gName, gOption:gOption ,isElephant:false});
		$('#myModal').empty();
		modal.style.display = 'none';
	});
}
GameHeader.prototype.setCookie = function(cname,cvalue,exdays) {
    var d = new Date();
    d.setYear(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
GameHeader.prototype.removeCookie = function(cname) {
    var d = new Date("");
    d.setYear(1988);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + "" + ";" + expires + ";path=/";
}

GameHeader.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

GameHeader.prototype.checkCookie = function ( name, value ) {
    var user=this.getCookie( name );
    if (user != "") {
		return user;
    } else {
       if (value != "" && value != null) {
           this.setCookie(name, value, 30);
       }
	   return false;
    }
}
GameHeader.prototype.checkForProgress = function(){
	if( this.checkCookie("waiting") ){
		$(this.domElem).append("<span>Waiting for opponent to join <img src='res/img/loading.gif' width=25 height=25/></span>");
	}
}

GameHeader.prototype.waitForMatch = function(){
	this.setCookie("waiting", true,30);
	this.render();
		
}
GameHeader.prototype.startNew = function(){
	this.removeCookie('gName');
	this.removeCookie('elephant');
	this.removeCookie('oppName');
	this.removeCookie('sheep');
	this.removeCookie('waiting');
	this.user.name = undefined;
	this.sheep.name = undefined;
	this.elephant.name = undefined;
	this.opponent.name = undefined;
	this.render();
}