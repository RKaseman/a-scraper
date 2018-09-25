
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");

console.log("\n--------------------------------\n" +
    "-|          eso scrape        |-" +
    "\n--------------------------------\n");

request("https://forums.elderscrollsonline.com/en/categories/website-article-discussions", function (error, response, html) {
    var $ = cheerio.load(html);
    var resultsEso = [];

    $("tr[id^='Discussion_']").each(function (i, element) {
        var esoTitle = $(element).children().children().children("a.Title").text();
        var esoLink = $(element).children().children().children("a.Title").attr("href");
        var esoUser = $(element).children("td.LastUser").children().children("a.UserLink").attr("href");
        var esoCount = $(element).children("td.CountComments").children().children("span.Number").text();
        var timeStamp = $(element).children("td.LastUser").children().children().children().children("time").text();
        resultsEso.push({
            title: esoTitle,
            link: esoLink,
            lastUser: esoUser,
            numPosts: esoCount,
            timeStamp: timeStamp
        });
    });
    console.log(resultsEso);
});

var app = express();

app.use(express.static("public"));

// db config
var databaseUrl = "scraper";
var collections = ["scrapeCx"];
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});

// routes
app.get("/", function (req, res) {
    res.send("Hello world");
});

app.get("/all", function (req, res) {
    db.scrapeCx.find({}, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/name", function (req, res) {
    db.scrapeCx.find().sort({ name: 1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.get("/weight", function (req, res) {
    db.scrapeCx.find().sort({ weight: -1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

app.listen(3000, function () {
    console.log("listen port 3000");
});

