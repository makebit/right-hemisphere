let videos = []

$(document).ready(function () {
    // Init videos and load all thumbs
    $('.youtube').each(function (index, value) {
        //console.log($(this))
        videos.push($(this))
        loadThumbnail($(this))
    });

    $("img.lazyload").lazyload({effect : "fadeIn"});

    /*
    // Wrap every letter in a span
    var textWrappers = document.querySelectorAll('.ml7 .letters');
    textWrappers.forEach(function(textWrapper) {
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    });

    anime.timeline({loop: false})
    .add({
        targets: '.ml7 .letter',
        translateY: ["1.1em", 0],
        translateX: ["0.55em", 0],
        translateZ: 0,
        rotateZ: [180, 0],
        duration: 300,
        easing: "easeOutExpo",
        delay: (el, i) => Math.random()*100 * i
    });*/

    AOS.init({
        duration: 1000, // values from 0 to 3000, with step 50ms
        delay: 0
    });

    var replace = new ReplaceMe(document.querySelector('.replace-me'));

    $('.full-height').fullHeight($("#topnav").height());
});

// Load the thumbnail of the obj object
function loadThumbnail(obj) {
    // Load the thumbnail image source
    var videoId = obj[0].dataset.embed
    var src = 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';

    obj.append('<img class="lazyload" data-src="' + src + '">');

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