gifList = {}
likedGifs = {}
searchHistory = []

async function gifSearch(searchParameters) {
    var query = $.param(searchParameters)
    console.log("searching " + searchParameters.q)
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?" + query,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        for (var i = 0; i < response.data.length; i++) {
            var gifObj = new Gif(response.data[i])
            dumpGif(gifObj)
            gifObj.element = $(".displayGif").children().first()
            gifList[gifObj.id] = gifObj
        }
    })
}

var parameters = {
    api_key: 'QnI21JC9fT68dL9JSejmP5h8KbftPofr',
    q: '',
    limit: '',
    rating: '',
}

$(function () {
    $("#searchButton").click(function () {
        event.preventDefault()
        parameters.q = $("#gifQuery").val().trim()
        parameters.limit = $("#gifCount option:selected").val()
        $("#gifQuery").val("")
        gifSearch(parameters)
        searchHistory.push(parameters.q)
        createHistoryBar()
        getHistoryButtons()
    });
    $(".displayGif").on('click', '.close', function () {
        var id = $(this).parent().parent().attr("id")
        delete gifList[id]
        $(this).parent().parent().remove()
    });
    $(".displayGif").on('mouseenter', '.heart', function () {
        var id = $(this).parent().parent().attr('id')

        var currentImg = $(this).attr('src')
        if (currentImg.search("empty") > -1) {
            $(this).attr('src', 'assets/images/like-full.png')
        }
    });
    $(".displayGif").on("mouseleave", ".heart", function () {
        var id = $(this).parent().parent().attr('id')

        var currentImg = $(this).attr('src')
        if (gifList[id].liked == true) { return }
        if (currentImg.search("full") > -1) {
            $(this).attr('src', 'assets/images/like-empty.png')
        }
    });
    $(".displayGif").on('click', '.heart', function () {
        var id = $(this).parent().parent().attr('id')
        if (gifList[id].liked == true) {
            gifList[id].liked = false

            delete likedGifs[id]
        } else {
            gifList[id].liked = true
            likedGifs[id] = gifList[id]
            return
        }
    });
    $("#favoritesButton").click(function () {
        event.preventDefault()
        if ($(this).text() == "Show Favorites") {
            $(".displayGif").empty()
            for (var i in likedGifs) {
                $('.displayGif').prepend(likedGifs[i].element)
            }
            $(this).text('Show All')
        } else {
            $(".displayGif").empty()
            for (var i in gifList) {
                $('.displayGif').prepend(gifList[i].element)
            }
            $(this).text('Show Favorites')
        }
    });
    $(".displayGif").on("click", ".card-img-top", function () {
        var id = $(this).parent().attr('id')
        console.log(id)
        if ($(this).attr('src') == gifList[id].static) {
            $(this).attr('src', gifList[id].url)
        } else {
            $(this).attr('src', gifList[id].static)
        }
    });
    $(".navbarRow").on("click",".historyButton",function(){
        parameters.q = $(this).text()
        parameters.limit = $("#gifCount option:selected").val()
        $("#gifQuery").val("")
        gifSearch(parameters)
    });
})

function dumpGif(gifObj) {
    for (var i in gifList) {
        if (gifObj.id == gifList[i].id) { return }
    }
    var imageUrl = gifObj.static
    var titleText = gifObj.title
    var container = $("<div>").addClass("card bg-light col-12 col-sm-6 col-md-4 col-lg-3 shadow-sm mx-auto p-0 m-sm-1")
    container.css({
        'width': '200px',
        'max-height': '350px',
        'overflow': 'scroll'
    });
    container.attr('id', gifObj.id)
    var img = $("<img>").attr("src", imageUrl)
    img.addClass("card-img-top")
    img.css({
        'max-height': '200px'
    })
    container.append(img)

    var body = $("<div>").addClass("card-body")
    body.css({
        'max-height': '250px'
    })
    var title = $("<h5>").addClass("card-title")
    title.text(titleText)
    body.append(title)

    var rating = $("<p>").addClass("card-text")
    rating.text("Rating: " + gifObj.rating)
    body.append(rating)
    container.append(body)

    var buttonBar = $("<div>")
    buttonBar.addClass("bg-light my-2")
    buttonBar.css({
        'width': '100%'
    })
    var close = $("<span>").html("&times;")
    close.addClass("float-left ml-2 close")
    buttonBar.append(close)

    var heart = $("<img>").attr('src', 'assets/images/like-empty.png');
    heart.css({
        'width': '20px',
        'height': '20px'
    })
    heart.addClass('float-right mr-2 heart')
    buttonBar.append(heart)

    container.prepend(buttonBar)

    var display = $(".displayGif")
    display.prepend(container)
}

function Gif(gif) {
    this.liked = false
    this.id = gif.id
    this.static = gif.images['480w_still'].url
    this.url = gif.images.original.url;
    this.title = gif.title;
    this.element = {
    };
    this.rating = gif.rating
}

function createHistoryBar(){
    $(".historyBar").remove()
    $(".historyCol").remove()
    $(".dynamicPlaceholder").remove()
    $(".historyLine").remove()

    var col = $("<div>").addClass("col-12 historyCol")
    col.append("<hr class ='historyLine>")
    var div = $("<div>").addClass('w-100 historyBar mt-3 mb-0')
    div.text('Search History')
    col.append(div)
    $(".navbarRow").append(col)
    var placeholder = $("<div>").addClass("w-100 mt-3 p-3 dynamicPlaceholder")
    $("body").prepend(placeholder)
}

function getHistoryButtons(){
    $(".historyBar").empty()
    for (var i in searchHistory){
        var but = $("<button>").addClass('btn-sm ml-3 btn-outline-secondary historyButton')
        but.text(searchHistory[i])
        $(".historyBar").prepend(but)
    }
    $(".historyBar").prepend('Recent: ')
}