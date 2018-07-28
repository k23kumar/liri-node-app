require("dotenv").config();

var fs = require("fs");

var request = require("request");

var keys = require("./keys.js");

var Twitter = require('twitter');

var Spotify = require("node-spotify-api");
 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);



var command = process.argv[2];
var searchQuery = process.argv.slice(3).join(" ");

if (!searchQuery && command === 'movie-this') {
    searchQuery = "Mr. Nobody";
};

if (!searchQuery && command === 'spotify-this-song') {
    searchQuery = "The Sign";
};

doCommand();

function doCommand() {

if (command === "spotify-this-song") {
    displaySong();
}

else if (command === "my-tweets") {
    displayTweets();
}

else if (command === "movie-this") {
    displayMovie();
}

else if (command === "do-what-it-says") {
    
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        command = dataArr[0];
        searchQuery = dataArr[1];
        doCommand();
      
      });
      
}
}

function displayTweets() {

    var params = {screen_name: "k23kumar", count: '20'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
        // console.log(tweets.length);
        for (tweet of tweets) {
            console.log(tweet.text);
            console.log(tweet.created_at);
        }
    }
    });
};

function displaySong() {

    spotify.search({ type: 'track', query: searchQuery }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
    //   console.log(data.tracks.items[0]);
        var track = data.tracks.items[0];
        console.log("Song name: " + track.name);
        console.log("Album name: " + track.album.name);
        console.log("Artist(s) name: " + track.artists.map(artistObject => artistObject.name).join(", "));
        console.log("Song preview: " + track.preview_url);
      });
};

function displayMovie() {
    var queryUrl = "http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=trilogy";
    
    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("Title:", movie.Title);
            console.log("Year:", movie.Released);
            console.log("Actors:", movie.Actors);
            console.log("Country:", movie.Country);
            console.log("Language:", movie.Language);
            console.log("Plot:", movie.Plot);
            console.log("IMDB:", movie.imdbRating);
            // console.log("Rotten Tomatoes:", movie.Ratings.find(element => element.Source === "Rotten Tomatoes").Value);
            console.log("Rotten Tomatoes:", movie.Ratings[1].Value)
            // console.log(movie.Ratings)
        }

      });
      
}
