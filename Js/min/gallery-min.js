/* --------------------------------------------------------------------------- *\
    VARIABLES
\* --------------------------------------------------------------------------- */

//Search
var $input = '#search';
var $inputValue;
var $imageName;

//Gallery
var $selectedItem = '.selected';
var $classSelected = 'selected';
var $galleryItem = '.gallery-item';
var $gallery = '#image-gallery';
var $hoverTile;


//Links
var $activeLink;
var $activeCaption;

//Overlay
var $overlay = '#js-image-overlay';
var $carousel = '#js-carousel';
var $slidesWrapper = "#js-carousel-slides";
var $currentSlide = '.current-slide';

//Injected HTML
var $overlayHtml = '<div id="js-image-overlay"></div>';
var $closeHtml = '<button id="js-close-overlay" class="close-overlay">Close overlay</button>';
var $carouselHtml = '<div id="js-carousel" class="carousel"></div>';
var $slidesWrapperHtml = '<div id="js-carousel-slides" class="carousel-slides">';
var $slideHtml = '<div class="carousel-slide current-slide"></div>';
var $imageHtml = '<img>';
var $iframeHtml = '<div class="videoWrapper"><iframe frameborder="0"></iframe></div>';
var $captionHtml = '<figcaption></figcaption>';
var $prevButtonHtml = '<button id="previous-slide" class="carousel-control left-control">Previous</button>';
var $nextButtonHtml = '<button id="next-slide" class="carousel-control right-control">Next</button>';


//Transitions
var $singleDuration = 200;
var $doubleDuration = 400;

/* --------------------------------------------------------------------------- *\
    FUNCTONS
\* --------------------------------------------------------------------------- */
//Focus and mouseover fx
/*function addFocusFx() {
    $hoverTile = '<p class="js-alt-active">' + $(this).find('img').attr('alt') + '</p>';
    $(this).prepend($hoverTile);
}*/

function removeFocusFx() {
    $('.js-alt-active').remove();
}

//Higlight a new gallery item
function highlightSelected(selectItem) {
    selectItem.addClass($classSelected).siblings().removeClass($classSelected);
}

//Get overlay ready to show
function injectOverlay() {
    $('body').prepend($overlayHtml);
    $($overlay).hide();
    $($overlay).append($closeHtml + $carouselHtml);
    $($carousel).append($slidesWrapperHtml);
    $($slidesWrapper).append($slideHtml + $prevButtonHtml + $nextButtonHtml);
}

//Remove it again
function removeOverlay() {
    $($overlay).remove();
}

//Get data from selected item (getting stuff)
function getSlideData(selectItem) {
    $activeLink = selectItem.find('a').attr('href');
    $activeCaption = selectItem.find('img').attr('title');
}

//Load data in slide (setting stuff)
function loadCarouselSlide() {
    $($currentSlide).empty();
    //If it starts with 'https://youtu.be/'
    if ($activeLink.startsWith('https://youtube.com/')) {
        //Append an iframe tag
        $($currentSlide).append($iframeHtml);
        $($currentSlide).append($captionHtml);
        //And give new data
        $($currentSlide).find('iframe').attr('src', $activeLink);
        $($currentSlide).find('figcaption').text($activeCaption);

    } else {
        //Else append an img tag
        $($currentSlide).append($imageHtml);
        $($currentSlide).append($captionHtml);
        //And give new data
        $($currentSlide).find('img').attr('src', $activeLink);
        $($currentSlide).find('figcaption').text($activeCaption);
    }
}

//Animate slide
function animateSlide() {
    $($currentSlide).fadeOut($singleDuration).fadeIn($singleDuration);
}

//Get new data en load slide
function getNewSlide(selectItem) {
    highlightSelected(selectItem);
    getSlideData(selectItem);
    animateSlide();
    setTimeout(loadCarouselSlide, $singleDuration);
}

//Hiding the overlay
function hideOverlay() {
    $($overlay).fadeOut($doubleDuration);
    setTimeout(removeOverlay, $doubleDuration);
    $(document).off('keydown');
}

//Control the entire thing
function carouselControl() {

    //On click left + right arrows
    $('#previous-slide').click(function() {
        getNewSlide($($selectedItem).prev());
    });
    $('#next-slide').click(function() {
        getNewSlide($($selectedItem).next());
    });
    $('#js-close-overlay').click(function() {
        hideOverlay();
    });

    //On keypress
    $(document).on('keydown', function(event) {

        switch (event.which) {
            case 37: // Left arrow
                getNewSlide($($selectedItem).prev());
                break;

            case 39: // Right arrow
                getNewSlide($($selectedItem).next());
                break;

            case 27: // 'Esc'
                hideOverlay();
                break;

            default:
                return; // exit this handler for other keys

        }
    });
}

//Get and set all data for the carousel 
//based on the click event
function showOverlay(selectItem) {
    highlightSelected(selectItem);
    getSlideData(selectItem);
    loadCarouselSlide();
    $($overlay).fadeIn($doubleDuration);
    carouselControl();
}


/* --------------------------------------------------------------------------- *\
    SEARCH
\* --------------------------------------------------------------------------- */
//If anything is enterred in the search field
$($input).keyup(function() {

    //Get search value
    $inputValue = $(this).val();

    //Compare with gallery items
    $($gallery).find('img').each(function() {

        //Get image name
        $imageName = $(this).attr("title");

        //Check if the image name contains the input value
        if ($imageName.toLowerCase().indexOf($inputValue.toLowerCase()) < 0) {
            //Hide mismatches
            $(this).parent().parent().fadeOut($doubleDuration);
        } else {
            //Show matches
            $(this).parent().parent().fadeIn($doubleDuration);
        }

    });
});


/* --------------------------------------------------------------------------- *\
    GALLERY
\* --------------------------------------------------------------------------- */

//On click of thumbnail

$($galleryItem).click(function(event) {

    //Prevent default interaction   
    event.preventDefault();
    injectOverlay();
    // setTimeout(injectOverlay, 400);
    showOverlay($(this));
});


//Add alt text to hover + remove again after
$($galleryItem).mouseover(function() {
    $hoverTile = '<p class="js-alt-active">' + $(this).find('img').attr('alt') + '</p>';
    $(this).prepend($hoverTile);
    // $(this).siblings().fade(0.5);
});
$($galleryItem).mouseout(function() {
    removeFocusFx();
});
$($galleryItem + ' a').focus(function() {
    $hoverTile = '<p class="js-alt-active">' + $(this).find('img').attr('alt') + '</p>';
    $(this).prepend($hoverTile);
});
$($galleryItem + ' a').blur(function() {
    removeFocusFx();
});


