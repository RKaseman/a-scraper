
var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var mongoose = require("mongoose");
var axios = require("axios");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

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

app.get("/scrape-title", function (req, res) {
    db.Threads.find({})
        .then(function (dbThreads) {
            res.json(dbThreads);
        })
        .catch(function (error) {
            res.json(error);
        });
});

app.get("/scrape-title/:id", function (req, res) {
    db.Threads.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbThreads) {
            res.json(dbThreads);
        })
        .catch(function (error) {
            res.json(error);
        });
});

app.post("/scrape-title/:id", function (req, res) {
    db.Notes.create(req.body)
        .then(function (dbNotes) {
            return db.Threads.findOneAndUpdate({ _id: re.params.id }, { note: dbNotes._id }, { new: true });
        })
        .then(function (dbThreads) {
            res.json(dbThreads);
        })
        .catch(function (error) {
            res.json(error);
        });
});

app.listen(PORT, function () {
    console.log("listen port " + PORT);
});

