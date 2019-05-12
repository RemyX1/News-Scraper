var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 4000;


var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/blogNews", { useNewUrlParser: true });


app.get("/scraper", function(req, res) {
  // function(req, res) {
  console.log("/scraper route")
  // First, we grab the body of the html with axios
  axios.get("https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)  
        .children("a")
       .attr("href")
      result.link = $(this)  
        .children("a")
        .attr("href");


      db.News.create(result)
        .then(function(dbNews) {
          // View the added result in the console
          console.log("is this it?",dbNews);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});



// Route for getting all Articles from the db //////
app.get("/news", function(req, res) {
  // Grab every document in the Articles collection
  db.News.find({})
    .then(function(dbNews) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});





// Route for grabbing a specific Article by id, populate it with it's note
app.get("/news/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.News.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbNews) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});




// Route for saving/updating an Article's associated Note
app.post("/news", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.News.create(result)
        .then(function(dbNews) {
          // View the added result in the console
          console.log("Here is 1",dbNews);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });



// Route for saving/updating an Article's associated Note
app.post("/news/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.News.create(req.body)
    .then(function(dbNews) {
     
      return db.News.findOneAndUpdate({ _id: req.params.id }, { note: dbNews._id }, { new: true });
    })
    .then(function(dbNews) {
      
      res.json(dbNews);
    })
    .catch(function(err) {
     
      res.json(err);
    });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
