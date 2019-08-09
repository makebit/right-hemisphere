var fullHeight = function () {
    if ($(window).width() > 1080) {
        var newH;
        if ($("#menu").height() > $(window).height()){
            newH = $("#menu").height();
        } else {
            newH = $(window).height();
        }

        $('.js-fullheight').css('height', newH);
        $(window).resize(function () {
            $('.js-fullheight').css('height', newH);
        });
    } else {
        var footerHeight = $('.footer').height();
        console.log(footerHeight)
        $('.js-fullheight').css('height', $('.js-fullheight').height() + footerHeight*3);
        $(window).resize(function () {
            $('.js-fullheight').css('height', $('.js-fullheight').height()  + footerHeight*3);
        });
    }

};

fullHeight();


// Init carousel
$('.carousel').carousel({
    interval: false
})
// Init variables
var videos = []
var currentVideo = 0;

// Events fired when the carousel is slided
$('.carousel').on('slid.bs.carousel', function (e) {
    // show the carousel captions
    $(".carousel-caption").show();

    // Reset the previous or next video
    if (e.direction == "left") {
        videos[currentVideo].html('<div class="play-button"></div>')
        loadThumbnail(videos[currentVideo])
        currentVideo = (currentVideo + 1) % (videos.length);
    } else {
        videos[currentVideo].html('<div class="play-button"></div>')
        loadThumbnail(videos[currentVideo])
        currentVideo--;
        if (currentVideo < 0) {
            currentVideo = videos.length - 1
        }
    }
})

$(document).ready(function () {
    // Init videos and load all thumbs
    $('.youtube').each(function (index, value) {
        console.log($(this))
        videos.push($(this))
        loadThumbnail($(this))
    });

    // Init fancybox
    $(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });
    // Init gallery transitions
    $(".zoom").hover(function () {
        $(this).addClass('transition');
    }, function () {
        $(this).removeClass('transition');
    });
});

// Load the thumbnail of the obj object
function loadThumbnail(obj) {
    // Load the thumbnail image source
    var videoId = obj[0].dataset.embed
    var src = 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';

    // Load the image asynchronously
    var image = new Image();
    image.src = src;
    image.class = "d-block w-100"
    image.addEventListener("load", function () {
        // When the image is loaded append it to the div
        // obj.css('background-image', 'url(' + src + ')')
        obj.append(image);
    });

    // Init the click event
    obj[0].addEventListener("click", function () {
        // Hide the carousel captions
        $('.carousel-caption').hide();

        // Load the video when the div is clicked
        var iframe = document.createElement("iframe");

        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("src", "https://www.youtube.com/embed/" + videoId + "?rel=0&showinfo=0&autoplay=1");

        this.innerHTML = "";
        this.appendChild(iframe);
    });
}