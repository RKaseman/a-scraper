
var express = require("express");
var mongojs = require("mongojs");
// req.body
var bodyParser = require("body-parser");
// parses HTML and finds elements
var cheerio = require("cheerio");
// HTTP request for HTML page
var request = require("request");

var app = express();
app.use(express.static("public"));

// db config
var databaseUrl = "scraper";
var collections = ["scrapeCx"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// from db
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

app.get("/scrape", function (req, res) {
    request("https://forums.elderscrollsonline.com/en/categories/website-article-discussions", function (error, response, html) {
        var $ = cheerio.load(html);

        $("tr[id^='Discussion_']").each(function (i, element) {
            var title = $(element).children().children().children("a.Title").text();
            var link = $(element).children().children().children("a.Title").attr("href");
            var user = $(element).children("td.LastUser").children().children("a.UserLink").attr("href");
            var replies = $(element).children("td.CountComments").children().children("span.Number").text();
            var latest = $(element).children("td.LastUser").children().children().children().children("time").text();
            if (title && link && user && replies && latest) {
                db.scrapeCx.insert({
                    title: title,
                    link: link,
                    lastUser: user,
                    numPosts: replies,
                    latest: latest
                },
                    function (error, inserted) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(inserted);
                        }
                    });
            }
        });
    });
    res.send("Complete");
});

// routes

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

app.get("/title", function (req, res) {
    db.scrapeCx.find().sort({ title: 1 }, function (error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
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

app.listen(3000, function () {
    console.log("listen port 3000");
});

