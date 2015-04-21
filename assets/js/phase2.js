(function($) {
    var navMenu = $('<nav><h2 class="hide"><i class="fa fa-reorder"></i>All Categories</h2></nav>').append($('ul.nav.primary').clone().removeAttr('class').append($('ul.nav.secondary>li').clone()).append($('<li></li>').append($('header .social-pages').clone())));
    //$('ul.dropdown-menu', navMenu).removeAttr('class');.wrap('<div class="mp-level"></div>');
    $('li', navMenu).removeAttr('class');
    $('ul.dropdown-menu', navMenu).each(function() {
        $(this).removeClass('dropdown-menu');
        $(this).parent().prepend('<h2>' + $(this).parent().find('.dropdown-toggle').text() + '</h2>');
        //$(this).parent().prepend('<a href="#" class="mp-back"><i class="fa fa-angle-left"></i> Back</a><h2>' + $(this).find('.dropdown-toggle').text() + '</h2>');
//        $(this).prepend('<h2>' + $(this).parent().find('.dropdown-toggle').text() + '</h2>');

    });
    $('li h2', navMenu).click(function() {
        var $parentLi = $(this).parent().parent(),
                location = $(' > a', $parentLi).attr('href');
        window.location = location;
    });
    $('#mp-menu').html('').append(navMenu);
//    new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
//        type: 'cover'
//    });
    $('#mp-menu').multilevelpushmenu({
        containersToPush: [$('#mp-pusher')],
        direction: 'rtl',
        backItemIcon: 'fa fa-angle-left',
        groupIcon: 'fa fa-angle-right',
        collapsed: true,
        mode: 'cover',
        //overlapWidth: 40,
        menuWidth: 260,
        //menuHeight: '100%',
        fullCollapse: true,
        onMenuReady: function() {
            $('#mp-menu li, #mp-menu h2').css('text-align', 'left');
            $('#mp-pusher').append('<a class="push-toggle" href="#"></a>');
        },
        onExpandMenuStart: function() {
            $('#mp-pusher').addClass('pushed');
        },
        onExpandMenuEnd: function() {
            $('#mp-pusher').addClass('expand');
        },
        onCollapseMenuStart: function() {

        },
        onCollapseMenuEnd: function() {
            var menuExpanded = $('#mp-menu').multilevelpushmenu('menuexpanded', $('#mp-menu').multilevelpushmenu('findmenusbytitle', 'All Categories').first());
            if (!menuExpanded)
                $('#mp-pusher').removeClass('pushed expand');
        }
        //mode: 'cover'
        // Just for fun also changing the look of the menu
        //wrapperClass: 'mlpm_w',
        //menuInactiveClass: 'mlpm_inactive'
    });
    $('#trigger, .push-toggle').click(function(e) {
        var menuExpanded = $('#mp-menu').multilevelpushmenu('menuexpanded', $('#mp-menu').multilevelpushmenu('findmenusbytitle', 'All Categories').first());
        $('#mp-menu').multilevelpushmenu(menuExpanded ? 'collapse' : 'expand');
        e.preventDefault();
    });

    var initialHeaderHeight = $('header').height(), initialHeaderWithNavHeight = $('header').height() + $('#top-nav').height();;
    var navScrollHandler = function() {
        var scrollTop = $(document).scrollTop(), $header = $('header'), $topNav = $('#top-nav'), $mobileNav = $('#mp-menu');
        if (scrollTop >= initialHeaderHeight) {
            $('.pg-container').css('margin-top', initialHeaderWithNavHeight + 'px');
            $header.addClass('fixed').delay(300).queue(function() {
                if ($(document).scrollTop() >= initialHeaderHeight) {
                    $header.addClass("animate").dequeue();
                    
                }
                else {
                    $header.removeClass('fixed').dequeue();
                    $('.pg-container').css('margin-top', '0');
                }
            });
            if ($('#mp-pusher').hasClass('pushed')) {
                var mobileTop = $mobileNav.offset().top;
                if (mobileTop - $header.height() > scrollTop)
                    $mobileNav.css('top', scrollTop + $header.height() - initialHeaderHeight);
            } else {
                $mobileNav.css('top', scrollTop + $header.height() - initialHeaderHeight);
            }
        } else {
            $header.removeClass('animate');
            $header.removeClass('fixed');
            $('.pg-container').css('margin-top', '0');
            $mobileNav.css('top', '0');
        }
    };
    navScrollHandler();
    $(document).scroll(function() {
        navScrollHandler();
    });
})(jQuery);