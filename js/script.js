/* Author: 

*/

window.GoFishGameController = function($){
	var gfgame = {};
	gfgame.init = function(){
		log('GoFishGameController.init called');
		gfgame.game = new GoFishGame(GoFishGameController);
		gfgame.game.startGame('Jack');
		gfgame.game.deal();
		//build some UI
		$('body').append('<div id="GoFishGame"></div>');
		$('#GoFishGame').append('<div id="Player1"></div>');
		$('#GoFishGame').append('<div id="player1_message"></div>');
		$('#GoFishGame').append('<div id="deck"></div>');
		$('#GoFishGame').append('<div id="Player2"></div>');
		$('#GoFishGame').append('<div id="player2_message"></div>');
		for(var i=0; i < gfgame.game.players.length; i++){
			j=i+1;
			$('#Player'+j).append('<div id="player'+j+'_name">'+gfgame.game.players[i].name+'</div>');		
			$('#Player'+j).append('<div id="player'+j+'_score">'+gfgame.game.players[i].score+'</div>');		
			$('#Player'+j).append('<div id="player'+j+'_hand" class="hand"></div>');
		}
		
		$('#deck').text(gfgame.game.deck.cardsRemaining());
		gfgame.updatePlayerHand(0);
		gfgame.updatePlayerHand(1);
		
		$('#player1_message').text("Your Turn");
		
		
		$('.card').live('click',function(){
			//log($(this).attr('id')+'-clicked');
			//log($(this).attr('id').replace('card_',''));
			gfgame.game.playRoundWithRequest($(this).attr('id').replace('card_',''),GoFishGameController.roundComplete);
			//update both hands onscreen
			gfgame.updatePlayerHand(0);
			gfgame.updatePlayerHand(1);
			//now give Ollie a turn, but delay it a second
			setTimeout('GoFishGameController.game.playRoundWithRequest(0,GoFishGameController.roundComplete)'
						,1000);
			

			
			$('#deck').text(gfgame.game.deck.cardsRemaining());
			
			
		});
	};
	gfgame.roundComplete = function(player){
		//$('#player1_message').text('');
		//$('#player2_message').text('');
		if(player==1){
			$('#player1_message').append("Your Turn");
		}else{
			$('#player2_message').append("Ollie's Turn");
		}
	};
	gfgame.gameEvent = function(whatHappend){
		log('****GameEvent - '+whatHappend);
		//update both hands onscreen
		gfgame.updatePlayerHand(0);
		gfgame.updatePlayerHand(1);
	};
	gfgame.goFishEvent = function(player) {
		if(player==0){
			$('#player1_message').append("Go Fish!");
		}else{
			$('#player2_message').append("Go Fish!");
		}
	};
	gfgame.goFishResultEvent = function(player,newCard) {
		
	};
	gfgame.requestCardEvent = function(player,requestedCard) {
		
	};
	gfgame.requestResultEvent = function(player,fishForResult) {
		
	};
	gfgame.updatePlayerHand = function(player){
		//log('updating '+gfgame.game.players[player].name+'s hand');
		$('#player'+(player+1)+'_hand').html(''); //clear it out
		
		var hand = [];
		for(var i=0;i<gfgame.game.players[player].cards.length;i++){
			hand.push(gfgame.game.players[player].cards[i].value);
		}

		hand = gfgame.game.players[player].organizeHand();


		for (var card in hand) {
			$('#player'+(player+1)+'_hand').append('<div onclick="" class="card up" id="card_'+card+'">'+card+'-'+hand[card]+'</div>');
		};
		
		gfgame.game.players[player].checkForBooks();
		$('#player'+(player+1)+'_score').text(gfgame.game.players[player].score);
		
		if(gfgame.game.isEndOfGame()){
			log('game over!!');
		}
	}
	return gfgame;
}(jQuery);

window.onload = function(){
	window.GoFishGameController.init();
};

window.Utility = function(){
	var gfutil = {};
	gfutil.randomizeArray = function(arr)
	 {
		var reorderedArray = new Array();
		if(arr!=null && arr.length>0)
		{
	    	var iRandomIndexes = gfutil.createRandomIndexes(arr.length);

	    	for (var i = 0; i < arr.length; i++)
	    	{
	        	reorderedArray[i] = arr[iRandomIndexes[i]];
	    	}
		}
		return reorderedArray;
	}
	
	// Return an random array of index integers for an array of the given size.
	//   ex: createRandomIndexes(5) might return [3,4,0,2,1]
	gfutil.createRandomIndexes = function(arraySize) {

	    var randomIndexes = new Array();

	    for (var i = 0; i < arraySize; i++)
	    {
	        // Find a new random integer between 0 and arraySize-1
	        // that isn't already in the randomIndexes array	
	        var newIndexFound = false;
	        while (!newIndexFound)
	        {
	            var index = Math.floor(Math.random() * arraySize);
	            if (!gfutil.arrayContains(randomIndexes, index))
	            {
	                newIndexFound = true;
	            }
	        }

	        randomIndexes[i] = index;
	    }

	    return randomIndexes;
	}

	// Returns true if given array contains the given object
	gfutil.arrayContains = function(arr, obj)
	 {
	    var result = false;
	    for (var i = 0; i < arr.length; i++) {
	        if (arr[i] == obj) {
	            result = true;
	            break;
	        }
	    }
	    return result;
	}
	
	return gfutil;
}();

function GoFishGame(controller){
	this.controller = controller;
	this.players = [];
	this.deck = [];
	this.whoseTurn = 0;
	this.turn = 0;
	this.startGame = function(name){
		log('starting game');
		this.players.push(new Player(name,true));
		this.players.push(new Player('ollie',false));
		this.deck = new Deck();
		this.deck.init();
		this.deck.shuffle();
		//log(this.deck.cardsRemaining());
	};
	this.deal = function(){
		log('dealing');
		for(var i=0;i<7;i++){
			this.players[0].cards.push(this.deck.draw());
			this.players[1].cards.push(this.deck.draw());
		}
		//log('finished dealing');
	};
	this.isEndOfGame = function(){
		if (this.deck.cardsRemaining == 0 || this.players[0].cards.length == 0 || this.players[1].cards.length == 0) {
			return true;
		}else {
			return false;
		}
	};
	this.playRoundWithRequest = function(requestedCard, callback){
		if (!this.isEndOfGame()) {
			//play the game

			var whoseTurn = this.turn%2;
			var otherPlayer = (this.turn+1)%2;

	        // if the CardRequested was 0, then this was from the AI 
			if (requestedCard == 0) {
				requestedCard = this.players[whoseTurn].randomCardChoice();
			}
			
			this.controller.requestCardEvent(whoseTurn,requestedCard);
			var fishForResult = this.players[otherPlayer].fishFor(requestedCard);
			
			if(fishForResult == 0)
			{
				this.controller.goFishEvent(whoseTurn);
				if(whoseTurn==1){
					//ollie can go ahead and fish
					this.goFish();
				}else{
					return true;
				}
			}else {
				this.controller.requestResultEvent(whoseTurn,fishForResult);
				//remove cards from other player
				this.players[otherPlayer].removeCardsFromHand(requestedCard);
				//add all the cards to the current player
				for(var i=1;i<=fishForResult;i++){
					this.players[whoseTurn].drawCard(new Card(requestedCard,0));
				}
				this.players[whoseTurn].checkForBooks();
			
				this.controller.gameEvent("Next Player's Turn");

				this.turn += 1;	
			}
		}else{
	        //game over
			this.controller.gameEvent("Game Over");
	    }
	
		callback(whoseTurn);
	};
	this.goFish = function(){
		
		var whoseTurn = this.turn%2;
		var otherPlayer = (this.turn+1)%2;
		
		if (this.deck.cardsRemaining() > 0) {
			var newCard = this.deck.draw();
			this.players[whoseTurn].drawCard(newCard);
			
			if(whoseTurn==0){
				//don't show Ollie's cards
				this.controller.goFishResultEvent(whoseTurn,newCard.value);
			}
			this.players[whoseTurn].checkForBooks();
			this.controller.gameEvent("Next Player's Turn");

			this.turn += 1;					
		}	
	};
	this.fishForWithFishPlayer = function(fishPlayer,fishFromPlayer,cardFished)
	{
		var result = 0;

		//result = [[self.players objectAtIndex:fishFromPlayer] fishFor:cardFished];

		//need to add ai here for the computer to remember what cards were asked for

		return result;
	};
	
	this.resetGame = function(){
		
	}
};

function Player(name,isHuman){
	this.name = name;
	this.isAI = !isHuman;
	this.score = 0;
	this.cards = [];
	this.books = [];
	this.fishFor = function(cardFishedFor)
	{	
		var cardCount = 0;
		for(var i=0;i<this.cards.length;i++){
			if(this.cards[i].value == cardFishedFor){
				cardCount++;
			}
		}
		return cardCount;
	}

	this.cardsRemaining = function()
	{
		return this.cards.length;
	}
	
	this.randomCardChoice = function(){
		var hand = [];
		for(var i=0;i<this.cards.length;i++){
			hand.push(this.cards[i].value);
		}
		hand = Utility.randomizeArray(hand);
		//log(hand[0]);
		return hand[0];
	}
	
	this.checkForBooks = function(){
		var bookExists = false;
	
		var hand = this.organizeHand();
		
		for (var val in hand){
			if(hand[val]>3){
				bookExists = true;
				log(this.name+' got a book of '+val);
				this.removeCardsFromHand(val);
				this.score++;
			}
		}
		return bookExists;
	};
	
	this.organizeHand = function(){
		var hand = [];
		for(var i=0;i<this.cards.length;i++){
			hand.push(this.cards[i].value);
		}
		
		var b = {}; 
		i = hand.length;
		var j;
		
		while( i-- ) {
			j = b[hand[i]];
			b[hand[i]] = j ? j+1 : 1;
		}
		return b;
	}
	
	this.removeCardsFromHand = function(cardToRemove){
		//log('removing '+cardToRemove);
		for(var i=0;i< this.cards.length;i++){
			if(this.cards[i].value == cardToRemove){
				this.cards.splice(i,1);
				this.removeCardsFromHand(cardToRemove);
			}
		}
		
		//log(this.cards);
	};
	
	
	this.drawCard = function(cardToDraw){
		this.cards.push(cardToDraw);
	}
	
}

function Card(value, suit){
	this.value = value;
	this.suit = suit;
	this.id = suit+'|'+value;
}

function Deck(){
	this.cards = [];
	this.init = function(){
		for(var suit = 0; suit <= 3; suit++) {
			for(var value = 1; value <= 13; value++) {
				card = new Card(value, suit);
				this.cards.push(card);
			}
		}	
	};
	this.shuffle = function(){
		this.cards = Utility.randomizeArray(this.cards);
	};
	this.draw = function(){
		return this.cards.pop();
	};
	this.cardsRemaining = function(){
		return this.cards.length;
	};
}










