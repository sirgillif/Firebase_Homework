/*
  Need to find out how the .numChildren() works 
  
 hereditaria
  Game flow
  --Go to site
  --entername and hit submit
  --wait for second player to do the same (If you are the first)
  --on turn select move 
    -the player who made the move should see thiers but not their opponents
  --once each player has made their move
    -display moves
    -increment wins and losses (no limit to how long any two players can play)
  -- if a player leaves show disconnect log in the chat

  Seperate From Game
  --chat
    -text box that stores conversation in firebase
    -maybe delete on no players
*/


// Initialize Firebase
var config = {
  apiKey: "AIzaSyDNzQ2eOs4p0YZuNyUVJ53V5PPW6ErcckQ",
  authDomain: "rpsgame-1b0f2.firebaseapp.com",
  databaseURL: "https://rpsgame-1b0f2.firebaseio.com",
  storageBucket: "rpsgame-1b0f2.appspot.com",
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();
var player = 1;
//create a sub header for the players
var ref;
var chatRef;
//create the global variables
var name="";
var wins = 0;
var losses = 0;
var move="";
var otherPlayerMove="";
var turn=1;
//add the player to thier appopriate part of the board
$("#addName").on("click", function () {
  $("#addName").hide();
  $("#userName-input").hide();
  //takes the name that the user inputed
  name= $("#userName-input").val().trim();
  //console.log(name);
  //erase the user's input
  $("#userName-input").val("");
  //push the name to the server
  //along with the other initial information
  var con = ref;
  con.set({
    name: name,
    wins:wins,
    losses:losses,
    move:move,
  });
 
  if (player==1) {
    $("#player1").text(name);
    $("#player1").append;
  }
  if(player==2) {
    $("#player2").text(name);
    $("#player2").append;
  }

  //when the person leaves the site remove them
  con.onDisconnect(onComplete).remove();
  //dont refresh the page
  return false;
})

var onComplete = function(error) {
    //clear the game if your in a game( or not it should be clearednow)
    $("#choices"+player).empty();
    $("#choices"+changePlayer(player)).empty();
    $("#winLoss"+player).empty();
    $("#winLoss"+changePlayer(player)).empty();
  if (player==1) {
    console.log(name+" has disconnected");
  }
  else if(player==2) {
    console.log(name+" has disconnected");
  }
};
//changeing the state of the player form one to two 
//to keep and accurare log of who's who;
function changePlayer(player){
  if(player==1)
  {
    return 2;
  }
  else{
    return 1;
  }
}
//this links the databast to the function PLayer handlerS
database.ref().on("value",PlayerHandler);
//this function will be called anytime a value is changed for the players branch
//this function shoudl handle writing the players names to the appropriate box
function PlayerHandler(snapshot) {
  //creat a variable to extract values from 
   //console.log("going into ref('Players').on function as "+player);
  //if a player exists we need to verify who the person on the screen is
  //console.log(snapshot.child("Players").exists());
  if(snapshot.child("Players").exists()){
    //IF a player exists with the player number you have
    //console.log(snapshot.child("Players/"+player).exists());
    if(snapshot.child("Players/"+player).exists()){
      var playerValues=snapshot.child("Players/"+player).val();
      //console.log(playerValues);
      //if your name doent match thier name
     //snapshot.child("Players/"+player).name;
      if(playerValues.name!=name)
      {
        //write thier name on the board
        $("#player"+player).text(playerValues.name);
        //console.log(playerValues.name);
        //change your player number
        player=changePlayer(player);
      }
      //otherwise check if another player exists
      else if(snapshot.child("Players/"+changePlayer(player)).exists())
      {
        playerValues=snapshot.child("Players/"+changePlayer(player)).val();
        //if yes then we write their name to the board
        $("#player"+changePlayer(player)).text(playerValues.name);
        //console.log(playerValues.name);
      }
      //if no one exists rewrite the origional message for that person
      else{
        $("#player"+changePlayer(player)).text("Waiting for Player "+changePlayer(player));
        //console.log("Waiting for Player "+changePlayer(player));
      }
    }

  }
  else{
    //if no players exist then you are player 1
    player=1;
    $("#player"+player).text("Waiting for Player "+player);
    //console.log("Waiting for Player "+player);
  }
  //console.log(player);
  //add a reference of who you are to write info to
  ref= database.ref("Players/"+player);
  //.toString()
  //check the number of children to if there are 2 players
  console.log("number of children: "+snapshot.child("Players").numChildren());
  console.log(snapshot.child("Players").val())
  if(snapshot.child("Players").numChildren()==2)
  { 
    console.log("we now have 2 children");
    playerValues=snapshot.child("Players/"+changePlayer(player)).val()
    if((playerValues.move=="")&&(snapshot.child("Players/"+changePlayer(player)).val().move=="")){ 
      //start the game
      turn=1;
      //add the coices for the individual (only display to them)
      addchoices();
      //display the current wins/losses for each player
      playerValues=snapshot.child("Players/"+changePlayer(player)).val();
      updateWinLoss(playerValues);
      //change the player's border's color to yellow
      $("#player"+player).parent().addClass("yellow");
      $("#player"+changePlayer(player)).parent().addClass("yellow");
    }
  }
};

//"winLoss1"
//sets the win and loss count for each of the players
function updateWinLoss(otherPlayer) {
  $("#winLoss"+player).append($("<h5/>").text("Wins: "+wins+" Losses: "+losses)); 
  $("#winLoss"+changePlayer(player)).append($("<h5/>").text("Wins: "+otherPlayer.wins+" Losses: "+otherPlayer.losses)); 

}

function addchoices(){
  var choices=$("<div/>");
  choices.append($("<h4/>").addClass("option").text("Rock"));
  choices.append($("<h4/>").addClass("option").text("Paper"));
  choices.append($("<h4/>").addClass("option").text("Scissors"));
  $("#choices"+player).append(choices);
}

//this changes the values on the screen of the individual players
//this method should run after a child element has been edited
database.ref().on("child_changed", function(snapshot) {
  //console.log("number of children: "+snapshot.numChildren());
  //console.log(snapshot.val())
  //console.log(snapshot.child("Players").val())
  if(snapshot.numChildren()==2)
  {
    console.log("off for temp");
    //.removeClass("intro").addClass("main");

  }
});

$(document).on("click",".option",function(){

  console.log(this.val());
})