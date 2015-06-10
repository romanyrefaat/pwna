// ########################################
// ########## PAGE LOAD HANDLERS ##########
// ########################################
(function($) {
    var BASEURL = document.location.hostname == "localhost" ? '/' : window.location.protocol === 'https:' ? luminateExtend.global.path.secure + 'SPageServer/' : luminateExtend.global.path.nonsecure + 'PageServer/';
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    function equalHeights() {
        $('.story-list-item .caption').conformity({mode: 'height'});
        $('.equal-height').conformity({mode: 'height'});
//        $('.story-list-item .caption').matchHeight({
//            byRow: true,
//            property: 'height',
//            target: null,
//            remove: false
//        });
    }
    function headerNavHandlers() {
        var navMenu = $('<nav></nav>');
        navMenu.append($('<h2 class="hide"><i class="fa fa-reorder"></i>All Categories</h2>'));
        navMenu.append($('ul.nav.primary').clone().removeAttr('class').append($('ul.nav.secondary>li').clone()).append($('.js-search-panel').length > 0 ? $('<li></li>').append($('.js-search-panel form').clone()) : '').append($('<li></li>').append($('header .js-signup-form').clone())).append($('<li></li>').append($('header .social-pages').clone())));
        $('.js-signup-toggle', navMenu).remove();
        $('ul.dropdown-menu', navMenu).each(function() {
            $(this).parent().prepend('<h2>' + $(this).parent().find('.dropdown-toggle').text() + '</h2>');
            if ($(this).parent().hasClass('multi-column')) {
                $(this).replaceWith($(this).find('ul'));
            }
            $(this).removeClass('dropdown-menu');
        });
        $('li', navMenu).removeAttr('class');
        $('li h2', navMenu).click(function() {
            var $parentLi = $(this).parent().parent(),
                    location = $(' > a', $parentLi).attr('href');
            window.location = location;
        });
        $('#mp-menu').html('').append(navMenu);
        $('#mp-menu').multilevelpushmenu({
            containersToPush: [$('#mp-pusher')],
            direction: 'rtl',
            backItemIcon: 'fa fa-angle-left',
            groupIcon: 'fa fa-angle-right',
            collapsed: true,
            mode: 'cover',
            //preventGroupItemClick: false,
            preventItemClick: false,
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
        });
        $('#trigger, .push-toggle').click(function(e) {
            var menuExpanded = $('#mp-menu').multilevelpushmenu('menuexpanded', $('#mp-menu').multilevelpushmenu('findmenusbytitle', 'All Categories').first());
            $('#mp-menu').multilevelpushmenu(menuExpanded ? 'collapse' : 'expand');
            e.preventDefault();
        });

        var initialHeaderHeight = $('header').height(), initialHeaderWithNavHeight = $('header').height() + $('#top-nav').height();
        var navScrollHandler = function() {
            var scrollTop = $(document).scrollTop(), $header = $('header'), $topNav = $('#top-nav'), $mobileNav = $('#mp-menu');
            if (!$header.hasClass('p2'))
                return;
            if (scrollTop >= initialHeaderHeight) {
                $('.pg-container').css('margin-top', initialHeaderWithNavHeight + 'px');
                $header.addClass('fixed').delay(300).queue(function() {
                    if ($(document).scrollTop() >= initialHeaderHeight) {
                        $header.addClass("animate").dequeue();
                        $('body').addClass('fixed-header');
                    }
                    else {
                        $header.removeClass('fixed').dequeue();
                        $('.pg-container').css('margin-top', '0');
                        $('body').removeClass('fixed-header');
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
                $('body').removeClass('fixed-header');
                $mobileNav.css('top', '0');
            }
        };
        navScrollHandler();
        $(document).scroll(function() {
            //initialHeaderHeight = $('header').height();
            navScrollHandler();
        });
        $(window).resize(function() {
            //initialHeaderHeight = $('header').height();
        });

        // SEARCH & SIGN UP TOGGLE FORMS
        $('.js-search-toggle').click(function(e) {
            var panel = $(this).parent(), form = panel.find('form');
            form.css('width', function() {
                return Math.ceil($('.social-container').offset().left + $('.social-container').width() - $('.js-search-panel').offset().left - $('.js-search-panel').width());
            }).css('left', function() {
                var left = $('.js-search-panel').width() - $('header .site-search form').width();
                $(this).data('left', left);
                return left;
            });
            panel.toggleClass('expand');
            if (panel.hasClass('expand')) {
                form.css('left', $('.js-search-panel').width());
            } else {
                form.css('left', form.data('left'));
            }
            $('.js-signup-panel').removeClass('expand');
            e.preventDefault();
        });
        $('.js-signup-toggle').click(function(e) {
            $('.js-search-panel').removeClass('expand');
            $('.js-signup-panel').toggleClass('expand');
            e.preventDefault();
        });
    }
    function alertError(message) {
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_DANGER,
            title: '<i class="fa fa-times"></i> Error',
            message: message,
            buttons: [{
                    label: 'Ok',
                    cssClass: 'btn-danger',
                    action: function(dialogItself) {
                        dialogItself.close();
                    }
                }]
        });
    }
    function modal2Error(modal, message) {
        modal.enableButtons(true);
        modal.setClosable(true);
        $('.bootstrap-dialog').removeClass('type-info type-default').addClass('type-danger');
        $('.bootstrap-dialog-footer-buttons .btn').removeClass('btn-primary btn-default').addClass('btn-danger');
        $('.bootstrap-dialog-title').html('<i class="fa fa-times"></i> Error');
        $('.bootstrap-dialog-message').html(message);
    }
    function modal2Success(modal, message) {
        modal.enableButtons(true);
        modal.setClosable(true);
        $('.bootstrap-dialog').removeClass('type-info type-default').addClass('type-success');
        $('.bootstrap-dialog-footer-buttons .btn').removeClass('btn-danger btn-default').addClass('btn-primary');
        $('.bootstrap-dialog-title').html('<i class="fa fa-check"></i> Success');
        $('.bootstrap-dialog-message').html(message);
    }
    function resolvePWNAPageLinks() {
        if (getParameterByName("pagename") == 'pwna') {
            $('.page-content a[href*="?pagename"]').each(function() {
                var href = $(this).attr('href');
                href = href.replace('pagename=', 'pagename=pwna&page=');
                $(this).attr('href', href);
            });
        }
    }
    function pageUrlHashTab() {
        var hash = window.location.hash;
        hash && $('ul.nav a[href="' + hash + '"]').tab('show');
        if (hash && $('ul.nav a[href="' + hash + '"]')) {
            $('html, body').animate({
                scrollTop: $('ul.nav a[href="' + hash + '"]').parent().offset().top - $('header.fixed').height() - 5
            }, 200);
        }
    }
    $.fn.bindLuminateForm = function(options) {
        var settings = $.extend({
            onBeforeLuminateExtendSubmit: $.noop,
            customFormValidation: function() {
                return [];
            }
        }, options || {});
        var formElem = $(this);
        formElem.unbind('submit').bind('submit', function(e) {
            var hasErrors = false, errMessages = [];
            formElem.find('.required').each(function() {
                var fieldName = $(this).attr('name');
                $(this).parent().removeClass('has-error');
                $('label[for="' + fieldName + '"]').removeClass('error');
                if ($(this).attr('type') === 'radio') {
                    if (!$('input[name="' + fieldName + '"]:checked').val()) {
                        $('label[for="' + fieldName + '"]').addClass('error');
                        hasErrors = true;
                    }
                } else {
                    var fieldValue = $.trim($(this).val());
                    if (fieldValue === '') {
                        $(this).parent().addClass('has-error');
                        hasErrors = true;
                    }
                }
            });
            var customValidationErrors = luminateExtend.utils.ensureArray(settings.customFormValidation());
            if (customValidationErrors.length > 0) {
                hasErrors = true;
                errMessages.push.apply(errMessages, customValidationErrors);
            }
            if (hasErrors) {
                if (errMessages.length > 0) {
                    var errorsList;
                    if (errMessages.length > 1) {
                        errorsList = $('<ul></ul>');
                        for (var i = 0; i < errMessages.length; i++) {
                            errorsList.append($('<li class="text-danger">' + errMessages[i] + '</li>'));
                        }
                    } else {
                        errorsList = $('<div class="text-danger">' + errMessages[0] + '</div>');
                    }
                    alertError(errorsList);
                }
            } else {
                settings.onBeforeLuminateExtendSubmit();
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_INFO,
                    closable: false,
                    title: '<i class="fa fa-cog fa-spin"></i> Submitting your request',
                    message: 'Please wait ...',
                    buttons: [{
                            label: 'Close',
                            cssClass: 'btn-default',
                            action: function(dialogRef) {
                                dialogRef.close();
                            }
                        }],
                    onshown: function(dialogRef) {
                        window.luminateSubmitForm = formElem;
                        window.luminateSubmitDialog = dialogRef;
                        dialogRef.enableButtons(false);
                        formElem.unbind('submit');
                        luminateExtend.api.bind();
                        formElem.submit();
                    }
                });
            }
            e.preventDefault();
        });
        // Check auto submit class
        if (formElem.hasClass('auto-submit')) {
            formElem.submit();
        }
        return this;
    }
    $.fn.bindSignupForm = function() {
        var elem = $(this),
                form = elem.clone();
        elem.unbind('submit').bind('submit', function(e) {
            var emailValue = elem.find('input[name="cons_email"]').val();
            if ($.trim(emailValue) === '') {
                alertError('Please enter your email address.');
            } else if (emailValue.indexOf('@') === -1 || emailValue.indexOf('.') === -1) {
                alertError('Please enter a valid email address.');
            } else {
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_INFO,
                    closable: true,
                    title: 'Signup for our Email List',
                    message: function(dialogRef) {
                        var $message = $('<div></div>').append(form);
                        form.addClass('luminateApi form-horizontal').attr('action', luminateExtend.global.path.secure + 'CRSurveyAPI').attr('data-luminateApi', '{"callback": "emailSignupCallback", "requiresAuth": "true"}');
                        form.find('.js-step-1').addClass('hidden');
                        form.find('.js-step-2').removeClass('hidden');
                        form.find('.js-entered-email').text(emailValue);
                        form.find('input[name="cons_email"]').val(emailValue);
                        return $message;
                    },
                    buttons: [{
                            label: 'Sign me up',
                            cssClass: 'btn-primary',
                            action: function(dialogRef) {
                                form.bindLuminateForm({
                                    customFormValidation: function() {
                                        var errors = [];
                                        var firstNameValue = form.find('input[name="cons_first_name"]').val(),
                                                lastNameValue = form.find('input[name="cons_last_name"]').val();
                                        if ($.trim(firstNameValue) === '') {
                                            errors.push('Please enter your first name.');
                                        }
                                        if ($.trim(lastNameValue) === '') {
                                            errors.push('Please enter your last name.');
                                        }
                                        return errors;
                                    }
                                }).submit();
                            }
                        }],
                    onshown: function(dialogRef) {
                        window.luminateStep1Form = elem;
                        window.luminateStep2Dialog = dialogRef;
                    }
                });
            }
            e.preventDefault();
        });
        return this;
    }
    window.emailSignupCallback = {
        error: function(data) {
            //alertError(data.errorResponse.message);
            window.luminateStep2Dialog.close();
            modal2Error(window.luminateSubmitDialog, data.errorResponse.message);
        },
        success: function(data) {
            if (data.submitSurveyResponse.success == 'false') {
                var surveyErrors = luminateExtend.utils.ensureArray(data.submitSurveyResponse.errors),
                        errorMessage = '';
                $.each(surveyErrors, function() {
                    if (this.errorField) {
                        errorMessage += '<div>' + this.errorMessage + '</div>';
                    }
                });
                modal2Error(window.luminateSubmitDialog, errorMessage);
            }
            else {
                window.luminateStep2Dialog.close();
                window.luminateSubmitForm.get(0).reset();
                window.luminateStep1Form.get(0).reset();
                modal2Success(window.luminateSubmitDialog, 'Thank you for signing up!')
            }
            // TODO: Check if we remove sign up forms after submission
            window.luminateSubmitForm.bindSignupForm();
        }
    };
    headerNavHandlers();
    pageUrlHashTab();
    $('.js-signup-form').each(function() {
        $(this).bindSignupForm();
    });
    resolvePWNAPageLinks();
    $('input, textarea').placeholder();

    // Print freindly action
    $('.js-print-friendly').printPage();

    // Dialog toggle links
    //$('a.HelpLink').attr('data-toggle', 'dialog').data('target', 'ajax').removeClass('HelpLink');
    $('[data-toggle="dialog"]').click(function(e) {
        var elem = $(this);
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_INFO,
            title: elem.data('title'),
            message: function(dialog) {
                var $message = $('<div></div>');
                if (elem.data('target') === 'inline') {
                    $message.append($(elem.attr('href')).html());
                    return $message;
                }
                else if (elem.data('target') === 'ajax') {
                    $message.load(elem.attr('href'));
                    return $message;
                }
            }
        });
        e.preventDefault();
        e.stopPropagation();
    });
    // Announcement alert ..
    if ($.trim($('.announcement .box').html()).length) {
        $('.announcement').addClass('expand');
        $('.announcement .container-fluid').slideToggle('slow');
        $('.dismiss').click(function(e) {
            $('.announcement').fadeOut('fast', function() {
                $('.announcement').removeClass('expand');
            });
            e.preventDefault();
        });
    }
    if ($(window).width() > 769) {
        $('.navbar .dropdown > a').click(function() {
            location.href = this.href;
        });
    }
    // Fix payment type radio check due to .attr vs .prop
    $('.payment-type-option').click(function() {
        $(this).find('input').prop('checked', true);
    });

    // FAQ accordion
    $(".accordion-title").click(function() {
        $(".accordion-title").removeClass("active");
        $(".accordion-content").slideUp("normal");
        if ($(this).next().is(":hidden") == true) {
            $(this).addClass("active");
            $(this).next().slideDown("normal")
        }
    });
    $(".accordion-content").hide();

    //Addthis scroll Y fix
//    $('.addthis_button_compact, .addthis_bubble_style').mousemove(function(e) {
//        $('#at15s').css({
//            'top': e.pageY
//        });
//    });

    // jQuery RWD Image Maps
    $('img[usemap]').rwdImageMaps();

    $('.js-donate-programs').click(function(e) {
        e.preventDefault();
        //var contentLoaded = false, imagesLoaded = false;
        var loading = new BootstrapDialog({
            message: '<div class="text-center"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>',
            cssClass: 'donate-overlay',
            size: BootstrapDialog.SIZE_SMALL,
            closable: false,
            onshown: function(dialogRef) {
                var message = $('<div class="overlay-content"></div>').load(BASEURL + '?pagename=reus_pwna_programs&mode=donate&pgwrap=n', function() {
                    var close = $('<a class="btn-close" href="#"><span class="fa-stack fa-lg"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-close fa-stack-1x fa-inverse"></i></span></a>');
                    message.prepend('<h2>Make a Donation</h2>').prepend(close);
                    var dialog = new BootstrapDialog({
                        message: message,
                        size: BootstrapDialog.SIZE_WIDE,
                        cssClass: 'donate-overlay',
                        animate: false,
                        closable: false,
                        onshow: function(dialogRef) {
                            loading.close();
                        },
                        onshown: function(dialogRef) {
                            dialogRef.getMessage().find('.btn-close').on('click', {dialogRef: dialogRef}, function(event) {
                                event.data.dialogRef.close();
                                event.preventDefault();
                            });
                            equalHeights();
                        }
                    });
                    dialog.realize();
                    dialog.getModalHeader().hide();
                    dialog.getModalFooter().hide();
                    dialog.open();
                });
            }
        });
        loading.realize();
        loading.getModalHeader().hide();
        loading.getModalFooter().hide();
        loading.open();
    });

    // accordion expand collapse ico
    $('.collapse').on('shown.bs.collapse', function() {
        $(this).parent().find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
    }).on('hidden.bs.collapse', function() {
        $(this).parent().find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
    });
    $(window).bind("orientationchange resize", function(event) {
        equalHeights();
    }).trigger('resize');
})(jQuery);