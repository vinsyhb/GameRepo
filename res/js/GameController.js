function GameController(gameView, gameModel){
	this.gameView = gameView;
	this.gameModel = gameModel;
	this.initialize();
}

GameController.prototype.initialize = function(){
	this.gameView.loadGame = this.getInitiaGameData.bind(this);
	this.gameView.saveGameOptions = this.saveGameOptions.bind(this);
	//this.gameView.getMatch = this.getMatch.bind(this);
	this.gameView.getGameData = this.getGameData.bind(this);
	this.gameView.updateMove = this.updateMove.bind(this);
}

GameController.prototype.getInitiaGameData = function(canvasWidth,canvasHeight){
	var data = this.gameModel.getInitialGameData( this.gameView.getDimensions().width,this.gameView.getDimensions().height );
	
	this.gameView.render(data);
}

GameController.prototype.saveGameOptions = function( data, callback ){
	debugger;
	this.gameModel.saveGameOptions(data, function(){
		console.log('options saved')
		callback();
	});
}

GameController.prototype.getGameData = function(user,opponent,gameInProgress, callback){
	debugger;
	this.gameModel.getGameData(user,opponent, gameInProgress, callback);
}
GameController.prototype.updateMove = function(gameData, elephant, sheep){
	this.gameModel.updateMove(gameData, elephant, sheep);
}