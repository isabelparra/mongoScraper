$.getJSON("/articles", function(data) {
    $("#articles").empty();
    // For each one
    for (let i = 0; i < data.length; i++) {
        // Display info on page
        $("#articles").append(
            "<div id='articleDiv'><h2 id='headline' data-id='" + 
            data[i]._id + "'>" + "<a href='https://www.yogajournal.com/" + data[i].link + "'>" +
            data[i].headline + 
            " " + "</h2></a></div><p><br><div class='summary'>" +
            data[i].summary + "</p></div><button class='addBtn' data-id='" +
            data[i]._id + "'><i class=''></i>Save</button><button id='commentBtn'><i class=''></i>&nbsp Comment</button></div>"
            );
    }
});

$(document).on("click", "#home", function() {
    // $("#comments").empty();

    var thisid = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisid
    })
    .then(function(data) {
        console.log(data);
        $("#comments").append("<h2>" + data.headline + "</h2>");
        $("#comments").append("<input id='headlineInput' name='title' >");
        $("#comments").append("<textarea id='bodyInput' name='body'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save</button>");

        // If there's a note in the article
        if (data.comment) {
            // Place the title of the note in the title input
            $("#headlineInput").val(data.comment.headline);
            // Place the body of the note in the body textarea
            $("#body").val(data.comment.body);
          }
    });
});

$(document).on("click", "#home", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "articles",
        data: {
            headline: $("#headlineInput").val(),
            body: $("#body").val()
        }
    })
    .then(function(data) {
        console.log(data);
    });
    $("#headlineInput").val("");
    $("#body").val("");
    
});
    // $("#body").

$(document).on("click", "#clear", function(err, res) {
    $("#articles").empty();
    $.ajax({
        method: "GET",
        url: "/clear"
    }).done(function(data) {
        window.location.href = "/";
    });
});