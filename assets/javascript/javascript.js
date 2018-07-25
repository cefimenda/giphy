gifList = []
likedGifs = []

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
            gifList.push(gifObj)
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
    });
    $(".displayGif").on('click', '.close', function () {
        $(this).parent().parent().remove()
        gifTitle = $(this).parent().siblings().last().children().first().text()
        removeGifFromList(gifTitle, gifList)
    });
    $(".displayGif").on('mouseenter', '.heart', function () {
        var currentImg = $(this).attr('src')
        if (currentImg.search("empty") > -1) {
            $(this).attr('src', 'assets/images/like-full.png')
        }
    });
    $(".displayGif").on("mouseleave", ".heart", function () {
        var currentImg = $(this).attr('src')
        if ($(this).attr('liked') == 'true') { return }
        if (currentImg.search("full") > -1) {
            $(this).attr('src', 'assets/images/like-empty.png')
        }
    });
    $(".displayGif").on('click', '.heart', function () {
        var currentImg = $(this).attr('src')
        if ($(this).attr('liked') == 'true') {
            $(this).attr('liked', 'false')
            gifTitle = $(this).parent().siblings().last().children().first().text()
            removeGifFromList(gifTitle, likedGifs)
        } else {
            $(this).attr('liked', 'true')
            var container = $(this).parent().parent()
            var gifObj = JSON.parse(container.attr('gif-data'))
            gifObj.element = container
            likedGifs.push(gifObj)
            return
        }
    });
    $("#favoritesButton").click(function () {
        if ($(this).text()=="Favorites") {
            $(".displayGif").empty()
            for (var i in likedGifs) {
                $('.displayGif').prepend(likedGifs[i].element)
            }
            $(this).text('Show All')
        }else{
            $(".displayGif").empty()
            for (var i in gifList) {
                $('.displayGif').prepend(gifList[i].element)
            }
            $(this).text('Favorites')
        }
    })
})

function dumpGif(gifObj) {
    var imageUrl = gifObj.url
    var titleText = gifObj.title
    var container = $("<div>").addClass("card bg-light col-3 shadow-sm p-0 m-1")
    container.css({
        'width': '200px',
        'max-height': '350px',
        'overflow': 'scroll'
    });
    container.attr('gif-data', JSON.stringify(gifObj))
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
    this.url = gif.images.original.url;
    this.title = gif.title;
    this.element = {
    };
    this.rating = gif.rating
}
function removeGifFromList(gifTitle, list) {
    for (var i in list) {
        if (list[i].title == gifTitle) {
            list.splice(i, 1)
            return
        }
    }
}