$(function(){
    var visitTimer,
        obsessiveTimeout = 30000,
        obsessiveShown = false,
        $mainMenu = $("#main_menu"),
        $sectionLinks = $(".section_link"),
        mainMenuDefaultPos = $mainMenu.offset().top,
        mainMenuHeight = $mainMenu.height(),
        mainMenuFixed = false,
        $excellenceBanner = $('#excellence__banner'),
        sliderInterval = 4000,
        $datesSelectField = $(".dates_select_field")
    ;


    $("select").select2({
        minimumResultsForSearch: Infinity
    });
    $(".order_form select").select2({
        minimumResultsForSearch: Infinity,
        dropdownCssClass: 'order_form_dropdown'
    });
    $excellenceBanner.iosSlider({
        snapToChildren: true,
        desktopClickDrag: true,
        //autoSlide: true,
        //autoSlideTimer: sliderInterval,
        infiniteSlider: true
        //navPrevSelector: "#excellence__banner__prev",
        //navNextSelector: "#excellence__banner__next"
    });
    var slidesCount = $excellenceBanner.find(".slide").size(),
        currentSlide = 0,
        autoSlide;
    // да, это лютый трэшак, но в iosslider'е какой-то глюк.
    function startAutoSlide() {
        autoSlide = setInterval(function () {
            currentSlide++;
            $excellenceBanner.iosSlider("goToSlide", currentSlide % slidesCount);
        }, sliderInterval);
    }
    startAutoSlide();
    $("#excellence__banner__prev").click(function(){
        clearInterval(autoSlide);
        currentSlide--;
        $excellenceBanner.iosSlider("goToSlide", currentSlide % slidesCount);
        startAutoSlide();
    });
    $("#excellence__banner__next").click(function(){
        clearInterval(autoSlide);
        currentSlide++;
        $excellenceBanner.iosSlider("goToSlide", currentSlide % slidesCount);
        startAutoSlide();
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

    function _ajaxForm($form) {
        var $block = $form.closest(".form_container");
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
                    $block.addClass("load");
                }
                return validated;
            },
            success: function(data){
                $block.removeClass("load").addClass("ok")
            }
        });
    }

    _ajaxForm($(".simple_order_form"));

    function showObsessivePopup() {
        $.fancybox({
            href: '/popup_obsessive.html',
            type: 'ajax',
            padding: 0,
            width: 639,
            //closeBtn: false,
            wrapCSS: 'popup_obsessive',
            afterShow: function(){
                _ajaxForm($("#popup_obsessive_form"));
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

    function calendarInit($selector, $dateField) {

        var defaultMinDate = new Date(),
            currentYear = new Date().getFullYear(),
            selectedYear = currentYear,
            currentMonth = new Date().getMonth(),
            selectedMonth = currentMonth,
            $selectedYear = $selector.find(".selected_year"),
            $monthButton = $selector.find(".month_nav").children(),
            dateBegin = "",
            dateEnd = ""
            ;

        if(!$dateField) $dateField = $selector.find(".date_field");

        $selectedYear.text(selectedYear);

        var $calendar = $selector.find(".calendar__datepicker_holder").datepicker({
            minDate: defaultMinDate,

            beforeShowDay: function(date) {
                var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateBegin);
                var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateEnd);
                return [true, date1 && ((date.getTime() == date1.getTime()) || (date2 && date >= date1 && date <= date2)) ? "dp-highlight" : ""];
            },
            onSelect: function(dateText, inst) {
                var date1 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateBegin);
                var date2 = $.datepicker.parseDate($.datepicker._defaults.dateFormat, dateEnd);
                if (!date1 || date2) {
                    dateBegin = dateText;
                    dateEnd = "";
                    $dateField.val(dateBegin + " — ");
                    $(this).datepicker("option", "minDate", dateText);
                } else {
                    dateEnd = dateText;
                    $dateField.val(dateBegin + " — " + dateEnd);
                    $(this).datepicker("option", "minDate", defaultMinDate);
                }
            }
        });
        function setActiveMonth(number) {
            $monthButton.removeClass("selected").eq(number).addClass("selected");
            selectedMonth = number;
            $calendar.datepicker("setDate", new Date(selectedYear, selectedMonth, 1));
        }
        $selector.find(".year_action").on("click", function(){
            if($(this).hasClass("increase")) {
                selectedYear++;
            } else if($(this).hasClass("decrease")) {
                if(selectedYear > currentYear)
                    selectedYear--;
            }
            $selectedYear.text(selectedYear);
            $calendar.datepicker("setDate", new Date(selectedYear, selectedMonth, 1));
        });
        setActiveMonth(selectedMonth);
        $monthButton.click(function(){
            setActiveMonth($(this).index());
        });
        $selector.find(".calendar__nav_month_box").slimScroll({
            height: 244,
            width: 108,
            distance: 10,
            alwaysVisible: false
        });
    }

    $("#get_tour").click(function(){
        $.fancybox({
            href: '/popup_get_tour.html',
            type: 'ajax',
            padding: 0,
            width: 879,
            height: 681,
            //closeBtn: false,
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
                calendarInit($popupGetTour.find(".calendar"));
                $popupGetTour.find("select").select2({
                    minimumResultsForSearch: Infinity
                });
                $popupGetTour.find("input[type=checkbox], input[type=radio]").iCheck();

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
                _ajaxForm($popupGetTour);
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
            //closeBtn: false,
            fitToView: false,
            wrapCSS: 'feedback_default',
            scrolling: 'visible',
            afterShow: function () {
                _ajaxForm($("#popup_feedback_form"))
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
            //closeBtn: false,
            fitToView: false,
            wrapCSS: 'order',
            scrolling: 'visible',
            afterShow: function () {
                _ajaxForm($("#popup_feedback_form"))
            }
        });
        obsessiveShown = true;
    });
    calendarInit($(".order_form .calendar"), $datesSelectField);
    $(".order_form .calendar_panel .close").click(function(){
        $(".form_group.dates").removeClass("active");
    });

    $datesSelectField.on("focus", function(){
        $(this).closest(".form_group").addClass("active");
    });
    $(".form_group.dates").on("click", function(e){
        e.stopPropagation();
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
            $(".form_group.dates").removeClass("active");
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
