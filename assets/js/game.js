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

//create the global variables

var wins = 0;
var losses = 0;

//add the player to thier appopriate part of the board
$("#addName").on("click", function () {
  //takes the name that the user inputed
  var name= $("#userName-input").val().trim();
  console.log(name);
  //erase the user's input
  $("#userName-input").val("");
  //push the name to the server
  var con = ref;
  con.set({
    name: name,
    wins:wins,
    losses:losses,
    move:"",
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
  con.onDisconnect().remove();
  //dont refresh the page
  return false;
})
database.ref().once("value", function(snapshot) {
  console.log("doing once function");
  if(snapshot.child("Players").exists()){
    if(snapshot.child("Players").child(player).exists()){
      $("#player1").text(snapshot.child("Players").child(player.toString()).name);
      console.log(snapshot.child("Players").child(player.toString()).name);

      player=2;
    }
    else{
      $("#player2").text(snapshot.child("Players").child(player.toString()).name);
      console.log(snapshot.child("Players").child(player.toString()).name);
      player=1;

      console.log(player);
  }
  }
  else{
    player=1;
    console.log(player);
  }
  ref= database.ref("Players/"+player.toString());
});

/*//this changes the values on the screen of the individual players
database.ref().on("child_added", function(snapshot) {
  console.log("number of children: "+snapshot.numChildren());
  if(snapshot.numChildren()==1)
  {

    }
  //console.log(snapshot.val());
  person=snapshot.val();
  console.log(person);
  personName=person.name;
  console.log(personName);
  //personName=snapshot.child("name").exist();
  //console.log(personName);
  //console.log(person.name);
    //console.log(playerObject.PLayers.name);
  snapshot.forEach(function(childSnapshot) {
      //this gets the key for each child
      var key = childSnapshot.key;
      console.log("Child Key: "+key);
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      console.log("Child data: ")
      console.log(childData.name );
  });
});*/