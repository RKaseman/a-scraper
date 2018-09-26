
// 18-01-10
// create table body
function displayResults(scraper) {
    $("tbody").empty();
    scraper.forEach(function (data) {
        var tr = $("<tr>").append(
            $("<td>").text(data.title),
            $("<td>").text(data.link),
            $("<td>").text(data.lastUser),
            $("<td>").text(data.numPosts),
            $("<td>").text(data.latest)
        );
        $("tbody").append(tr);
    });
}

// change highlighted header
function setActive(selector) {
    // remove and apply 'active' class to distinguish which column we sorted by
    $("th").removeClass("active");
    $(selector).addClass("active");
}

$.getJSON("/all", function (data) {
    displayResults(data);
});

$("#title-sort").on("click", function () {
    setActive("#scrape-title");
    $.getJSON("/title", function (data) {
        displayResults(data);
    });
});

$("#replies-sort").on("click", function () {
    setActive("#scrape-replies");
    $.getJSON("/replies", function (data) {
        displayResults(data);
    });
});
