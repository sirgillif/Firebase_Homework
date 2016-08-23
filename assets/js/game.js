/*
  Need to find out how the .numChildren() works 
  
 hereditaria
  Game flow
  --Go to site
  --entername and hit submit
  --wait for second player to do the same (If you are the first)
  --on turn select word 
    -the player who made the word should see thiers but not their opponents
  --once each player has made their word
    -display moves
    -increment wins and losses (no limit to how long any two players can play)
  -- if a player leaves show disconnect log in the chat

  Seperate From Game
  --chat
    -text box that stores conversation in firebase
    -maybe delete on no players

    To Do
   -------
   -Chat Box Functionality
   -make moves (change color to green when moves are made)
   -record wins/losses
   display information in middle tile
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
var word="none";
var otherPlayerMove=" ";
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
    word:word,
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

var onComplete = function(value) {
    //clear the game if your in a game( or not it should be clearednow)
    $("#choices"+player).empty();
    $("#choices"+changePlayer(player)).empty();
    $("#winLoss"+player).empty();
    $("#winLoss"+changePlayer(player)).empty();
  if (player==1) {
    // this will go to the chat box eventially
    console.log(name+" has disconnected");
  }
  else if(player==2) {
    // this will go to the chat box eventially
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
    console.log(playerValues);
    if((playerValues.word=="none")&&(snapshot.child("Players/"+changePlayer(player)).val().word=="none")){ 
      //start the game
      //turn=1;
      //add the coices for the individual (only display to them)
      addchoices();
      //display the current wins/losses for each player
      playerValues=snapshot.child("Players/"+changePlayer(player)).val();
      updateWinLoss(playerValues);
      //change the player's border's color to yellow
      $("#player"+player).parent().removeClass("green").addClass("yellow");
      $("#player"+changePlayer(player)).parent().removeClass("green").addClass("yellow");
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
  //this should only run if the game is going on i.e. 2 players
  if(snapshot.numChildren()==2)
  {
    var playerValues=snapshot.child("Players/"+changePlayer(player)).val()
    //determin if anyone has made a move
    if(playerValues.word!="none"){
      
      $("#player"+changePlayer(player)).parent().removeClass("yellow").addClass("green");
      otherPlayerMove=playerValues;
      console.log(otherPlayerMove)
    }
    else if(word!="none"){
      $("#player"+player).parent().removeClass("yellow").addClass("green");
    }
    if(snapshot.child("Players/"+player).val().word!="none"&&(playerValues.word!="none")){
      rps(word,otherPlayerMove);

    }
    //.removeClass("intro").addClass("main");

  }
});

//This on click function will be how each player logs their move
$(document).on("click",".option",function(){

  console.log($(this).text());
})

/*alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"*/

function rps(word,otherPlayer){
   var otherplayerNum=changePlayer(player)
  if(word=="rock"){
    if(otherPlayer.word=="scissors"){
      var otherLosses=otherPlayer.losses+1;
      database.ref("Players").set({
        player:{
          name: name,
          wins:++wins,
          losses:losses,
          word:"nonenone",
        },
        otherplayerNum:{
          name: otherPlayer.name,
          wins: otherPlayer.wins,
          losses:otherLosses,
          word:"none",
        },
      }) 
    }
    else{
      var otherwins= otherPlayer.wins+1;
      database.ref("Players").set({
          player:{
          name: name,
          wins:++wins,
          losses:losses,
          word:" ",
        },
        otherplayerNum:{
          name: otherPlayer.name,
          wins: otherwins,
          losses:otherPlayer.losses,
          word:" ",
        }
      });
    }
  }
  else if(word=="paper"){
    if(otherPlayerMove=="rock"){
     var otherLosses=otherPlayer.losses+1
      database.ref("Players").set({
        player:{
          name: name,
          wins:++wins,
          losses:losses,
          word:"none",
        },
       otherplayerNum:{
          name: otherPlayer.name,
          wins: otherPlayer.wins,
          losses:otherLosses,
          word:"none",
        },
      }) 
    }
    else{
      var otherwins= otherPlayer.wins+1;
      database.ref("Players").set({
          player:{
          name: name,
          wins:++wins,
          losses:losses,
          word:"none",
        },
        otherplayerNum:{
          name: otherPlayer.name,
          wins: otherwins,
          losses:otherPlayer.losses,
          word:"none",
        }
      });
    }
  }
  else{
    if(otherPlayerMove=="paper"){
     var otherLosses=otherPlayer.losses+1
      database.ref("Players").set({
        player:{
          name: name,
          wins:++wins,
          losses:losses,
          word:"none",
        },
        otherplayerNum:{
          name: otherPlayer.name,
          wins: otherPlayer.wins,
          losses:otherLosses,
          word:" ",
        },
      }) 
    }
    else{
      var otherwins= otherPlayer.wins+1;
      database.ref("Players").set({
          player:{
          name: name,
          wins:++wins,
          losses:losses,
          word:"none",
        },
        otherplayerNum:{
          name: otherPlayer.name,
          wins: otherwins,
          losses:otherPlayer.losses,
          word:"none",
        }
      });
    }
  }
}