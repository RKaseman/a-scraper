
$.getJSON("/threads", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#threads").append("<p data-id='" + data[i]._id + "'>"
            + "<strong>Thread Title: </strong>" + data[i].title
            + "<br><strong>Link: </strong><a href='" + data[i].link + "'>" + data[i].link + "</a>"
            + "<br><strong>Last User: </strong>" + data[i].user
            + "<br><strong>Reply Count: </strong>" + data[i].replies
            + "<br><strong>Date: </strong>" + data[i].latest
            + "</p>");
    }
});


$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/threads/" + thisId
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
        url: "/threads/" + thisId,
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

