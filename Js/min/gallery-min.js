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
var $closeHtml = '<button id="js-close-overlay" class="close-overlay">Close overlay</button>';
var $carouselHtml = '<div id="js-carousel" class="carousel"></div>';
var $slidesWrapperHtml = '<div id="js-carousel-slides" class="carousel-slides">';
var $slideHtml = '<div class="carousel-slide current-slide"></div>';
var $imageHtml = '<img>';
var $iframeHtml = '<div class="videoWrapper"><iframe frameborder="0"></iframe></div>';
var $captionHtml = '<figcaption></figcaption>';
var $prevButtonHtml = '<button id="previous-slide" class="carousel-control left-control">Previous</button>';
var $nextButtonHtml = '<button id="next-slide" class="carousel-control right-control">Next</button>';


/* --------------------------------------------------------------------------- *\
    FUNCTONS
\* --------------------------------------------------------------------------- */
//Focus and mouseover fx
/*function addFocusFx() {
    $hoverTile = '<div class="js-alt-active"><p>' + $(this).find('img').attr('alt') + '</p></div>';
    $(this).prepend($hoverTile);
}*/

function removeFocusFx() {
    $('.js-alt-active').remove();
}

//Higlight a new gallery item
function highlightSelected(selectItem) {
    // Define as selected item  
    selectItem.addClass($classSelected).siblings().removeClass($classSelected);
}

//Get overlay ready to show
function injectOverlay() {
    $($overlay).append($closeHtml + $carouselHtml);
    $($carousel).append($slidesWrapperHtml);
    $($slidesWrapper).append($slideHtml + $prevButtonHtml + $nextButtonHtml);
}

//Get data from selected item (getting stuff)
function getSlideData(selectItem) {
    $activeLink = selectItem.find('a').attr('href');
    $activeCaption = selectItem.find('img').attr('title');
    // $activeLink = $($gallery).index($itemIndex).find('a').attr('href');
    // $activeCaption = $($gallery).index($itemIndex).find('img').attr('title');

}

//Load data in slide (setting stuff)
function loadCarouselSlide() {
    $($currentSlide).empty();
    //If it starts with 'https://youtu.be/'
    if ($activeLink.startsWith('https://youtube.com/')) {
        //Append an iframe tag
        $($currentSlide).append($iframeHtml);
        $($currentSlide).append($captionHtml);
        $($currentSlide).find('iframe').attr('src', $activeLink);
        $($currentSlide).find('figcaption').text($activeCaption);

    } else {
        //Else append an img tag
        $($currentSlide).append($imageHtml);
        $($currentSlide).append($captionHtml);
        $($currentSlide).find('img').attr('src', $activeLink);
        $($currentSlide).find('figcaption').text($activeCaption);
    }
}

//Animate slide
function animateSlide() {
    $($currentSlide).fadeOut(250).fadeIn(250);
}

//Get new data en load slide
function getNewSlide(selectItem) {
    highlightSelected(selectItem);
    getSlideData(selectItem);
    animateSlide();
    setTimeout(loadCarouselSlide, 250);
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
        $($overlay).fadeOut(500);
        $($overlay).empty();
        $(document).off('keydown');
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
                $($overlay).fadeOut(500);
                $($overlay).empty();
                $(document).off('keydown');
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
    $($overlay).fadeIn(500);
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
            $(this).parent().parent().fadeOut(500);
        } else {
            //Show matches
            $(this).parent().parent().fadeIn(500);
        }

    });
});


/* --------------------------------------------------------------------------- *\
    GALLERY
\* --------------------------------------------------------------------------- */

//Add alt text to hover + remove again after
$($galleryItem).mouseover(function() {
    // addFocusFx();
    $hoverTile = '<p class="js-alt-active">' + $(this).find('img').attr('alt') + '</p>';
    $(this).prepend($hoverTile);
});
$($galleryItem).mouseout(function() {
    removeFocusFx();
});
$($galleryItem + ' a').focus(function() {
    // addFocusFx();
    $hoverTile = '<p class="js-alt-active">' + $(this).find('img').attr('alt') + '</p>';
    $(this).prepend($hoverTile);
});
$($galleryItem + ' a').blur(function() {
    removeFocusFx();
});

//Hide overlay 
$($overlay).hide();

//On click of thumbnail

$($galleryItem).click(function(event) {

    //Prevent default interaction   
    event.preventDefault();
    injectOverlay();
    showOverlay($(this));
});



