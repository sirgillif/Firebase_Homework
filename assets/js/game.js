  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDNzQ2eOs4p0YZuNyUVJ53V5PPW6ErcckQ",
    authDomain: "rpsgame-1b0f2.firebaseapp.com",
    databaseURL: "https://rpsgame-1b0f2.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
	var database = firebase.database();