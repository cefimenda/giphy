var gifList = JSON.parse(localStorage.getItem('gifList')) || {}
var likedGifs = JSON.parse(localStorage.getItem('likedGifs')) || {}
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
var displayedGifs = {}


async function gifSearch(searchParameters) {
    var query = $.param(searchParameters)
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?" + query,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            var gifObj = new Gif(response.data[i])
            dumpGif(gifObj)
            gifObj.element = JSON.stringify($(".displayGif").children().first())
            gifList[gifObj.id] = gifObj
            displayedGifs[gifObj.id] = gifObj
            localStorage.setItem('gifList', JSON.stringify(gifList))
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
    if (searchHistory.length > 0) {
        createHistoryBar()
        getHistoryButtons()
    }
    if (likedGifs != null) {
        $(".faves").empty()
        for (var i in likedGifs) {
            dumpGif(likedGifs[i], $(".faves"))
        }
    }
    $("#searchButton").click(function () {
        event.preventDefault()
        parameters.q = $("#gifQuery").val().trim()
        parameters.limit = $("#gifCount option:selected").val()
        $("#gifQuery").val("")
        gifSearch(parameters)
        searchHistory.push(parameters.q)
        createHistoryBar()
        getHistoryButtons()
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
    });
    $(".displayGif").on('click', '.close', function () {
        var id = $(this).parent().parent().attr("id")
        delete displayedGifs[id]
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
        heartButtonClick(this)
    });
    $("#favoritesButton").click(function () {
        event.preventDefault()
        $(".favoriteModal").modal('toggle')
    });
    $(".displayGif").on("click", ".card-img-top", function () {
        var id = $(this).parent().attr('id')
        if ($(this).attr('src') == gifList[id].static) {
            $(this).attr('src', gifList[id].url)
        } else {
            $(this).attr('src', gifList[id].static)
        }
    });
    $(".faves").on("click", ".card-img-top", function () {
        var id = $(this).parent().attr('id')
        if ($(this).attr('src') == gifList[id].static) {
            $(this).attr('src', gifList[id].url)
        } else {
            $(this).attr('src', gifList[id].static)
        }
    });
    $(".faves").on('click', '.heart', function () {
        heartButtonClick(this)
    });
    $(".navbarRow").on("click", ".historyButton", function () {
        parameters.q = $(this).text()
        parameters.limit = $("#gifCount option:selected").val()
        $("#gifQuery").val("")
        gifSearch(parameters)
    });
})

function heartButtonClick(that) {
    var id = $(that).parent().parent().attr('id')
    if (gifList[id].liked != true) {
        gifList[id].liked = true
        $(".faves").empty()
        likedGifs[id] = gifList[id]
        for (var i in likedGifs) {
            dumpGif(likedGifs[i], $(".faves"))
        }
        changeLikedButton('full', id)
    } else {
        gifList[id].liked = false
        delete likedGifs[id]
        $(".faves").empty()
        for (var i in likedGifs) {
            dumpGif(likedGifs[i], $(".faves"))
        }
        changeLikedButton('empty', id)
    }

    localStorage.setItem("likedGifs", JSON.stringify(likedGifs))
    localStorage.setItem("gifList", JSON.stringify(gifList))

}
function changeLikedButton(targetStatus, id) {

    for (var i = 0; i < $("." + id).length; i++) {
        var element = $(($("." + id))[i])
        element.children().first().children().last().attr('src', "assets/images/like-" + targetStatus + ".png")
    }
}
function dumpGif(gifObj, target) {
    //we must avoid duplicates in the display area
    if (target == null || target == $(".displayGif"))
        for (var i in displayedGifs) {
            if (gifObj.id == displayedGifs[i].id) { return }
        }
    var imageUrl = gifObj.static
    var titleText = gifObj.title
    if (target == null) {
        var container = $("<div>").addClass("card bg-light col-12 col-sm-6 col-md-4 col-lg-3 shadow-sm mx-auto p-0 m-sm-1")
    } else { //if adding to the faves section
        var container = $("<div>").addClass("card bg-light shadow-sm my-2 mx-auto p-0")
    }
    container.css({
        'width': '200px',
        'max-height': '350px',
        'overflow': 'scroll'
    });
    container.attr('id', gifObj.id)
    container.addClass(gifObj.id)
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

    if (gifObj.liked == true) {
        var heart = $("<img>").attr('src', 'assets/images/like-full.png');
    } else {
        var heart = $("<img>").attr('src', 'assets/images/like-empty.png');
    }
    heart.css({
        'width': '20px',
        'height': '20px'
    })
    heart.addClass('float-right mr-2 heart')
    buttonBar.append(heart)

    container.prepend(buttonBar)

    var display = target || $(".displayGif")
    display.prepend(container)
}

function Gif(gif) {
    this.liked = false
    this.id = gif.id
    this.static = gif.images['480w_still'].url
    this.url = gif.images.original.url;
    this.title = gif.title;
    this.rating = gif.rating
}

function createHistoryBar() {
    $(".historyBar").remove()
    $(".historyCol").remove()
    $(".dynamicPlaceholder").remove()
    $(".historyLine").remove()

    var col = $("<div>").addClass("col-12 historyCol")
    var line = $("<hr>").addClass("historyLine m-3")
    col.append(line)
    var div = $("<div>").addClass('w-100 historyBar mt-1 mb-0')
    div.text('Search History')
    col.append(div)
    $(".navbarRow").append(col)
    var placeholder = $("<div>").addClass("w-100 mt-5 p-3 dynamicPlaceholder")
    $("body").prepend(placeholder)
}

function getHistoryButtons() {
    $(".historyBar").empty()
    for (var i in searchHistory) {
        var but = $("<button>").addClass('btn-sm ml-3 btn-outline-secondary historyButton')
        but.text(searchHistory[i])
        $(".historyBar").prepend(but)
    }
    $(".historyBar").prepend('Recent: ')
}