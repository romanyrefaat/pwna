(function($) {
    $.fn.printPage = function(options) {
// EXTEND options for this button
        var pluginOptions = {
            attr: "href",
            url: false,
            showMessage: true,
            message: "Please wait while we create your document",
            callback: null
        };
        $.extend(pluginOptions, options);
        this.on("click",
                function() {
                    loadPrintDocument(this, pluginOptions);
                    return false;
                });
        /**
         * Load & show message box, call iframe
         * @param {jQuery} el - The button calling the plugin
         * @param {Object} pluginOptions - options for this print button
         */
        function loadPrintDocument(el, pluginOptions) {
            if (pluginOptions.showMessage) {
                $("body").append(components.messageBox(pluginOptions.message));
                $("#printMessageBox").css("opacity", 0);
                $("#printMessageBox").animate({opacity: 1}, 300, function() {
                    addIframeToPage(el, pluginOptions);
                });
            } else {
                addIframeToPage(el, pluginOptions);
            }
        }
        /**
         * Inject iframe into document and attempt to hide, it, can't use display:none
         * You can't print if the element is not dsplayed
         * @param {jQuery} el - The button calling the plugin
         * @param {Object} pluginOptions - options for this print button
         */
        function addIframeToPage(el, pluginOptions) {
            var url = (pluginOptions.url) ? pluginOptions.url : $(el).attr(pluginOptions.attr);
            if (!$('#printPage')[0]) {
                $("body").append(components.iframe(url));
                $('#printPage').on("load", function() {
                    printit(pluginOptions);
                });
            } else {
                $('#printPage').attr("src", url);
            }
        }
        /*
         * Call the print browser functionnality, focus is needed for IE
         */
        function printit() {
            frames.printPage.focus();
            frames.printPage.print();
            if (pluginOptions.showMessage) {
                unloadMessage();
            }
            if ($.isFunction(pluginOptions.callback))
            {
                $.call(this, pluginOptions.callback);
            }
        }
        /*
         * Hide & Delete the message box with a small delay
         */
        function unloadMessage() {
            $("#printMessageBox").delay(1000).animate({opacity: 0}, 700, function() {
                $(this).remove();
            });
        }
        /*
         * Build html compononents for thois plugin
         */
        var components = {
            iframe: function(url) {
                return '<iframe id="printPage" name="printPage" src=' + url + ' style="display: none; @media print { display: block; }"></iframe>';
            },
            messageBox: function(message) {
                return "<div id='printMessageBox' style='\
position:fixed;\
top:50%; left:50%;\
text-align:center;\
margin: -60px 0 0 -155px;\
width:310px; font-size:16px; padding:10px 10px 100px; color:#222; z-index: 1000;\
opacity:0;\
background:#fff url(data:image/gif;base64,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) center bottom no-repeat;\
border: 6px solid #555;\
border-radius:8px; -webkit-border-radius:8px; -moz-border-radius:8px;\
box-shadow:0px 0px 10px #888; -webkit-box-shadow:0px 0px 10px #888; -moz-box-shadow:0px 0px 10px #888'>\
" + message + "</div>";
            }
        };
    };
    $.fn.rwdImageMaps = function() {
        var $img = this;
        var rwdImageMap = function() {
            $img.each(function() {
                if (typeof($(this).attr('usemap')) == 'undefined')
                    return;
                var that = this,
                        $that = $(that);
// Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
                $('<img />').load(function() {
                    var attrW = 'width',
                            attrH = 'height',
                            w = $that.attr(attrW),
                            h = $that.attr(attrH);
                    if (!w || !h) {
                        var temp = new Image();
                        temp.src = $that.attr('src');
                        if (!w)
                            w = temp.width;
                        if (!h)
                            h = temp.height;
                    }
                    var wPercent = $that.width() / 100,
                            hPercent = $that.height() / 100,
                            map = $that.attr('usemap').replace('#', ''),
                            c = 'coords';
                    if ($that.data('rollover')) {
                        if ($that.parent().find('.rollover').length === 0) {
                            //<img src="' + $that.data('rollover') + '"/>
                            var rollover = $('<a class="rollover hidden"></a>');
                            rollover.mouseout(function() {
                                $(this).addClass("hidden");
                            });
                            $that.parent().append(rollover);
                        }
                    }
                    $('map[name="' + map + '"]').find('area').each(function() {
                        var $this = $(this);
                        if (!$this.data(c))
                            $this.data(c, $this.attr(c));
                        var coords = $this.data(c).split(','),
                                coordsPercent = new Array(coords.length);
                        for (var i = 0; i < coordsPercent.length; ++i) {
                            if (i % 2 === 0)
                                coordsPercent[i] = parseInt(((coords[i] / w) * 100) * wPercent);
                            else
                                coordsPercent[i] = parseInt(((coords[i] / h) * 100) * hPercent);
                        }
                        $this.attr(c, coordsPercent.toString());
                        $this.hover(function() {
                            var rollover = $that.parent().find('.rollover');
                            rollover.css({
                                left: coordsPercent[0] + 'px',
                                top: coordsPercent[1] + 'px',
                                width: coordsPercent[2] - coordsPercent[0] + 'px',
                                height: coordsPercent[3] - coordsPercent[1] + 'px',
                                'background-size': $that.width() + 'px ' + $that.height() + 'px',
                                'background-position': coordsPercent[0] * -1 + 'px ' + coordsPercent[1] * -1 + 'px'
                            }).attr('href', $this.attr('href')).removeClass('hidden').toggleClass('dummy', $this.hasClass('dummy'));
                        });
                    });
                }).attr('src', $that.attr('src'));
            });
        };
        $(window).resize(rwdImageMap).trigger('resize');
        return this;
    };
})(jQuery);
// // // ########################################
// ########## PAGE LOAD HANDLERS ##########
// ########################################
(function($) {
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    function headerNavHandlers() {
        var navMenu = $('<nav><h2 class="hide"><i class="fa fa-reorder"></i>All Categories</h2></nav>').append($('ul.nav.primary').clone().removeAttr('class').append($('ul.nav.secondary>li').clone()).append($('<li></li>').append($('header .social-pages').clone())));
        $('li', navMenu).removeAttr('class');
        $('ul.dropdown-menu', navMenu).each(function() {
            $(this).removeClass('dropdown-menu');
            $(this).parent().prepend('<h2>' + $(this).parent().find('.dropdown-toggle').text() + '</h2>');
        });
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
            //initialHeaderHeight = $('header').height();
            navScrollHandler();
        });
        $(window).resize(function() {
            //initialHeaderHeight = $('header').height();
        });
        $('.js-search-toggle').click(function(e){
            $(this).parent().toggleClass('expand');
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
    $('.addthis_button_compact, .addthis_bubble_style').mousemove(function(e) {
        $('#at15s').css({
            'top': e.pageY
        });
    });

    // jQuery RWD Image Maps
    $('img[usemap]').rwdImageMaps();
})(jQuery);