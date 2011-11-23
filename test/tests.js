
// documentation on writing tests here: http://docs.jquery.com/QUnit
// example tests: https://github.com/jquery/qunit/blob/master/test/same.js

// below are some general tests but feel free to delete them.

module("example tests");
test("HTML5 Boilerplate is sweet",function(){
  expect(1);
  equals("boilerplate".replace("boilerplate","sweet"),"sweet","Yes. HTML5 Boilerplate is, in fact, sweet");
  
})

// these test things from plugins.js
test("Environment is good",function(){
  expect(3);
  ok( !!window.log, "log function present");
  
  var history = log.history && log.history.length || 0;
  log("logging from the test suite.")
  equals( log.history.length - history, 1, "log history keeps track" )
  
  ok( !!window.Modernizr, "Modernizr global is present")
})

test("Create New GoFishGame", function(){
	ok(window.GoFishGameController, "GoFishGameController is present")
	window.GoFishGameController.init();
	equals(window.GoFishGameController.game.players.length,2,"there are two players");
	equals(window.GoFishGameController.game.players[0].cards.length,7,"player 1 has 7 cards");
	equals(window.GoFishGameController.game.players[0].cards.length,7,"player 2 has 7 cards");
	equals(window.GoFishGameController.game.players[0].fishFor({"suit":"1","value":"1"}),0,"checking for fished card");
	window.GoFishGameController.game.players[0].drawCard({"value":13,"suit":1});
	window.GoFishGameController.game.players[0].drawCard({"value":13,"suit":2});
	window.GoFishGameController.game.players[0].drawCard({"value":13,"suit":4});
	ok(window.GoFishGameController.game.players[0].checkForBooks(),"are there any books?");
	window.GoFishGameController.game.players[0].removeCardFromHand({"value":13,"suit":3});
	ok(!window.GoFishGameController.game.players[0].checkForBooks(),"are there any books?");
	ok(window.GoFishGameController.game.players[0].gotCard({"value":13,"suit":1}),"Does the player have this card?");
	
})

