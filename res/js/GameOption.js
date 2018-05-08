function GameOption(){

}
GameOption.prototype.getGameOption = function(){
	return content = '<div style="width:25%" class="modal-content">'+
		'<div style="display:none" class="modal-header">'+
		  '<span class="close">&times;</span>'+
		  '<h2>Modal Header</h2>'+
		'</div>'+
		'<div class="modal-body">'+
		  '<p>Enter your name</p><input class="yourName" type="text" placeholder="Your name...">'+
		  '<p>Select Game Option...</p>'+
		  '<form action="">'+
			  '<input type="radio" name="gameOption" value="singlePlayer"> Single Player<br>'+
			  '<input type="radio" name="gameOption" value="multiPlayer1"> Multi player in same machine<br>'+
			  '<input type="radio" name="gameOption" value="multiPlayer2"> Multi player in different machine'+
		  '</form>'+
		'</div><div style="margin:10px;"><button>Select</button><div>'+
		'<div style="display:none" class="modal-footer">'+
		  '<h3>Modal Footer</h3>'+
		'</div>'+
	  '</div>'
}