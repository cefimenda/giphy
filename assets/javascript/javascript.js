async function gifSearch(searchParameters){
    var query = $.param(searchParameters)
    console.log("searching "+searchParameters.q)
    $.ajax({
        url : "https://api.giphy.com/v1/gifs/search?"+query,
        method:"GET"
    }).then(function(response){
        console.log(response)
        for(var i=0;i<response.data.length;i++){
            dumpGif(response.data[i])
        }
    })
}

var parameters = {
    api_key:'QnI21JC9fT68dL9JSejmP5h8KbftPofr',
    q:'',
    limit:'',
    rating:'',
}

$(function(){
    $("button").click(function(){
        event.preventDefault()
        parameters.q = $("#gifQuery").val().trim()
        parameters.limit = $("#gifCount option:selected").val()
        $("#gifQuery").text("")
        gifSearch(parameters)
    });
})

function dumpGif(gif){
    var imageUrl = gif.images.original.url
    var titleText = gif.title
    console.log(imageUrl)
    var container = $("<div>").addClass("card bg-warning col-3 shadow-sm p-0 m-1")
    container.css({
        'width':'200px',
        'max-height':'350px',
        'overflow':'scroll'
    });
    var img = $("<img>").attr("src",imageUrl)
    img.addClass("card-img-top")
    img.css({
        'max-height':'200px'
    })
    container.append(img)

    var body = $("<div>").addClass("card-body")
    body.css({
        'max-height':'250px'
    })
    var title = $("<h5>").addClass("card-title")
    title.text(titleText)
    body.append(title)
    
    var rating=$("<p>").addClass("card-text")
    rating.text("Rating: "+gif.rating)
    body.append(rating)
    container.append(body)
    var display =$(".displayGif")
    display.append(container)
}