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
var $totalItems = $('li').size();
var $currentItemIndex;
var $prevItemIndex;
var $nextItemIndex;
var $firstItemIndex = 0;
var $lastItemIndex = $totalItems - 1;
var $hoverTile;


//Links
var $activeLink;
var $activeCaption;

//Overlay
var $overlay = '#js-image-overlay';
var $carousel = '#js-carousel';
var $slidesWrapper = "#js-carousel-slides";
var $currentSlide = '.current-slide';

//Injected HTML (for building a fresh overlay each time an item is clicked)
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

//Controls
var $prevButton = '#previous-slide';
var $nextButton = '#next-slide';
var $closeButton = '#js-close-overlay';

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

function showArrows() {
    $($prevButton).show();
    $($nextButton).show();
}

function hidePrevArrow() {
    $($prevButton).hide();
}

function hideNextArrow() {
    $($nextButton).hide();
}

//Load data in slide (setting stuff)
function loadCarouselSlide() {
    //Empty and load fresh data
    $($currentSlide).empty();
    if ($activeLink.startsWith('https://youtube.com/')) {
        $($currentSlide).append($iframeHtml);
        $($currentSlide).find('iframe').attr('src', $activeLink);
    } else {
        $($currentSlide).append($imageHtml);
        $($currentSlide).find('img').attr('src', $activeLink);
    }
    $($currentSlide).append($captionHtml);
    $($currentSlide).find('figcaption').text($activeCaption);

    //Check the items index
    if ($currentItemIndex === $firstItemIndex) {
        hidePrevArrow();
    } else if ($currentItemIndex === $lastItemIndex) {
        hideNextArrow();
    } else {
        showArrows();
    }
}

//Animate slide
function animateSlide() {
    $($currentSlide).fadeOut($singleDuration).fadeIn($singleDuration);
}

//Check the index (and log it for testing and debugging)
function checkIndex() {
    $prevItemIndex = $currentItemIndex - 1;
    $nextItemIndex = $currentItemIndex + 1;
    // console.log('currentItemIndex: ' + $currentItemIndex);
    // console.log('prevItemIndex: ' + $prevItemIndex);
    // console.log('nextItemIndex: ' + $nextItemIndex);
    // console.log('firstItemIndex: ' + $firstItemIndex);
    // console.log('lastItemIndex: ' + $lastItemIndex);
}

//Get new data en load slide
function getNewSlide(selectItem) {
    highlightSelected(selectItem);
    getSlideData(selectItem);
    animateSlide();
    setTimeout(loadCarouselSlide, $singleDuration);
    checkIndex();
}

function getPrevSlide() {
    if ($currentItemIndex > $firstItemIndex) {
        showArrows();
        $currentItemIndex -= 1;
        getNewSlide($($selectedItem).prev());
    }
    if ($currentItemIndex === $firstItemIndex) {
        hidePrevArrow();
    }
}

function getNextSlide() {
    if ($currentItemIndex < $lastItemIndex) {
        showArrows();
        $currentItemIndex += 1;
        getNewSlide($($selectedItem).next());
    }
    if ($currentItemIndex === $lastItemIndex) {
        hideNextArrow();
    }
}


//Control the entire thing
function carouselControl() {

    //Hiding the overlay
    function hideOverlay() {
        $($overlay).fadeOut($doubleDuration);
        setTimeout(removeOverlay, $doubleDuration);
        $(document).off('keydown');
    }

    //On click left + right arrows
    $($prevButton).click(function() {
        getPrevSlide();
    });
    $($nextButton).click(function() {
        getNextSlide();
    });
    $($closeButton).click(function() {
        hideOverlay();
    });

    //On keypress
    $(document).on('keydown', function(event) {
        switch (event.which) {
            case 37: // Left arrow
                getPrevSlide();
                break;

            case 39: // Right arrow
                getNextSlide();
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
    //Define index of clicked item
    $currentItemIndex = $($(this)).index();
    // alert($currentItemIndex);

    //Prevent default interaction   
    event.preventDefault();
    injectOverlay();
    showOverlay($(this));
    checkIndex();
});


//Add alt text to hover + remove again after
$($galleryItem).mouseover(function() {
    $hoverTile = '<p class="js-alt-active">' + $(this).find('img').attr('alt') + '</p>';
    $(this).prepend($hoverTile);
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
