$(function(){
    var visitTimer,
        obsessiveTimeout = 30000,
        obsessiveShown = false,
        $mainMenu = $("#main_menu"),
        $sectionLinks = $(".section_link"),
        mainMenuDefaultPos = $mainMenu.offset().top,
        mainMenuHeight = $mainMenu.height(),
        mainMenuFixed = false;


    $("select").select2({
        minimumResultsForSearch: Infinity
    });
    $(".order_form select").select2({
        minimumResultsForSearch: Infinity,
        dropdownCssClass: 'order_form_dropdown'
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

    function _ajaxForm($form, $popup) {
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
                _ajaxForm($("#popup_obsessive_form"), $(".popup_obsessive"));
            }
        });
        obsessiveShown = true;
    }
    visitTimer = setTimeout(showObsessivePopup, obsessiveTimeout);

    function getTourSetStep(stepNumber) {
        var stepIndex = stepNumber - 1,
            $popupGetTourSteps = $("#popup_get_tour_steps"),
            $popupGetTourContent = $("#popup_get_tour_content"),
            $popupGetTourButtons = $("#popup_get_tour_buttons")
            ;

        $popupGetTourSteps.find(".step").removeClass("active");
        $popupGetTourSteps.find(".step:lt("+stepNumber+")").addClass("active");

        $popupGetTourContent.find(".step:lt("+stepIndex+")").removeClass("active").addClass("completed");
        $popupGetTourContent.find(".step:eq("+stepIndex+")").addClass("active").removeClass("completed");
        $popupGetTourContent.find(".step:gt("+stepIndex+")").removeClass("active completed");

        $popupGetTourButtons.find(".step:lt("+stepIndex+")").removeClass("active").addClass("completed");
        $popupGetTourButtons.find(".step:eq("+stepIndex+")").addClass("active").removeClass("completed");
        $popupGetTourButtons.find(".step:gt("+stepIndex+")").removeClass("active completed");
    }

    $("#get_tour").click(function(){
        $.fancybox({
            href: '/popup_get_tour.html',
            type: 'ajax',
            padding: 0,
            width: 879,
            height: 681,
            closeBtn: false,
            fitToView: false,
            wrapCSS: 'popup_get_tour',
            afterShow: function(){
                var currentStep = 1,
                    $popupGetTour = $("#popup_get_tour"),
                    $steps = $("#popup_get_tour_steps"),
                    $childBox = $("#child_box"),
                    $addChildContainer = $("#add_child_container")
                    ;
                $popupGetTour
                    .on("click", ".next", function(){
                        getTourSetStep(++currentStep);
                    })
                    .on("click", ".prev", function(){
                        getTourSetStep(--currentStep);
                    });
                $steps.on("click", ".step", function(){
                    currentStep = $(this).index() + 1;
                    getTourSetStep(currentStep);
                });
                $popupGetTour.find("select").select2({
                    minimumResultsForSearch: Infinity
                });
                $popupGetTour.find("input[type=checkbox], input[type=radio]").iCheck();
                $("#popup_get_tour_calendar").datepicker();

                function addChild(d) {
                    var $ch = $("<div/>").addClass("child out").text(d),
                        $close = $("<button type='button'/>").addClass("close").html("&times;");
                    $close.click(function(){
                        $ch.addClass("out");
                        setTimeout(function(){
                            $ch.detach();
                            $addChildContainer.removeClass('hidden');
                        }, 300);
                    });
                    $ch.append($close);
                    $childBox.append($ch);
                    setTimeout(function(){
                        $ch.removeClass("out");
                    }, 1);
                    return $childBox.children().size();
                }

                $("#addChild")
                    .select2({
                        minimumResultsForSearch: Infinity,
                        placeholder: "Добавить ребёнка"
                    })
                    .on("select2:select", function(e){
                        var numChild = addChild(e.target.value);
                        $(this).val(null).trigger('change');
                        if(numChild >= 3) {
                            $addChildContainer.addClass('hidden');
                        }
                    });

                getTourSetStep(currentStep);
                _ajaxForm($popupGetTour, $(".popup_get_tour"));
            }
        });
        obsessiveShown = true;
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
            scrolling: 'visible',
            afterShow: function () {
                _ajaxForm($("#popup_feedback_form"), $(".popup_feedback"))
            }
        });
        obsessiveShown = true;
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
            afterShow: function () {
                _ajaxForm($("#popup_feedback_form"), $(".popup_feedback"))
            }
        });
        obsessiveShown = true;
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
            if(!obsessiveShown)
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
        .on("click", ".number_field .action_button", function(){
            var $numberField = $(this).closest(".number_field"),
                $input = $numberField.find(".value"),
                value = parseInt($input.val());
            if(isNaN(value) || value < 1) value = 1;
            if($(this).hasClass("increase")){
                value++;
                $input.val(value);
            }
            if($(this).hasClass("decrease")){
                value--;
                if(value > 0) $input.val(value);
            }
        })
        .on("change keyup", ".number_field .value", function(){
            var value = parseInt($(this).val());
            if(isNaN(value) || value < 1) value = 1;
            $(this).val(value);
        })
    ;

});
