// Dependencies
var express = require("express");
// var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Scraping tools 
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");

// Require our models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/yogaJournal");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/yogaJournal";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// var db = mongoose.connection;
// db.on("error", function(error) {
//     console.log("Database Error:", error);
// });

// db.once("open", function() {
//     console.log("Connection succesful.");
// });

// Database config
// var databaseUrl = "scraper";
// var collections = ["scrapedData"];

// Hook mongojs config to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//     console.log("Database Error:", error);
// });

// Main route 
// app.get("/", function(req, res) {
//     res.send(index.html);
//   });

//   app.post('/submit', function(req, res) {
//       var user = new Example(req.body);
//   })


// Routes

// // A GET route for scraping website
app.get("/scrape", function(req, res) {
    // Grab the body of the html with request
    axios.get("https://www.yogajournal.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $(".m-card--header").each(function(i, element) {
            var result = {};

        result.headline = $(this).text();
        result.link = $(this).attr("href");
        result.summary = $(this).parent("a").text();

            
            db.Article.create({
                ...result,
                saved: false
            }, function(err, saved) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(saved);
                }
            }
            );

            // .then(function(dbArticle) {
            //     console.log(dbArticle);
            // })
            // .catch(function(err) {
            //     return res.json(err);
        
            });
         
    });
    res.send('scrape complete!');
});
// });

// Retrieve data from fb

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/clear", function(req, res) {
    db.Article.remove({})
    .then(function () {
        res.json({
            success: true
        });
    })
})

//             result.title = $(this)
//             .children("a")
//             .text();
//             result.link = $(this)
//             .children("a")
//             .attr("href");

        // Create a new article using the 'result' object built from scraping
        // db.Article.create(result)
        //     .then(function(dbNews) {
        //         // View the added result 
        //         console.log(dbNews);
        //     })
        //     .catch(function(err) {
        //         return res.json(err);
        //     });
        // });

//         // If able to scrape and save article, send message to client
//         res.send("Scrape Complete");


//     })
// })

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App running on port  " + PORT + "!");
  });
  