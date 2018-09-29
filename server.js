
var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var axios = require("axios");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
    db.Thread.deleteMany( { "note": { "$exists": false } } )
    .then(function () {
        axios.get("https://forums.elderscrollsonline.com/en/categories/website-article-discussions").then(function (response) {
            var $ = cheerio.load(response.data);
            $("tr[id^='Discussion_']").each(function (i, element) {
                var result = {};
                result.title = $(this).children().children().children("a.Title").text();
                result.link = $(this).children().children().children("a.Title").attr("href");
                result.user = $(this).children("td.LastUser").children().children("a.UserLink").attr("href");
                result.replies = $(this).children("td.CountComments").children().children("span.Number").text();
                result.latest = $(this).children("td.LastUser").children().children().children().children("time").text();
                db.Thread.create(result)
                    .then(function (dbThread) {
                        console.log(dbThread);
                    })
                    .catch(function (error) {
                        return res.json(error);
                    });
            });
            res.send("Complete");
        });
    });
});

// routes

app.get("/threads", function (req, res) {
    db.Thread.find({})
        .then(function (dbThread) {
            res.json(dbThread);
        })
        .catch(function (error) {
            res.json(error);
        });
});

app.get("/threads/:id", function (req, res) {
    db.Thread.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbThread) {
            res.json(dbThread);
        })
        .catch(function (error) {
            res.json(error);
        });
});

app.post("/threads/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Thread.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbThread) {
            res.json(dbThread);
        })
        .catch(function (error) {
            res.json(error);
        });
});

app.listen(PORT, function () {
    console.log("listen port " + PORT);
});

