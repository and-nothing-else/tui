$(function(){
    var visitTimer,
        obsessiveTimeout = 30000,
        obsesssiveShown = false,
        $mainMenu = $("#main_menu"),
        $sectionLinks = $(".section_link"),
        mainMenuDefaultPos = $mainMenu.offset().top,
        mainMenuHeight = $mainMenu.height(),
        mainMenuFixed = false;


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

    function setMainMenuPosition() {
        var scrollTop = $(window).scrollTop();
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

    function _ajaxForm() {
        var $form = $("#popup_feedback_form"),
            $popup = $(".popup_feedback");
        $form.ajaxForm({
            beforeSubmit: function(arr){
                var validated = true;
                $form.find(".required").each(function(){
                    var $field = $(this).find("input,select,textarea");
                    if(!$field.val()) {
                        validated = false;
                        $(this).addClass("error")
                    }
                });
                if (validated) {
                    $popup.addClass("load");
                }
                return validated;
            },
            success: function(data){
                $popup.removeClass("load").addClass("ok")
            }
        });
    }

    function showObsessivePopup() {
        $.fancybox({
            href: '/popup_obsessive.html',
            type: 'ajax',
            padding: 0,
            width: 639,
            closeBtn: false,
            wrapCSS: 'popup_obsessive',
            afterShow: function(){
                var $form = $("#popup_obsessive_form"),
                    $popup = $(".popup_obsessive");
                $form.ajaxForm({
                    beforeSubmit: function(arr){
                        var validated = true;
                        $form.find(".required").each(function(){
                            var $field = $(this).find("input,select,textarea");
                            if(!$field.val()) {
                                validated = false;
                                $(this).addClass("error")
                            }
                        });
                        if (validated) {
                            $popup.addClass("load");
                        }
                        return validated;
                    },
                    success: function(data){
                        $popup.removeClass("load").addClass("ok")
                    }
                });
            }
        });
        obsesssiveShown = true;
    }
    visitTimer = setTimeout(showObsessivePopup, obsessiveTimeout);

    $(".button_feedback").on("click", function(e){
        e.preventDefault();
        $.fancybox({
            href: '/popup_feedback.html',
            type: 'ajax',
            padding: 0,
            width: 472,
            closeBtn: false,
            wrapCSS: 'feedback_default',
            scrolling: 'visible',
            afterShow: _ajaxForm
        });
    });
    $('.start_order').on("click", function(e) {
        e.preventDefault();
        $.fancybox({
            href: '/popup_order.html',
            type: 'ajax',
            padding: 0,
            width: 472,
            closeBtn: false,
            wrapCSS: 'order',
            scrolling: 'visible',
            afterShow: _ajaxForm
        });
    });


    $("body")
        .on("click", ".fancybox_close", function(e){
            e.preventDefault();
            $.fancybox.close();
        })
        .on("focus", "input", function(){
            $(this).closest(".form_group").removeClass("error")
        })
        .on("click", function(){
            clearTimeout(visitTimer);
            if(!obsesssiveShown)
                visitTimer = setTimeout(showObsessivePopup, obsessiveTimeout);
        })
        .on("click", "#po_yes", function(){
            var $popup = $("#popup_obsessive");
            $popup.find(".step1").removeClass("active");
            $popup.find(".popup_obsessive__step.step2").addClass("active yes");
        })
        .on("click", "#po_no", function(){
            var $popup = $("#popup_obsessive");
            $popup.find(".step1").removeClass("active");
            $popup.find(".popup_obsessive__step.step2").addClass("active no");
        })
    ;

});
