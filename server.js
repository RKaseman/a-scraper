
var express = require("express");
var bodyParser = require("body-parser"); // req.body
var cheerio = require("cheerio"); // parses HTML and finds elements
var request = require("request"); // HTTP request for HTML page
var mongoose = require("mongoose");
var axios = require("axios");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("https://forums.elderscrollsonline.com/en/categories/website-article-discussions").then(function (response) {
        var $ = cheerio.load(response.data);

        $("tr[id^='Discussion_']").each(function (i, element) {
            var result = {};

            result.title = $(this).children().children().children("a.Title").text();
            result.link = $(this).children().children().children("a.Title").attr("href");
            result.user = $(this).children("td.LastUser").children().children("a.UserLink").attr("href");
            result.replies = $(this).children("td.CountComments").children().children("span.Number").text();
            result.latest = $(this).children("td.LastUser").children().children().children().children("time").text();
            db.Threads.create(result)
                .then(function (dbThreads) {
                    console.log(dbThreads);
                })
                .catch(function (error) {
                    return res.json(error);
                });
        });
        res.send("Complete");
    });
});

// routes

app.get("/title", function (req, res) {
    db.Threads.find({})
        .then(function (dbThreads) {
            res.json(dbThreads);
        })
        .catch(function (error) {
            res.json(error);
        });
});

app.get("/link", function (req, res) {
    db.scrapeCx.find().sort({ link: -1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/user", function (req, res) {
    db.scrapeCx.find().sort({ link: -1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/replies", function (req, res) {
    db.scrapeCx.find().sort({ link: -1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.post("/submit", function (req, res) {
    console.log(req.body);
    db.scrapeCx.save(resultsESO, function (error, saved) {
        if (error) {
            console.log(error);
        } else {
            res.send(saved);
        }
    });
});

app.listen(PORT, function () {
    console.log("listen port " + PORT);
});

