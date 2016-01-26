$(function(){
    $("select").select2({
        minimumResultsForSearch: Infinity
    });
    $('#excellence__banner').iosSlider({
        snapToChildren: true,
        desktopClickDrag: true,
        autoSlide: true,
        autoSlideTimer: 4000,
        navPrevSelector: "#excellence__banner__prev",
        navNextSelector: "#excellence__banner__next"
    });
    $(".tab_set").each(function () {
        var $tabSet = $(this),
            $tabLinks = $tabSet.find(".tab_link"),
            $tabPanes = $tabSet.find(".tab_pane");
        $tabLinks.removeClass("active").first().addClass("active");
        $tabPanes.removeClass("active").first().addClass("active");
        $tabLinks.on('click', function(e){
            e.preventDefault();
            var $activeLink = $(this);
            if(!$activeLink.hasClass("active")) {
                $tabLinks.removeClass("active");
                $activeLink.addClass("active");
                $tabPanes.removeClass("active").eq($activeLink.index()).addClass("active");
            }
        });
    });

    var $mainMenu = $("#main_menu"),
        $sectionLinks = $(".section_link"),
        mainMenuDefaultPos = $mainMenu.offset().top,
        mainMenuHeight = $mainMenu.height(),
        mainMenuFixed = false;

    function setMainMenuPosition() {
        var scrollTop = $("body").scrollTop();
        if(scrollTop >= mainMenuDefaultPos) {
            if(!mainMenuFixed){
                $mainMenu.addClass("fixed");
                mainMenuFixed = true;
            }
        } else {
            if(mainMenuFixed){
                $mainMenu.removeClass("fixed");
                mainMenuFixed = false;
            }
        }
    }

    function scroll2section(sectionID) {
        var $section = $("#section_" + sectionID),
            scrollPosition = $section.offset().top - mainMenuHeight;
        $("html,body").animate({
            scrollTop: scrollPosition,
            duration: 3000
        });
    }

    $(window).scroll(setMainMenuPosition);
    $sectionLinks.click(function(e){
        e.preventDefault();
        scroll2section($(this).attr("href").replace("#", ""));
    });

    $(".button_feedback").on("click", function(e){
        e.preventDefault();
        $.fancybox({
            href: '/popup_feedback.html',
            type: 'ajax',
            padding: 0,
            width: 472,
            closeBtn: false,
            wrapCSS: 'feedback_default',
            afterShow: function(){
                var $form = $("#popup_feedback_form"),
                    $popup = $(".popup_feedback");
                $form.ajaxForm({
                    beforeSubmit: function(arr){
                        $popup.addClass("load")
                    },
                    success: function(data){
                        $popup.removeClass("load").addClass("ok")
                    }
                });
            }
        });
    });

    $("body").on("click", ".fancybox_close", function(e){
        e.preventDefault();
        $.fancybox.close();
    })

});
