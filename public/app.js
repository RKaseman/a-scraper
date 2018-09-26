
// function displayResults(scraper) {
//     $("tbody").empty();
//     scraper.forEach(function (data) {
//         var tr = $("<tr>").append(
//             $("<td>").text(data.title),
//             $("<td>").text(data.link),
//             $("<td>").text(data.lastUser),
//             $("<td>").text(data.numPosts),
//             $("<td>").text(data.latest)
//         );
//         $("tbody").append(tr);
//     });
// }

// // change highlighted header
// function setActive(selector) {
//     // remove and apply 'active' class to distinguish which column we sorted by
//     $("th").removeClass("active");
//     $(selector).addClass("active");
// }

// $.getJSON("/all", function (data) {
//     displayResults(data);
// });

// $("#title-sort").on("click", function () {
//     setActive("#scrape-title");
//     $.getJSON("/title", function (data) {
//         displayResults(data);
//     });
// });

// $("#replies-sort").on("click", function () {
//     setActive("#scrape-replies");
//     $.getJSON("/replies", function (data) {
//         displayResults(data);
//     });
// });


$.getJSON("/scrape-title", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#scrape-title").append("<p data-id='" + data[i]._id + "'>"
            + data[i].title
            + "<br />" + data[i].link
            + "<br />" + data[i].user
            + "<br />" + data[i].replies
            + "<br />" + data[i].latest
            + "</p>");
    }
});


$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/scrape-title/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/scrape-title/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

