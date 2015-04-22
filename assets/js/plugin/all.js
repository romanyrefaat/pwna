/*! http://mths.be/placeholder v2.1.1 by @mathias */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = $.fn.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        var settings = {};

        placeholder = $.fn.placeholder = function(options) {

            var defaults = {customClass: 'placeholder'};
            settings = $.extend({}, defaults, options);

            var $this = this;
            $this
                    .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                    .not('.' + settings.customClass)
                    .bind({
                'focus.placeholder': clearPlaceholder,
                'blur.placeholder': setPlaceholder
            })
                    .data('placeholder-enabled', true)
                    .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }

                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value === '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass(settings.customClass)) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.' + settings.customClass, this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.' + settings.customClass).each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass(settings.customClass)) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass(settings.customClass);
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value === '') {
            if (input.type === 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({'type': 'text'});
                    } catch (e) {
                        $replacement = $('<input>').attr($.extend(args(this), {'type': 'text'}));
                    }
                    $replacement
                            .removeAttr('name')
                            .data({
                        'placeholder-password': $input,
                        'placeholder-id': id
                    })
                            .bind('focus.placeholder', clearPlaceholder);
                    $input
                            .data({
                        'placeholder-textinput': $replacement,
                        'placeholder-id': id
                    })
                            .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass(settings.customClass);
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass(settings.customClass);
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        // https://github.com/mathiasbynens/jquery-placeholder/pull/99
        try {
            return document.activeElement;
        } catch (exception) {
        }
    }
}));
// ################################## //
// ################################## //
// ################################## //
// ################################## //
/* global define */

/* ================================================
 * Make use of Bootstrap's modal more monkey-friendly.
 *
 * For Bootstrap 3.
 *
 * javanoob@hotmail.com
 *
 * https://github.com/nakupanda/bootstrap3-dialog
 *
 * Licensed under The MIT License.
 * ================================================ */
(function(root, factory) {

    "use strict";

    // CommonJS module is defined
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery')(root));
    }
    // AMD module is defined
    else if (typeof define === "function" && define.amd) {
        define("bootstrap-dialog", ["jquery"], function($) {
            return factory($);
        });
    } else {
        // planted over the root!
        root.BootstrapDialog = factory(root.jQuery);
    }

}(this, function($) {

    "use strict";

    /* ================================================
     * Definition of BootstrapDialogModal.
     * Extend Bootstrap Modal and override some functions.
     * BootstrapDialogModal === Modified Modal.
     * ================================================ */
    var Modal = $.fn.modal.Constructor;
    var BootstrapDialogModal = function(element, options) {
        Modal.call(this, element, options);
    };
    BootstrapDialogModal.getModalVersion = function() {
        var version = null;
        if (typeof $.fn.modal.Constructor.VERSION === 'undefined') {
            version = 'v3.1';
        } else if (/3\.2\.\d+/.test($.fn.modal.Constructor.VERSION)) {
            version = 'v3.2';
        } else {
            version = 'v3.3';  // v3.3+
        }

        return version;
    };
    BootstrapDialogModal.ORIGINAL_BODY_PADDING = $('body').css('padding-right') || 0;
    BootstrapDialogModal.METHODS_TO_OVERRIDE = {};
    BootstrapDialogModal.METHODS_TO_OVERRIDE['v3.1'] = {};
    BootstrapDialogModal.METHODS_TO_OVERRIDE['v3.2'] = {
        hide: function(e) {
            if (e) {
                e.preventDefault();
            }
            e = $.Event('hide.bs.modal');

            this.$element.trigger(e);

            if (!this.isShown || e.isDefaultPrevented()) {
                return;
            }

            this.isShown = false;

            // Remove css class 'modal-open' when the last opened dialog is closing.
            var openedDialogs = this.getGlobalOpenedDialogs();
            if (openedDialogs.length === 0) {
                this.$body.removeClass('modal-open');
            }

            this.resetScrollbar();
            this.escape();

            $(document).off('focusin.bs.modal');

            this.$element
                    .removeClass('in')
                    .attr('aria-hidden', true)
                    .off('click.dismiss.bs.modal');

            $.support.transition && this.$element.hasClass('fade') ?
                    this.$element
                    .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                    .emulateTransitionEnd(300) :
                    this.hideModal();
        }
    };
    BootstrapDialogModal.METHODS_TO_OVERRIDE['v3.3'] = {
        /**
         * Overrided.
         * 
         * @returns {undefined}
         */
        setScrollbar: function() {
            var bodyPad = BootstrapDialogModal.ORIGINAL_BODY_PADDING;
            if (this.bodyIsOverflowing) {
                this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
            }
        },
        /**
         * Overrided.
         * 
         * @returns {undefined}
         */
        resetScrollbar: function() {
            var openedDialogs = this.getGlobalOpenedDialogs();
            if (openedDialogs.length === 0) {
                this.$body.css('padding-right', BootstrapDialogModal.ORIGINAL_BODY_PADDING);
            }
        },
        /**
         * Overrided.
         * 
         * @returns {undefined}
         */
        hideModal: function() {
            this.$element.hide();
            this.backdrop($.proxy(function() {
                var openedDialogs = this.getGlobalOpenedDialogs();
                if (openedDialogs.length === 0) {
                    this.$body.removeClass('modal-open');
                }
                this.resetAdjustments();
                this.resetScrollbar();
                this.$element.trigger('hidden.bs.modal');
            }, this));
        }
    };
    BootstrapDialogModal.prototype = {
        constructor: BootstrapDialogModal,
        /**
         * New function, to get the dialogs that opened by BootstrapDialog.
         * 
         * @returns {undefined}
         */
        getGlobalOpenedDialogs: function() {
            var openedDialogs = [];
            $.each(BootstrapDialog.dialogs, function(id, dialogInstance) {
                if (dialogInstance.isRealized() && dialogInstance.isOpened()) {
                    openedDialogs.push(dialogInstance);
                }
            });

            return openedDialogs;
        }
    };

    // Add compatible methods.
    BootstrapDialogModal.prototype = $.extend(BootstrapDialogModal.prototype, Modal.prototype, BootstrapDialogModal.METHODS_TO_OVERRIDE[BootstrapDialogModal.getModalVersion()]);

    /* ================================================
     * Definition of BootstrapDialog.
     * ================================================ */
    var BootstrapDialog = function(options) {
        this.defaultOptions = $.extend(true, {
            id: BootstrapDialog.newGuid(),
            buttons: [],
            data: {},
            onshow: null,
            onshown: null,
            onhide: null,
            onhidden: null
        }, BootstrapDialog.defaultOptions);
        this.indexedButtons = {};
        this.registeredButtonHotkeys = {};
        this.draggableData = {
            isMouseDown: false,
            mouseOffset: {}
        };
        this.realized = false;
        this.opened = false;
        this.initOptions(options);
        this.holdThisInstance();
    };

    /**
     *  Some constants.
     */
    BootstrapDialog.NAMESPACE = 'bootstrap-dialog';

    BootstrapDialog.TYPE_DEFAULT = 'type-default';
    BootstrapDialog.TYPE_INFO = 'type-info';
    BootstrapDialog.TYPE_PRIMARY = 'type-primary';
    BootstrapDialog.TYPE_SUCCESS = 'type-success';
    BootstrapDialog.TYPE_WARNING = 'type-warning';
    BootstrapDialog.TYPE_DANGER = 'type-danger';

    BootstrapDialog.DEFAULT_TEXTS = {};
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DEFAULT] = 'Information';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_INFO] = 'Information';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_PRIMARY] = 'Information';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_SUCCESS] = 'Success';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_WARNING] = 'Warning';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DANGER] = 'Danger';
    BootstrapDialog.DEFAULT_TEXTS['OK'] = 'OK';
    BootstrapDialog.DEFAULT_TEXTS['CANCEL'] = 'Cancel';

    BootstrapDialog.SIZE_NORMAL = 'size-normal';
    BootstrapDialog.SIZE_SMALL = 'size-small';
    BootstrapDialog.SIZE_WIDE = 'size-wide';    // size-wide is equal to modal-lg
    BootstrapDialog.SIZE_LARGE = 'size-large';

    BootstrapDialog.BUTTON_SIZES = {};
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_NORMAL] = '';
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_SMALL] = '';
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_WIDE] = '';
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_LARGE] = 'btn-lg';

    BootstrapDialog.ICON_SPINNER = 'glyphicon glyphicon-asterisk';

    /**
     * Default options.
     */
    BootstrapDialog.defaultOptions = {
        type: BootstrapDialog.TYPE_PRIMARY,
        size: BootstrapDialog.SIZE_NORMAL,
        cssClass: '',
        title: null,
        message: null,
        nl2br: true,
        closable: true,
        closeByBackdrop: true,
        closeByKeyboard: true,
        spinicon: BootstrapDialog.ICON_SPINNER,
        autodestroy: true,
        draggable: false,
        animate: true,
        description: ''
    };

    /**
     * Config default options.
     */
    BootstrapDialog.configDefaultOptions = function(options) {
        BootstrapDialog.defaultOptions = $.extend(true, BootstrapDialog.defaultOptions, options);
    };

    /**
     * Open / Close all created dialogs all at once.
     */
    BootstrapDialog.dialogs = {};
    BootstrapDialog.openAll = function() {
        $.each(BootstrapDialog.dialogs, function(id, dialogInstance) {
            dialogInstance.open();
        });
    };
    BootstrapDialog.closeAll = function() {
        $.each(BootstrapDialog.dialogs, function(id, dialogInstance) {
            dialogInstance.close();
        });
    };

    /**
     * Move focus to next visible dialog.
     */
    BootstrapDialog.moveFocus = function() {
        var lastDialogInstance = null;
        $.each(BootstrapDialog.dialogs, function(id, dialogInstance) {
            lastDialogInstance = dialogInstance;
        });
        if (lastDialogInstance !== null && lastDialogInstance.isRealized()) {
            lastDialogInstance.getModal().focus();
        }
    };

    BootstrapDialog.METHODS_TO_OVERRIDE = {};
    BootstrapDialog.METHODS_TO_OVERRIDE['v3.1'] = {
        handleModalBackdropEvent: function() {
            this.getModal().on('click', {dialog: this}, function(event) {
                event.target === this && event.data.dialog.isClosable() && event.data.dialog.canCloseByBackdrop() && event.data.dialog.close();
            });

            return this;
        },
        /**
         * To make multiple opened dialogs look better.
         * 
         * Will be removed in later version, after Bootstrap Modal >= 3.3.0, updating z-index is unnecessary.
         */
        updateZIndex: function() {
            var zIndexBackdrop = 1040;
            var zIndexModal = 1050;
            var dialogCount = 0;
            $.each(BootstrapDialog.dialogs, function(dialogId, dialogInstance) {
                dialogCount++;
            });
            var $modal = this.getModal();
            var $backdrop = $modal.data('bs.modal').$backdrop;
            $modal.css('z-index', zIndexModal + (dialogCount - 1) * 20);
            $backdrop.css('z-index', zIndexBackdrop + (dialogCount - 1) * 20);

            return this;
        },
        open: function() {
            !this.isRealized() && this.realize();
            this.getModal().modal('show');
            this.updateZIndex();
            this.setOpened(true);

            return this;
        }
    };
    BootstrapDialog.METHODS_TO_OVERRIDE['v3.2'] = {
        handleModalBackdropEvent: BootstrapDialog.METHODS_TO_OVERRIDE['v3.1']['handleModalBackdropEvent'],
        updateZIndex: BootstrapDialog.METHODS_TO_OVERRIDE['v3.1']['updateZIndex'],
        open: BootstrapDialog.METHODS_TO_OVERRIDE['v3.1']['open']
    };
    BootstrapDialog.METHODS_TO_OVERRIDE['v3.3'] = {};
    BootstrapDialog.prototype = {
        constructor: BootstrapDialog,
        initOptions: function(options) {
            this.options = $.extend(true, this.defaultOptions, options);

            return this;
        },
        holdThisInstance: function() {
            BootstrapDialog.dialogs[this.getId()] = this;

            return this;
        },
        initModalStuff: function() {
            this.setModal(this.createModal())
                    .setModalDialog(this.createModalDialog())
                    .setModalContent(this.createModalContent())
                    .setModalHeader(this.createModalHeader())
                    .setModalBody(this.createModalBody())
                    .setModalFooter(this.createModalFooter());

            this.getModal().append(this.getModalDialog());
            this.getModalDialog().append(this.getModalContent());
            this.getModalContent()
                    .append(this.getModalHeader())
                    .append(this.getModalBody())
                    .append(this.getModalFooter());

            return this;
        },
        createModal: function() {
            var $modal = $('<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"></div>');
            $modal.prop('id', this.getId()).attr('aria-labelledby', this.getId() + '_title');

            return $modal;
        },
        getModal: function() {
            return this.$modal;
        },
        setModal: function($modal) {
            this.$modal = $modal;

            return this;
        },
        createModalDialog: function() {
            return $('<div class="modal-dialog"></div>');
        },
        getModalDialog: function() {
            return this.$modalDialog;
        },
        setModalDialog: function($modalDialog) {
            this.$modalDialog = $modalDialog;

            return this;
        },
        createModalContent: function() {
            return $('<div class="modal-content"></div>');
        },
        getModalContent: function() {
            return this.$modalContent;
        },
        setModalContent: function($modalContent) {
            this.$modalContent = $modalContent;

            return this;
        },
        createModalHeader: function() {
            return $('<div class="modal-header"></div>');
        },
        getModalHeader: function() {
            return this.$modalHeader;
        },
        setModalHeader: function($modalHeader) {
            this.$modalHeader = $modalHeader;

            return this;
        },
        createModalBody: function() {
            return $('<div class="modal-body"></div>');
        },
        getModalBody: function() {
            return this.$modalBody;
        },
        setModalBody: function($modalBody) {
            this.$modalBody = $modalBody;

            return this;
        },
        createModalFooter: function() {
            return $('<div class="modal-footer"></div>');
        },
        getModalFooter: function() {
            return this.$modalFooter;
        },
        setModalFooter: function($modalFooter) {
            this.$modalFooter = $modalFooter;

            return this;
        },
        createDynamicContent: function(rawContent) {
            var content = null;
            if (typeof rawContent === 'function') {
                content = rawContent.call(rawContent, this);
            } else {
                content = rawContent;
            }
            if (typeof content === 'string') {
                content = this.formatStringContent(content);
            }

            return content;
        },
        formatStringContent: function(content) {
            if (this.options.nl2br) {
                return content.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
            }

            return content;
        },
        setData: function(key, value) {
            this.options.data[key] = value;

            return this;
        },
        getData: function(key) {
            return this.options.data[key];
        },
        setId: function(id) {
            this.options.id = id;

            return this;
        },
        getId: function() {
            return this.options.id;
        },
        getType: function() {
            return this.options.type;
        },
        setType: function(type) {
            this.options.type = type;
            this.updateType();

            return this;
        },
        updateType: function() {
            if (this.isRealized()) {
                var types = [BootstrapDialog.TYPE_DEFAULT,
                    BootstrapDialog.TYPE_INFO,
                    BootstrapDialog.TYPE_PRIMARY,
                    BootstrapDialog.TYPE_SUCCESS,
                    BootstrapDialog.TYPE_WARNING,
                    BootstrapDialog.TYPE_DANGER];

                this.getModal().removeClass(types.join(' ')).addClass(this.getType());
            }

            return this;
        },
        getSize: function() {
            return this.options.size;
        },
        setSize: function(size) {
            this.options.size = size;
            this.updateSize();

            return this;
        },
        updateSize: function() {
            if (this.isRealized()) {
                var dialog = this;

                // Dialog size
                this.getModal().removeClass(BootstrapDialog.SIZE_NORMAL)
                        .removeClass(BootstrapDialog.SIZE_SMALL)
                        .removeClass(BootstrapDialog.SIZE_WIDE)
                        .removeClass(BootstrapDialog.SIZE_LARGE);
                this.getModal().addClass(this.getSize());

                // Smaller dialog.
                this.getModalDialog().removeClass('modal-sm');
                if (this.getSize() === BootstrapDialog.SIZE_SMALL) {
                    this.getModalDialog().addClass('modal-sm');
                }

                // Wider dialog.
                this.getModalDialog().removeClass('modal-lg');
                if (this.getSize() === BootstrapDialog.SIZE_WIDE) {
                    this.getModalDialog().addClass('modal-lg');
                }

                // Button size
                $.each(this.options.buttons, function(index, button) {
                    var $button = dialog.getButton(button.id);
                    var buttonSizes = ['btn-lg', 'btn-sm', 'btn-xs'];
                    var sizeClassSpecified = false;
                    if (typeof button['cssClass'] === 'string') {
                        var btnClasses = button['cssClass'].split(' ');
                        $.each(btnClasses, function(index, btnClass) {
                            if ($.inArray(btnClass, buttonSizes) !== -1) {
                                sizeClassSpecified = true;
                            }
                        });
                    }
                    if (!sizeClassSpecified) {
                        $button.removeClass(buttonSizes.join(' '));
                        $button.addClass(dialog.getButtonSize());
                    }
                });
            }

            return this;
        },
        getCssClass: function() {
            return this.options.cssClass;
        },
        setCssClass: function(cssClass) {
            this.options.cssClass = cssClass;

            return this;
        },
        getTitle: function() {
            return this.options.title;
        },
        setTitle: function(title) {
            this.options.title = title;
            this.updateTitle();

            return this;
        },
        updateTitle: function() {
            if (this.isRealized()) {
                var title = this.getTitle() !== null ? this.createDynamicContent(this.getTitle()) : this.getDefaultText();
                this.getModalHeader().find('.' + this.getNamespace('title')).html('').append(title).prop('id', this.getId() + '_title');
            }

            return this;
        },
        getMessage: function() {
            return this.options.message;
        },
        setMessage: function(message) {
            this.options.message = message;
            this.updateMessage();

            return this;
        },
        updateMessage: function() {
            if (this.isRealized()) {
                var message = this.createDynamicContent(this.getMessage());
                this.getModalBody().find('.' + this.getNamespace('message')).html('').append(message);
            }

            return this;
        },
        isClosable: function() {
            return this.options.closable;
        },
        setClosable: function(closable) {
            this.options.closable = closable;
            this.updateClosable();

            return this;
        },
        setCloseByBackdrop: function(closeByBackdrop) {
            this.options.closeByBackdrop = closeByBackdrop;

            return this;
        },
        canCloseByBackdrop: function() {
            return this.options.closeByBackdrop;
        },
        setCloseByKeyboard: function(closeByKeyboard) {
            this.options.closeByKeyboard = closeByKeyboard;

            return this;
        },
        canCloseByKeyboard: function() {
            return this.options.closeByKeyboard;
        },
        isAnimate: function() {
            return this.options.animate;
        },
        setAnimate: function(animate) {
            this.options.animate = animate;

            return this;
        },
        updateAnimate: function() {
            if (this.isRealized()) {
                this.getModal().toggleClass('fade', this.isAnimate());
            }

            return this;
        },
        getSpinicon: function() {
            return this.options.spinicon;
        },
        setSpinicon: function(spinicon) {
            this.options.spinicon = spinicon;

            return this;
        },
        addButton: function(button) {
            this.options.buttons.push(button);

            return this;
        },
        addButtons: function(buttons) {
            var that = this;
            $.each(buttons, function(index, button) {
                that.addButton(button);
            });

            return this;
        },
        getButtons: function() {
            return this.options.buttons;
        },
        setButtons: function(buttons) {
            this.options.buttons = buttons;
            this.updateButtons();

            return this;
        },
        /**
         * If there is id provided for a button option, it will be in dialog.indexedButtons list.
         *
         * In that case you can use dialog.getButton(id) to find the button.
         *
         * @param {type} id
         * @returns {undefined}
         */
        getButton: function(id) {
            if (typeof this.indexedButtons[id] !== 'undefined') {
                return this.indexedButtons[id];
            }

            return null;
        },
        getButtonSize: function() {
            if (typeof BootstrapDialog.BUTTON_SIZES[this.getSize()] !== 'undefined') {
                return BootstrapDialog.BUTTON_SIZES[this.getSize()];
            }

            return '';
        },
        updateButtons: function() {
            if (this.isRealized()) {
                if (this.getButtons().length === 0) {
                    this.getModalFooter().hide();
                } else {
                    this.getModalFooter().find('.' + this.getNamespace('footer')).html('').append(this.createFooterButtons());
                }
            }

            return this;
        },
        isAutodestroy: function() {
            return this.options.autodestroy;
        },
        setAutodestroy: function(autodestroy) {
            this.options.autodestroy = autodestroy;
        },
        getDescription: function() {
            return this.options.description;
        },
        setDescription: function(description) {
            this.options.description = description;

            return this;
        },
        getDefaultText: function() {
            return BootstrapDialog.DEFAULT_TEXTS[this.getType()];
        },
        getNamespace: function(name) {
            return BootstrapDialog.NAMESPACE + '-' + name;
        },
        createHeaderContent: function() {
            var $container = $('<div></div>');
            $container.addClass(this.getNamespace('header'));

            // title
            $container.append(this.createTitleContent());

            // Close button
            $container.prepend(this.createCloseButton());

            return $container;
        },
        createTitleContent: function() {
            var $title = $('<div></div>');
            $title.addClass(this.getNamespace('title'));

            return $title;
        },
        createCloseButton: function() {
            var $container = $('<div></div>');
            $container.addClass(this.getNamespace('close-button'));
            var $icon = $('<button class="close">&times;</button>');
            $container.append($icon);
            $container.on('click', {dialog: this}, function(event) {
                event.data.dialog.close();
            });

            return $container;
        },
        createBodyContent: function() {
            var $container = $('<div></div>');
            $container.addClass(this.getNamespace('body'));

            // Message
            $container.append(this.createMessageContent());

            return $container;
        },
        createMessageContent: function() {
            var $message = $('<div></div>');
            $message.addClass(this.getNamespace('message'));

            return $message;
        },
        createFooterContent: function() {
            var $container = $('<div></div>');
            $container.addClass(this.getNamespace('footer'));

            return $container;
        },
        createFooterButtons: function() {
            var that = this;
            var $container = $('<div></div>');
            $container.addClass(this.getNamespace('footer-buttons'));
            this.indexedButtons = {};
            $.each(this.options.buttons, function(index, button) {
                if (!button.id) {
                    button.id = BootstrapDialog.newGuid();
                }
                var $button = that.createButton(button);
                that.indexedButtons[button.id] = $button;
                $container.append($button);
            });

            return $container;
        },
        createButton: function(button) {
            var $button = $('<button class="btn"></button>');
            $button.prop('id', button.id);

            // Icon
            if (typeof button.icon !== 'undefined' && $.trim(button.icon) !== '') {
                $button.append(this.createButtonIcon(button.icon));
            }

            // Label
            if (typeof button.label !== 'undefined') {
                $button.append(button.label);
            }

            // Css class
            if (typeof button.cssClass !== 'undefined' && $.trim(button.cssClass) !== '') {
                $button.addClass(button.cssClass);
            } else {
                $button.addClass('btn-default');
            }

            // Hotkey
            if (typeof button.hotkey !== 'undefined') {
                this.registeredButtonHotkeys[button.hotkey] = $button;
            }

            // Button on click
            $button.on('click', {dialog: this, $button: $button, button: button}, function(event) {
                var dialog = event.data.dialog;
                var $button = event.data.$button;
                var button = event.data.button;
                if (typeof button.action === 'function') {
                    button.action.call($button, dialog);
                }

                if (button.autospin) {
                    $button.toggleSpin(true);
                }
            });

            // Dynamically add extra functions to $button
            this.enhanceButton($button);

            return $button;
        },
        /**
         * Dynamically add extra functions to $button
         *
         * Using '$this' to reference 'this' is just for better readability.
         *
         * @param {type} $button
         * @returns {_L13.BootstrapDialog.prototype}
         */
        enhanceButton: function($button) {
            $button.dialog = this;

            // Enable / Disable
            $button.toggleEnable = function(enable) {
                var $this = this;
                if (typeof enable !== 'undefined') {
                    $this.prop("disabled", !enable).toggleClass('disabled', !enable);
                } else {
                    $this.prop("disabled", !$this.prop("disabled"));
                }

                return $this;
            };
            $button.enable = function() {
                var $this = this;
                $this.toggleEnable(true);

                return $this;
            };
            $button.disable = function() {
                var $this = this;
                $this.toggleEnable(false);

                return $this;
            };

            // Icon spinning, helpful for indicating ajax loading status.
            $button.toggleSpin = function(spin) {
                var $this = this;
                var dialog = $this.dialog;
                var $icon = $this.find('.' + dialog.getNamespace('button-icon'));
                if (typeof spin === 'undefined') {
                    spin = !($button.find('.icon-spin').length > 0);
                }
                if (spin) {
                    $icon.hide();
                    $button.prepend(dialog.createButtonIcon(dialog.getSpinicon()).addClass('icon-spin'));
                } else {
                    $icon.show();
                    $button.find('.icon-spin').remove();
                }

                return $this;
            };
            $button.spin = function() {
                var $this = this;
                $this.toggleSpin(true);

                return $this;
            };
            $button.stopSpin = function() {
                var $this = this;
                $this.toggleSpin(false);

                return $this;
            };

            return this;
        },
        createButtonIcon: function(icon) {
            var $icon = $('<span></span>');
            $icon.addClass(this.getNamespace('button-icon')).addClass(icon);

            return $icon;
        },
        /**
         * Invoke this only after the dialog is realized.
         *
         * @param {type} enable
         * @returns {undefined}
         */
        enableButtons: function(enable) {
            $.each(this.indexedButtons, function(id, $button) {
                $button.toggleEnable(enable);
            });

            return this;
        },
        /**
         * Invoke this only after the dialog is realized.
         *
         * @returns {undefined}
         */
        updateClosable: function() {
            if (this.isRealized()) {
                // Close button
                this.getModalHeader().find('.' + this.getNamespace('close-button')).toggle(this.isClosable());
            }

            return this;
        },
        /**
         * Set handler for modal event 'show.bs.modal'.
         * This is a setter!
         */
        onShow: function(onshow) {
            this.options.onshow = onshow;

            return this;
        },
        /**
         * Set handler for modal event 'shown.bs.modal'.
         * This is a setter!
         */
        onShown: function(onshown) {
            this.options.onshown = onshown;

            return this;
        },
        /**
         * Set handler for modal event 'hide.bs.modal'.
         * This is a setter!
         */
        onHide: function(onhide) {
            this.options.onhide = onhide;

            return this;
        },
        /**
         * Set handler for modal event 'hidden.bs.modal'.
         * This is a setter!
         */
        onHidden: function(onhidden) {
            this.options.onhidden = onhidden;

            return this;
        },
        isRealized: function() {
            return this.realized;
        },
        setRealized: function(realized) {
            this.realized = realized;

            return this;
        },
        isOpened: function() {
            return this.opened;
        },
        setOpened: function(opened) {
            this.opened = opened;

            return this;
        },
        handleModalEvents: function() {
            this.getModal().on('show.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                if (dialog.isModalEvent(event) && typeof dialog.options.onshow === 'function') {
                    return dialog.options.onshow(dialog);
                }
            });
            this.getModal().on('shown.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                dialog.isModalEvent(event) && typeof dialog.options.onshown === 'function' && dialog.options.onshown(dialog);
            });
            this.getModal().on('hide.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                if (dialog.isModalEvent(event) && typeof dialog.options.onhide === 'function') {
                    return dialog.options.onhide(dialog);
                }
            });
            this.getModal().on('hidden.bs.modal', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                dialog.isModalEvent(event) && typeof dialog.options.onhidden === 'function' && dialog.options.onhidden(dialog);
                dialog.isAutodestroy() && $(this).remove();
                BootstrapDialog.moveFocus();
            });

            // Backdrop, I did't find a way to change bs3 backdrop option after the dialog is popped up, so here's a new wheel.
            this.handleModalBackdropEvent();

            // ESC key support
            this.getModal().on('keyup', {dialog: this}, function(event) {
                event.which === 27 && event.data.dialog.isClosable() && event.data.dialog.canCloseByKeyboard() && event.data.dialog.close();
            });

            // Button hotkey
            this.getModal().on('keyup', {dialog: this}, function(event) {
                var dialog = event.data.dialog;
                if (typeof dialog.registeredButtonHotkeys[event.which] !== 'undefined') {
                    var $button = $(dialog.registeredButtonHotkeys[event.which]);
                    !$button.prop('disabled') && $button.focus().trigger('click');
                }
            });

            return this;
        },
        handleModalBackdropEvent: function() {
            this.getModal().on('click', {dialog: this}, function(event) {
                $(event.target).hasClass('modal-backdrop') && event.data.dialog.isClosable() && event.data.dialog.canCloseByBackdrop() && event.data.dialog.close();
            });

            return this;
        },
        isModalEvent: function(event) {
            return typeof event.namespace !== 'undefined' && event.namespace === 'bs.modal';
        },
        makeModalDraggable: function() {
            if (this.options.draggable) {
                this.getModalHeader().addClass(this.getNamespace('draggable')).on('mousedown', {dialog: this}, function(event) {
                    var dialog = event.data.dialog;
                    dialog.draggableData.isMouseDown = true;
                    var dialogOffset = dialog.getModalDialog().offset();
                    dialog.draggableData.mouseOffset = {
                        top: event.clientY - dialogOffset.top,
                        left: event.clientX - dialogOffset.left
                    };
                });
                this.getModal().on('mouseup mouseleave', {dialog: this}, function(event) {
                    event.data.dialog.draggableData.isMouseDown = false;
                });
                $('body').on('mousemove', {dialog: this}, function(event) {
                    var dialog = event.data.dialog;
                    if (!dialog.draggableData.isMouseDown) {
                        return;
                    }
                    dialog.getModalDialog().offset({
                        top: event.clientY - dialog.draggableData.mouseOffset.top,
                        left: event.clientX - dialog.draggableData.mouseOffset.left
                    });
                });
            }

            return this;
        },
        realize: function() {
            this.initModalStuff();
            this.getModal().addClass(BootstrapDialog.NAMESPACE)
                    .addClass(this.getCssClass());
            this.updateSize();
            if (this.getDescription()) {
                this.getModal().attr('aria-describedby', this.getDescription());
            }
            this.getModalFooter().append(this.createFooterContent());
            this.getModalHeader().append(this.createHeaderContent());
            this.getModalBody().append(this.createBodyContent());
            this.getModal().data('bs.modal', new BootstrapDialogModal(this.getModal(), {
                backdrop: 'static',
                keyboard: false,
                show: false
            }));
            this.makeModalDraggable();
            this.handleModalEvents();
            this.setRealized(true);
            this.updateButtons();
            this.updateType();
            this.updateTitle();
            this.updateMessage();
            this.updateClosable();
            this.updateAnimate();
            this.updateSize();

            return this;
        },
        open: function() {
            !this.isRealized() && this.realize();
            this.getModal().modal('show');
            this.setOpened(true);

            return this;
        },
        close: function() {
            if (this.isAutodestroy()) {
                delete BootstrapDialog.dialogs[this.getId()];
            }
            this.getModal().modal('hide');
            this.setOpened(false);

            return this;
        }
    };

    // Add compatible methods.
    BootstrapDialog.prototype = $.extend(BootstrapDialog.prototype, BootstrapDialog.METHODS_TO_OVERRIDE[BootstrapDialogModal.getModalVersion()]);

    /**
     * RFC4122 version 4 compliant unique id creator.
     *
     * Added by https://github.com/tufanbarisyildirim/
     *
     *  @returns {String}
     */
    BootstrapDialog.newGuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /* ================================================
     * For lazy people
     * ================================================ */

    /**
     * Shortcut function: show
     *
     * @param {type} options
     * @returns the created dialog instance
     */
    BootstrapDialog.show = function(options) {
        return new BootstrapDialog(options).open();
    };

    /**
     * Alert window
     *
     * @returns the created dialog instance
     */
    BootstrapDialog.alert = function() {
        var options = {};
        var defaultOptions = {
            type: BootstrapDialog.TYPE_PRIMARY,
            title: null,
            message: null,
            closable: true,
            buttonLabel: BootstrapDialog.DEFAULT_TEXTS.OK,
            callback: null
        };

        if (typeof arguments[0] === 'object' && arguments[0].constructor === {}.constructor) {
            options = $.extend(true, defaultOptions, arguments[0]);
        } else {
            options = $.extend(true, defaultOptions, {
                message: arguments[0],
                closable: false,
                buttonLabel: BootstrapDialog.DEFAULT_TEXTS.OK,
                callback: typeof arguments[1] !== 'undefined' ? arguments[1] : null
            });
        }

        return new BootstrapDialog({
            type: options.type,
            title: options.title,
            message: options.message,
            closable: options.closable,
            data: {
                callback: options.callback
            },
            onhide: function(dialog) {
                !dialog.getData('btnClicked') && dialog.isClosable() && typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
            },
            buttons: [{
                    label: options.buttonLabel,
                    action: function(dialog) {
                        dialog.setData('btnClicked', true);
                        typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                        dialog.close();
                    }
                }]
        }).open();
    };

    /**
     * Confirm window
     *
     * @param {type} message
     * @param {type} callback
     * @returns the created dialog instance
     */
    BootstrapDialog.confirm = function(message, callback) {
        return new BootstrapDialog({
            title: 'Confirmation',
            message: message,
            closable: false,
            data: {
                'callback': callback
            },
            buttons: [{
                    label: BootstrapDialog.DEFAULT_TEXTS.CANCEL,
                    action: function(dialog) {
                        typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
                        dialog.close();
                    }
                }, {
                    label: BootstrapDialog.DEFAULT_TEXTS.OK,
                    cssClass: 'btn-primary',
                    action: function(dialog) {
                        typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                        dialog.close();
                    }
                }]
        }).open();
    };

    /**
     * Warning window
     *
     * @param {type} message
     * @returns the created dialog instance
     */
    BootstrapDialog.warning = function(message, callback) {
        return new BootstrapDialog({
            type: BootstrapDialog.TYPE_WARNING,
            message: message
        }).open();
    };

    /**
     * Danger window
     *
     * @param {type} message
     * @returns the created dialog instance
     */
    BootstrapDialog.danger = function(message, callback) {
        return new BootstrapDialog({
            type: BootstrapDialog.TYPE_DANGER,
            message: message
        }).open();
    };

    /**
     * Success window
     *
     * @param {type} message
     * @returns the created dialog instance
     */
    BootstrapDialog.success = function(message, callback) {
        return new BootstrapDialog({
            type: BootstrapDialog.TYPE_SUCCESS,
            message: message
        }).open();
    };

    return BootstrapDialog;

}));
// ################################## //
// ################################## //
// ################################## //
// ################################## //

(function($) {
    /*
     * internal
     */
    var _previousResizeWidth = -1,
            _updateTimeout = -1;
    /*
     * _parse
     * value parse utility function
     */
    var _parse = function(value) {
// parse value and convert NaN to 0
        return parseFloat(value) || 0;
    };
    /*
     * _rows
     * utility function returns array of jQuery selections representing each row
     * (as displayed after float wrapping applied by browser)
     */
    var _rows = function(elements) {
        var tolerance = 1,
                $elements = $(elements),
                lastTop = null,
                rows = [];
// group elements by their top position
        $elements.each(function() {
            var $that = $(this),
                    top = $that.offset().top - _parse($that.css('margin-top')),
                    lastRow = rows.length > 0 ? rows[rows.length - 1] : null;
            if (lastRow === null) {
// first item on the row, so just push it
                rows.push($that);
            } else {
// if the row top is the same, add to the row group
                if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
                    rows[rows.length - 1] = lastRow.add($that);
                } else {
// otherwise start a new row group
                    rows.push($that);
                }
            }
// keep track of the last row top
            lastTop = top;
        });
        return rows;
    };
    /*
     * _parseOptions
     * handle plugin options
     */
    var _parseOptions = function(options) {
        var opts = {
            byRow: true,
            property: 'height',
            target: null,
            remove: false
        };
        if (typeof options === 'object') {
            return $.extend(opts, options);
        }
        if (typeof options === 'boolean') {
            opts.byRow = options;
        } else if (options === 'remove') {
            opts.remove = true;
        }
        return opts;
    };
    /*
     * matchHeight
     * plugin definition
     */
    var matchHeight = $.fn.matchHeight = function(options) {
        var opts = _parseOptions(options);
// handle remove
        if (opts.remove) {
            var that = this;
// remove fixed height from all selected elements
            this.css(opts.property, '');
// remove selected elements from all groups
            $.each(matchHeight._groups, function(key, group) {
                group.elements = group.elements.not(that);
            });
// TODO: cleanup empty groups
            return this;
        }
        if (this.length <= 1 && !opts.target) {
            return this;
        }
// keep track of this group so we can re-apply later on load and resize events
        matchHeight._groups.push({
            elements: this,
            options: opts
        });
// match each element's height to the tallest element in the selection
        matchHeight._apply(this, opts);
        return this;
    };
    /*
     * plugin global options
     */
    matchHeight._groups = [];
    matchHeight._throttle = 80;
    matchHeight._maintainScroll = false;
    matchHeight._beforeUpdate = null;
    matchHeight._afterUpdate = null;
    /*
     * matchHeight._apply
     * apply matchHeight to given elements
     */
    matchHeight._apply = function(elements, options) {
        var opts = _parseOptions(options),
                $elements = $(elements),
                rows = [$elements];
// take note of scroll position
        var scrollTop = $(window).scrollTop(),
                htmlHeight = $('html').outerHeight(true);
// get hidden parents
        var $hiddenParents = $elements.parents().filter(':hidden');
// cache the original inline style
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.data('style-cache', $that.attr('style'));
        });
// temporarily must force hidden parents visible
        $hiddenParents.css('display', 'block');
// get rows if using byRow, otherwise assume one row
        if (opts.byRow && !opts.target) {
// must first force an arbitrary equal height so floating elements break evenly
            $elements.each(function() {
                var $that = $(this),
                        display = $that.css('display') === 'inline-block' ? 'inline-block' : 'block';
// cache the original inline style
                $that.data('style-cache', $that.attr('style'));
                $that.css({
                    'display': display,
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-top': '0',
                    'margin-bottom': '0',
                    'border-top-width': '0',
                    'border-bottom-width': '0',
                    'height': '100px'
                });
            });
// get the array of rows (based on element top position)
            rows = _rows($elements);
// revert original inline styles
            $elements.each(function() {
                var $that = $(this);
                $that.attr('style', $that.data('style-cache') || '');
            });
        }
        $.each(rows, function(key, row) {
            var $row = $(row),
                    targetHeight = 0;
            if (!opts.target) {
// skip apply to rows with only one item
                if (opts.byRow && $row.length <= 1) {
                    $row.css(opts.property, '');
                    return;
                }
// iterate the row and find the max height
                $row.each(function() {
                    var $that = $(this),
                            display = $that.css('display') === 'inline-block' ? 'inline-block' : 'block';
// ensure we get the correct actual height (and not a previously set height value)
                    var css = {'display': display};
                    css[opts.property] = '';
                    $that.css(css);
// find the max height (including padding, but not margin)
                    if ($that.outerHeight(false) > targetHeight) {
                        targetHeight = $that.outerHeight(false);
                    }
// revert display block
                    $that.css('display', '');
                });
            } else {
// if target set, use the height of the target element
                targetHeight = opts.target.outerHeight(false);
            }
// iterate the row and apply the height to all elements
            $row.each(function() {
                var $that = $(this),
                        verticalPadding = 0;
// don't apply to a target
                if (opts.target && $that.is(opts.target)) {
                    return;
                }
// handle padding and border correctly (required when not using border-box)
                if ($that.css('box-sizing') !== 'border-box') {
                    verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
                    verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
                }
// set the height (accounting for padding and border)
                $that.css(opts.property, targetHeight - verticalPadding);
            });
        });
// revert hidden parents
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.attr('style', $that.data('style-cache') || null);
        });
// restore scroll position if enabled
        if (matchHeight._maintainScroll) {
            $(window).scrollTop((scrollTop / htmlHeight) * $('html').outerHeight(true));
        }
        return this;
    };
    /*
     * matchHeight._applyDataApi
     * applies matchHeight to all elements with a data-match-height attribute
     */
    matchHeight._applyDataApi = function() {
        var groups = {};
// generate groups by their groupId set by elements using data-match-height
        $('[data-match-height], [data-mh]').each(function() {
            var $this = $(this),
                    groupId = $this.attr('data-mh') || $this.attr('data-match-height');
            if (groupId in groups) {
                groups[groupId] = groups[groupId].add($this);
            } else {
                groups[groupId] = $this;
            }
        });
// apply matchHeight to each group
        $.each(groups, function() {
            this.matchHeight(true);
        });
    };
    /*
     * matchHeight._update
     * updates matchHeight on all current groups with their correct options
     */
    var _update = function(event) {
        if (matchHeight._beforeUpdate) {
            matchHeight._beforeUpdate(event, matchHeight._groups);
        }
        $.each(matchHeight._groups, function() {
            matchHeight._apply(this.elements, this.options);
        });
        if (matchHeight._afterUpdate) {
            matchHeight._afterUpdate(event, matchHeight._groups);
        }
    };
    matchHeight._update = function(throttle, event) {
// prevent update if fired from a resize event
// where the viewport width hasn't actually changed
// fixes an event looping bug in IE8
        if (event && event.type === 'resize') {
            var windowWidth = $(window).width();
            if (windowWidth === _previousResizeWidth) {
                return;
            }
            _previousResizeWidth = windowWidth;
        }
// throttle updates
        if (!throttle) {
            _update(event);
        } else if (_updateTimeout === -1) {
            _updateTimeout = setTimeout(function() {
                _update(event);
                _updateTimeout = -1;
            }, matchHeight._throttle);
        }
    };
    /*
     * bind events
     */
// apply on DOM ready event
    $(matchHeight._applyDataApi);
// update heights on load and resize events
    $(window).bind('load', function(event) {
        matchHeight._update(false, event);
    });
// throttled update heights on resize events
    $(window).bind('resize orientationchange', function(event) {
        matchHeight._update(true, event);
    });
})(jQuery);

//####################################//
//####################################//
//####################################//
//####################################//
/**
 * jquery.multilevelpushmenu.js v2.1.4
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013-2014, Make IT d.o.o.
 * http://multi-level-push-menu.make.rs
 * https://github.com/adgsm/multi-level-push-menu
 */
(function($) {
    $.fn.multilevelpushmenu = function(options) {
        "use strict";
        var args = arguments,
                returnValue = null;

        this.each(function() {
            var instance = this,
                    $this = $(this),
                    $container = ($this.context != undefined) ? $this : $('body'),
                    menu = (options && options.menu != undefined) ? options.menu : $this.find('nav'),
                    clickEventType, dragEventType;

            // Settings
            var settings = $.extend({
                container: $container,
                containersToPush: null,
                menuID: (($container.prop('id') != undefined && $container.prop('id') != '') ? $container.prop('id') : this.nodeName.toLowerCase()) + "_multilevelpushmenu",
                wrapperClass: 'multilevelpushmenu_wrapper',
                menuInactiveClass: 'multilevelpushmenu_inactive',
                menu: menu,
                menuWidth: 0,
                menuHeight: 0,
                collapsed: false,
                fullCollapse: false,
                direction: 'ltr',
                backText: 'Back',
                backItemClass: 'backItemClass',
                backItemIcon: 'fa fa-angle-right',
                groupIcon: 'fa fa-angle-left',
                mode: 'overlap',
                overlapWidth: 40,
                preventItemClick: true,
                preventGroupItemClick: true,
                swipe: 'both',
                onCollapseMenuStart: function() {
                },
                onCollapseMenuEnd: function() {
                },
                onExpandMenuStart: function() {
                },
                onExpandMenuEnd: function() {
                },
                onGroupItemClick: function() {
                },
                onItemClick: function() {
                },
                onTitleItemClick: function() {
                },
                onBackItemClick: function() {
                },
                onMenuReady: function() {
                },
                onMenuSwipe: function() {
                }
            }, options);

            // Store a settings reference withint the element's data
            if (!$.data(instance, 'plugin_multilevelpushmenu')) {
                $.data(instance, 'plugin_multilevelpushmenu', settings);
                instance.settings = $.data(instance, 'plugin_multilevelpushmenu');
            }

            // Exposed methods
            var methods = {
                // Initialize menu
                init: function() {
                    return initialize.apply(this, Array.prototype.slice.call(arguments));
                },
                // Collapse menu
                collapse: function() {
                    return collapseMenu.apply(this, Array.prototype.slice.call(arguments));
                },
                // Expand menu
                expand: function() {
                    return expandMenu.apply(this, Array.prototype.slice.call(arguments));
                },
                // Menu expanded
                menuexpanded: function() {
                    return menuExpanded.apply(this, Array.prototype.slice.call(arguments));
                },
                // Active menu
                activemenu: function() {
                    return activeMenu.apply(this, Array.prototype.slice.call(arguments));
                },
                // Find menu(s) by title
                findmenusbytitle: function() {
                    return findMenusByTitle.apply(this, Array.prototype.slice.call(arguments));
                },
                // Find item(s) by name
                finditemsbyname: function() {
                    return findItemsByName.apply(this, Array.prototype.slice.call(arguments));
                },
                // Find path to root menu collection
                pathtoroot: function() {
                    return pathToRoot.apply(this, Array.prototype.slice.call(arguments));
                },
                // Find shared path to root of two menus
                comparepaths: function() {
                    return comparePaths.apply(this, Array.prototype.slice.call(arguments));
                },
                // Get/Set settings options
                option: function() {
                    return manageOptions.apply(this, Array.prototype.slice.call(arguments));
                },
                // Add item(s)
                additems: function() {
                    return addItems.apply(this, Array.prototype.slice.call(arguments));
                },
                // Remove item(s)
                removeitems: function() {
                    return removeItems.apply(this, Array.prototype.slice.call(arguments));
                },
                // Size DOM elements
                redraw: function() {
                    return sizeDOMelements.apply(this, Array.prototype.slice.call(arguments));
                },
                // Returns visible level holders
                visiblemenus: function() {
                    return visibleLevelHolders.apply(this, Array.prototype.slice.call(arguments));
                },
                // Returns visible level holders
                hiddenmenus: function() {
                    return hiddenLevelHolders.apply(this, Array.prototype.slice.call(arguments));
                },
                // Propagate event to underneath layer
                propagateevent: function() {
                    return propagateEvent.apply(this, Array.prototype.slice.call(arguments));
                }
            };

            // IE 8 and modern browsers, prevent event propagation
            function stopEventPropagation(e) {
                if (e.stopPropagation && e.preventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                else {
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
            }

            // propagate event to underneath layer
            // http://jsfiddle.net/E9zTs/2/
            function propagateEvent($element, event) {
                if ($element == undefined || event == undefined)
                    return false;
                $element.on(event, function(e, ee) {
                    $element.hide();
                    try {
                        ee = ee || {
                            pageX: e.pageX,
                            pageY: e.pageY
                        };
                        var next = document.elementFromPoint(ee.pageX, ee.pageY);
                        next = (next.nodeType == 3) ? next.parentNode : next //Opera
                        $(next).trigger(event, ee);
                    }
                    catch (err) {
                        $.error('Error while propagating event: ' + err.message);
                    }
                    finally {
                        $element.show();
                    }
                });
            }

            // Create DOM structure if it does not already exist within the container (input: array)
            function createDOMStructure() {
                var $mainWrapper = $("<nav />")
                        .prop({"id": instance.settings.menuID, "className": instance.settings.wrapperClass})
                        .appendTo(instance.settings.container);
                createNestedDOMStructure(instance.settings.menu, $mainWrapper);
            }
            function createNestedDOMStructure(menus, $wrapper) {
                if (menus.level == undefined)
                    menus.level = 0;
                $.each(menus, function() {
                    var $levelHolder = $("<div />")
                            .attr({"class": "levelHolderClass" + ((instance.settings.direction == 'rtl') ? " rtl" : " ltr"), "data-level": menus.level, "style": ((instance.settings.direction == 'rtl') ? "margin-right: " : "margin-left: ") + ((menus.level == 0 && !instance.settings.collapsed) ? 0 : "-200%")})
                            .appendTo($wrapper),
                            extWidth = (isValidDim(instance.settings.menuWidth) || (isInt(instance.settings.menuWidth) && instance.settings.menuWidth > 0));
                    $levelHolder.bind(dragEventType, function(e) {
                        holderSwipe(e, $levelHolder);
                    });
                    if (this.id != undefined)
                        $levelHolder.attr({"id": this.id});
                    var $title = $("<h2 />")
                            .attr({"style": "text-align: " + ((instance.settings.direction == 'rtl') ? "right" : "left")})
                            .text(this.title)
                            .appendTo($levelHolder),
                            $titleIcon = $("<i />")
                            .prop({"class": ((instance.settings.direction == 'rtl') ? "floatLeft" : "floatRight") + " cursorPointer " + this.icon})
                            .prependTo($title);
                    $titleIcon.bind(clickEventType, function(e) {
                        titleIconClick(e, $levelHolder, menus);
                    });
                    if (menus.level > 0)
                        createBackItem($levelHolder);
                    var $itemGroup = $("<ul />")
                            .appendTo($levelHolder);
                    $.each(this.items, function() {
                        createItem(this, $levelHolder, -1);
                    })
                });
            }

            // Update DOM structure if it already exists in container (input: HTML markup)
            function updateDOMStructure() {
                var $mainWrapper = (instance.settings.container.find('nav').length > 0) ? instance.settings.container.find('nav') : instance.settings.menu;
                if ($mainWrapper.length == 0)
                    return false;
                $mainWrapper.prop({"id": instance.settings.menuID, "className": instance.settings.wrapperClass});
                updateNestedDOMStructure($mainWrapper);
            }
            function updateNestedDOMStructure($wrapper) {
                if ($wrapper.level == undefined)
                    $wrapper.level = 0;
                $.each($wrapper, function() {
                    var $levelHolder = $("<div />")
                            .attr({"class": "levelHolderClass" + ((instance.settings.direction == 'rtl') ? " rtl" : " ltr"), "data-level": $wrapper.level, "style": ((instance.settings.direction == 'rtl') ? "margin-right: " : "margin-left: ") + (($wrapper.level == 0 && !instance.settings.collapsed) ? 0 : "-200%")})
                            .appendTo($wrapper),
                            extWidth = (isValidDim(instance.settings.menuWidth) || (isInt(instance.settings.menuWidth) && instance.settings.menuWidth > 0));
                    $levelHolder.bind(dragEventType, function(e) {
                        holderSwipe(e, $levelHolder);
                    });
                    var $title = $wrapper.children('h2');
                    $title.attr({"style": "text-align: " + ((instance.settings.direction == 'rtl') ? "right" : "left")});
                    $title.appendTo($levelHolder);
                    var $titleIcon = $title.children('i');
                    $titleIcon.addClass(((instance.settings.direction == 'rtl') ? "floatLeft" : "floatRight") + " cursorPointer");
                    $titleIcon.bind(clickEventType, function(e) {
                        titleIconClick(e, $levelHolder, $wrapper);
                    });
                    if ($wrapper.level > 0)
                        createBackItem($levelHolder);
                    var $itemGroup = $wrapper.children('ul');
                    $itemGroup.appendTo($levelHolder);
                    $.each($itemGroup.children('li'), function() {
                        var $item = $(this);
                        $item.attr({"style": "text-align: " + ((instance.settings.direction == 'rtl') ? "right" : "left")});
                        var $itemAnchor = $item.children('a');
                        var $itemIcon = $itemAnchor.children('i');
                        $itemIcon.addClass(((instance.settings.direction == 'rtl') ? "floatLeft" : "floatRight"));
                        if ($item.children('ul').length > 0) {
                            $itemAnchor.bind(clickEventType, function(e) {
                                itemGroupAnchorClick(e, $levelHolder, $item);
                            });
                            createItemGroupIcon($itemAnchor);
                            $item.level = $wrapper.level + 1;
                            updateNestedDOMStructure($item);
                        } else {
                            $itemAnchor.bind(clickEventType, function(e) {
                                itemAnchorClick(e, $levelHolder, $item);
                            });
                        }
                    })
                });
            }

            // Click event for title icon
            function titleIconClick(e, $levelHolder, menus) {
                if ($(instance).find('div.levelHolderClass').is(':animated'))
                    return false;
                instance.settings.onTitleItemClick.apply(this, Array.prototype.slice.call([e, $levelHolder, instance.settings]));
                stopEventPropagation(e);
                var instanceFC = (instance.settings.direction == 'rtl') ?
                        parseInt($levelHolder.css('margin-right')) < 0
                        :
                        parseInt($levelHolder.css('margin-left')) < 0;
                if (menus.level == 0 && instanceFC) {
                    expandMenu();
                }
                else {
                    var $nextLevelHolders = instance.settings.container
                            .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                            .filter(function() {
                        var retObjs = (instance.settings.direction == 'rtl') ?
                                (($(this).attr('data-level') > $levelHolder.attr('data-level')) && (parseInt($(this).css('margin-right')) >= 0))
                                :
                                (($(this).attr('data-level') > $levelHolder.attr('data-level')) && (parseInt($(this).css('margin-left')) >= 0));
                        return retObjs;
                    }),
                            $prevLevelHolders = instance.settings.container
                            .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                            .filter(function() {
                        var retObjs = (instance.settings.direction == 'rtl') ?
                                (($(this).attr('data-level') <= $levelHolder.attr('data-level')) && (parseInt($(this).css('margin-right')) >= 0))
                                :
                                (($(this).attr('data-level') <= $levelHolder.attr('data-level')) && (parseInt($(this).css('margin-left')) >= 0));
                        return retObjs;
                    }),
                            collapseAll = ($nextLevelHolders.length == 0 && $prevLevelHolders.length == 1) ? collapseMenu() : collapseMenu(parseInt($levelHolder.attr('data-level')));
                }
                $levelHolder.css('visibility', 'visible');
                $levelHolder.find('.' + instance.settings.backItemClass).css('visibility', 'visible');
                $levelHolder.find('ul').css('visibility', 'visible');
                $levelHolder.removeClass(instance.settings.menuInactiveClass);
            }

            // Create Back item DOM elements
            function createBackItem($levelHolder) {
                var $backItem = $("<div />")
                        .attr({"class": instance.settings.backItemClass})
                        .appendTo($levelHolder),
                        $backItemAnchor = $("<a />")
                        .prop({"href": "#"})
                        .text(instance.settings.backText)
                        .appendTo($backItem),
                        $backItemIcon = $("<i />")
                        .prop({"class": ((instance.settings.direction == 'rtl') ? "floatLeft " : "floatRight ") + instance.settings.backItemIcon})
                        .prependTo($backItemAnchor);
                $backItemAnchor.bind(clickEventType, function(e) {
                    backItemAnchorClick(e, $levelHolder);
                });
            }

            // Click event for back item
            function backItemAnchorClick(e, $levelHolder) {
                if ($(instance).find('div.levelHolderClass').is(':animated'))
                    return false;
                instance.settings.onBackItemClick.apply(this, Array.prototype.slice.call([e, $levelHolder, instance.settings]));
                stopEventPropagation(e);
                collapseMenu(parseInt($levelHolder.attr('data-level') - 1));
            }

            // Click event for group items
            function itemGroupAnchorClick(e, $levelHolder, $item) {
                if ($(instance).find('div.levelHolderClass').is(':animated'))
                    return false;
                instance.settings.onGroupItemClick.apply(this, Array.prototype.slice.call([e, $levelHolder, $item, instance.settings]));
                expandMenu($item.find('div:first'));
                if (instance.settings.preventGroupItemClick)
                    stopEventPropagation(e);
            }

            // Create item group DOM element
            function createItemGroupIcon($itemAnchor) {
                var $itemGroupIcon = $("<i />")
                        .attr({"class": ((instance.settings.direction == 'rtl') ? " floatRight iconSpacing_rtl " : " floatLeft iconSpacing_ltr ") + instance.settings.groupIcon})
                        .prependTo($itemAnchor);
            }

            // Create item DOM element
            function createItem() {
                var item = arguments[0],
                        $levelHolder = arguments[1],
                        position = arguments[2],
                        $itemGroup = $levelHolder.find('ul:first'),
                        $item = $("<li />");
                (position < ($itemGroup.find('li').length) && position >= 0) ?
                        $item.insertBefore($itemGroup.find('li').eq(position)) : $item.appendTo($itemGroup);
                $item.attr({"style": "text-align: " + ((instance.settings.direction == 'rtl') ? "right" : "left")});
                if (item.id != undefined)
                    $item.attr({"id": item.id});
                var $itemAnchor = $("<a />")
                        .prop({"href": item.link})
                        .text(item.name)
                        .appendTo($item),
                        $itemIcon = $("<i />")
                        .prop({"class": ((instance.settings.direction == 'rtl') ? "floatLeft " : "floatRight ") + item.icon})
                        .prependTo($itemAnchor);
                if (item.items) {
                    $itemAnchor.bind(clickEventType, function(e) {
                        itemGroupAnchorClick(e, $levelHolder, $item);
                    });
                    createItemGroupIcon($itemAnchor);
                    item.items.level = parseInt($levelHolder.attr('data-level'), 10) + 1;
                    createNestedDOMStructure(item.items, $item);
                } else {
                    $itemAnchor.bind(clickEventType, function(e) {
                        itemAnchorClick(e, $levelHolder, $item);
                    });
                }
            }

            // Click event for items
            function itemAnchorClick(e, $levelHolder, $item) {
                instance.settings.onItemClick.apply(this, Array.prototype.slice.call([e, $levelHolder, $item, instance.settings]));
                if (instance.settings.preventItemClick)
                    stopEventPropagation(e);
            }

            // Swipe/Drag event for holders
            function holderSwipe(emd, $levelHolder) {
                if (emd.target.tagName.toUpperCase() === "INPUT"){
                    return;
                }
                var extRes = instance.settings.onMenuSwipe.apply(this, Array.prototype.slice.call([emd, $levelHolder, instance.settings]));
                if (extRes == false)
                    return false;
                if ($(instance).find('div.levelHolderClass').is(':animated'))
                    return false;
                var level = ($levelHolder.attr('data-level') > 0) ? $levelHolder.attr('data-level') - 1 : undefined;
                if (emd.type == 'touchmove' && instance.settings.swipe != 'desktop') {
                    stopEventPropagation(emd);
                    emd = (emd.touches) ? emd : emd.originalEvent;
                    if (!emd.touches || emd.touches.length <= 0)
                        return false;
                    var touch = emd.touches[0];
                    instance.settings.container.unbind('touchend');
                    instance.settings.container.bind('touchend', function(emm) {
                        stopEventPropagation(emm);
                        $levelHolder.significance = 0;
                        $levelHolder.swipeStart = 0;
                        instance.settings.container.unbind('touchend');
                    });
                    if ($levelHolder.swipeStart != undefined && $levelHolder.swipeStart != 0) {
                        $levelHolder.significance = touch.pageX - $levelHolder.swipeStart;
                    }
                    else {
                        $levelHolder.significance = 0;
                        $levelHolder.swipeStart = touch.pageX;
                        return true;
                    }
                    if (Math.abs($levelHolder.significance) > instance.settings.overlapWidth * .3) {
                        if (instance.settings.direction == 'rtl')
                            $levelHolder.significance *= (-1);
                        ($levelHolder.significance > 0) ? expandMenu((level == undefined) ? level : $levelHolder) : collapseMenu(level);
                        $levelHolder.significance = 0;
                        $levelHolder.swipeStart = 0;
                    }
                }
                else if (instance.settings.swipe != 'touchscreen') {
                    stopEventPropagation(emd);
                    var significance = 0;
                    $levelHolder.unbind('mousemove');
                    $levelHolder.bind('mousemove', function(emm) {
                        significance = emm.clientX - emd.clientX;
                        if (Math.abs(significance) > instance.settings.overlapWidth * .3) {
                            $levelHolder.unbind('mousemove');
                            if (instance.settings.direction == 'rtl')
                                significance *= (-1);
                            (significance > 0) ? expandMenu((level == undefined) ? level : $levelHolder) : collapseMenu(level);
                            return true;
                        }
                    });
                    instance.settings.container.unbind('mouseup');
                    instance.settings.container.bind('mouseup', function(e) {
                        stopEventPropagation(e);
                        $levelHolder.unbind('mousemove');
                        instance.settings.container.unbind('mouseup');
                    });
                }
            }

            // Returns visible level holders
            function visibleLevelHolders() {
                var $visibleLevelHolders = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                        .filter(function() {
                    var retObjs = (instance.settings.direction == 'rtl') ?
                            (parseInt($(this).css('margin-right')) >= 0 && $(this).position().left < instance.settings.container.width() - instance.settings.overlapWidth)
                            :
                            (parseInt($(this).css('margin-left')) >= 0 && $(this).position().left >= 0);
                    return retObjs;
                });
                if ($visibleLevelHolders.length < 1)
                    $visibleLevelHolders = false;
                return $visibleLevelHolders;
            }

            // Returns hidden level holders
            function hiddenLevelHolders() {
                var $hiddenLevelHolders = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                        .filter(function() {
                    var retObjs = (instance.settings.direction == 'rtl') ?
                            (($(this).position().left > instance.settings.container.width() || parseInt($(this).css('margin-right')) < 0))
                            :
                            (($(this).position().left < 0 || parseInt($(this).css('margin-left')) < 0));
                    return retObjs;
                });
                if ($hiddenLevelHolders.length < 1)
                    $hiddenLevelHolders = false;
                return $hiddenLevelHolders;
            }

            // Sizing DOM elements per creation/update
            function sizeDOMelements() {
                if (!instance.redraw) {
                    instance.redraw = true;
                    var forceWidth = arguments[0],
                            forceHeight = arguments[1],
                            filter = arguments[2],
                            ieShadowFilterDistortion = ($('#' + instance.settings.menuID + ' div.levelHolderClass').first().css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) ? $('#' + instance.settings.menuID + ' div.levelHolderClass').first().get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength : 0,
                            maxWidth = (forceWidth == undefined) ? Math.max.apply(null,
                            $('#' + instance.settings.menuID + ' div.levelHolderClass').map(function() {
                        return $(this).width();
                    }).get()) - ieShadowFilterDistortion : forceWidth - ieShadowFilterDistortion,
                            maxLevel = Math.max.apply(null,
                            $('#' + instance.settings.menuID + ' div.levelHolderClass').map(function() {
                        return $(this).attr('data-level');
                    }).get()),
                            extWidth = (isValidDim(instance.settings.menuWidth) || (isInt(instance.settings.menuWidth) && instance.settings.menuWidth > 0)),
                            extHeight = (isValidDim(instance.settings.menuHeight) || (isInt(instance.settings.menuHeight) && instance.settings.menuHeight > 0)),
                            $objects = (filter == undefined) ? $('#' + instance.settings.menuID + ' div.levelHolderClass') : filter,
                            currWidth;
                    if (!extWidth && instance.menuWidth != undefined)
                        maxWidth = instance.menuWidth;
                    (extWidth && forceWidth == undefined) ? $objects.width(instance.settings.menuWidth) : $objects.width(maxWidth);
                    if (extWidth) {
                        if (($objects.width() == 0 || (isValidDim(instance.settings.menuWidth) && instance.settings.menuWidth.indexOf('%') != -1)) && forceWidth == undefined) {
                            $objects.css('min-width', '');
                            $objects.width(parseInt(instance.settings.container.parent().width() * parseInt(instance.settings.menuWidth) / 100))
                        }
                        ;
                        maxWidth = $objects.width() - ieShadowFilterDistortion;
                        $objects.css('min-width', $objects.width() - ieShadowFilterDistortion + 'px');
                    }
                    var maxExtWidth = (extWidth && forceWidth == undefined) ? ($objects.width() - ieShadowFilterDistortion + maxLevel * (instance.settings.overlapWidth + ieShadowFilterDistortion)) : (maxWidth + maxLevel * (instance.settings.overlapWidth + ieShadowFilterDistortion)),
                            maxHeight = (forceHeight == undefined) ? Math.max.apply(null,
                            $('#' + instance.settings.menuID + ' div.levelHolderClass').map(function() {
                        return $(this).height();
                    }).get()) : forceHeight;

                    instance.settings.container.css('min-height', '');
                    instance.settings.container.children('nav:first').css('min-height', '');
                    if (extHeight) {
                        instance.settings.container.height(instance.settings.menuHeight);
                        instance.settings.container.css('min-height', instance.settings.menuHeight);
                        instance.settings.container.children('nav:first').css('min-height', instance.settings.menuHeight);
                        $('#' + instance.settings.menuID).height(instance.settings.menuHeight);
                        maxHeight = instance.settings.container.height();
                    }
                    else {
                        $('#' + instance.settings.menuID).height(maxHeight);
                    }
                    instance.settings.container.css('min-height', maxHeight + 'px');
                    instance.settings.container.children('nav:first').css('min-height', maxHeight + 'px');
                    instance.settings.container.width(maxExtWidth);
                    instance.settings.container.height(maxHeight);
                    var $baseLevelHolder = $('#' + instance.settings.menuID + ' div.levelHolderClass:first'),
                            $visibleLevelHolders = visibleLevelHolders(),
                            $hiddenLevelHolders = hiddenLevelHolders(),
                            $activeLevelHolder = activeMenu(),
                            activeLevel = ($activeLevelHolder.length == 1) ? $activeLevelHolder.attr('data-level') : 0;
                    if ($visibleLevelHolders)
                        $visibleLevelHolders.each(function() {
                            if (instance.settings.mode == 'overlap')
                                $(this).width($(this).width() + (parseInt(activeLevel, 10) - parseInt($(this).attr('data-level'), 10)) * (instance.settings.overlapWidth + ieShadowFilterDistortion));
                        });
                    if ($hiddenLevelHolders)
                        $hiddenLevelHolders.each(function() {
                            (instance.settings.direction == 'rtl') ?
                                    $(this).css('margin-right', ($(this).attr('data-level') == $baseLevelHolder.attr('data-level') && !instance.settings.fullCollapse) ? $(this).width() * (-1) + instance.settings.overlapWidth : $(this).width() * (-2))
                                    :
                                    $(this).css('margin-left', ($(this).attr('data-level') == $baseLevelHolder.attr('data-level') && !instance.settings.fullCollapse) ? $(this).width() * (-1) + instance.settings.overlapWidth : $(this).width() * (-2));
                        });
                    currWidth = $baseLevelHolder.width() + parseInt($baseLevelHolder.css((instance.settings.direction == 'rtl') ? 'margin-right' : 'margin-left'), 10);
                    sizeElementWidth(instance.settings.container, currWidth);
                    instance.menuWidth = maxWidth;
                    instance.menuHeight = maxHeight;
                    instance.redraw = false;
                }
            }

            // Simple/singe DOM element width sizing 
            function sizeElementWidth($element, size) {
                if ($element == undefined || size == undefined)
                    return false;
                $element.css('min-width', '');
                $element.css('min-width', size + 'px');
                $element.children('nav:first').css('min-width', '');
                $element.children('nav:first').css('min-width', size + 'px');
                $element.width(size);
            }

            // Hide wrappers in browsers that
            // does not understand negative margin in %
            // before DOM element got its dimensions
            function fixLazyBrowsers() {
                var $baseLevelHolder = $('#' + instance.settings.menuID + ' div.levelHolderClass:first'),
                        $hiddenLevelHolders = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                        .filter(function() {
                    var retObjs = (instance.settings.direction == 'rtl') ?
                            (($(this).position().left > instance.settings.container.width() || parseInt($(this).css('margin-right')) < 0) && $(this).attr('data-level') > $baseLevelHolder.attr('data-level'))
                            :
                            (($(this).position().left < 0 || parseInt($(this).css('margin-left')) < 0) && $(this).attr('data-level') > $baseLevelHolder.attr('data-level'));
                    return retObjs;
                });
                $hiddenLevelHolders.each(function() {
                    if (instance.settings.direction == 'rtl') {
                        $(this).css('margin-right', (($(this).attr('data-level') == $baseLevelHolder.attr('data-level') && !instance.settings.collapsed) ? 0 : (-2) * $(this).width()))
                    }
                    else {
                        $(this).css('margin-left', (($(this).attr('data-level') == $baseLevelHolder.attr('data-level') && !instance.settings.collapsed) ? 0 : (-2) * $(this).width()));
                    }
                });
                if (instance.settings.direction == 'rtl') {
                    $baseLevelHolder.css('margin-right', (!instance.settings.collapsed) ? 0 : (-2) * $baseLevelHolder.width())
                }
                else {
                    $baseLevelHolder.css('margin-left', (!instance.settings.collapsed) ? 0 : (-2) * $baseLevelHolder.width());
                }
            }

            // Is integer
            function isInt(n) {
                return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
            }

            // Is Valid CSS dimension
            function isValidDim(s) {
                return typeof s === 'string' && (s.indexOf('%') != -1 || s.indexOf('px') != -1 || s.indexOf('em') != -1);
            }

            // Initialize menu level push menu
            function initialize() {
                var execute = (options && options.menu != undefined) ? createDOMStructure() : updateDOMStructure();
                propagateEvent(instance.settings.container, clickEventType);
                sizeDOMelements();
                fixLazyBrowsers();
                startMode(instance.settings.collapsed);
                instance.settings.onMenuReady.apply(this, Array.prototype.slice.call([instance.settings]));
                return $this;
            }

            // Initialize menu in collapsed/expanded mode 
            function startMode(mode) {
                if (mode) {
                    var $baseLevelHolder = $('#' + instance.settings.menuID + ' div.levelHolderClass:first');
                    $baseLevelHolder.find('ul').hide();
                    $baseLevelHolder.addClass(instance.settings.menuInactiveClass);
                    if (instance.settings.direction == 'rtl') {
                        $baseLevelHolder.stop().animate({
                            marginRight: ((-1) * $baseLevelHolder.width() + ((instance.settings.fullCollapse) ? 0 : instance.settings.overlapWidth))
                        })
                    }
                    else {
                        $baseLevelHolder.stop().animate({
                            marginLeft: ((-1) * $baseLevelHolder.width() + ((instance.settings.fullCollapse) ? 0 : instance.settings.overlapWidth))
                        });
                    }
                }
            }

            // Push container(s) of choice
            function pushContainers(absMove) {
                if (instance.settings.containersToPush == null)
                    return false;
                $.each(instance.settings.containersToPush, function() {
                    var lMr = parseInt($(this).css('margin-left')),
                            lM = isInt(lMr) ? lMr : 0,
                            rMr = parseInt($(this).css('margin-right')),
                            rM = isInt(rMr) ? rMr : 0;
                    $(this).stop().animate({
                        marginLeft: lM + ((instance.settings.direction == 'rtl') ? (-1) : 1) * absMove,
                        marginRight: rM + ((instance.settings.direction == 'rtl') ? 1 : (-1)) * absMove
                    });
                });
            }

            // Collapse menu
            function collapseMenu() {
                if ($(instance).find('div.levelHolderClass').is(':animated'))
                    return false;
                instance.settings.onCollapseMenuStart.apply(this, Array.prototype.slice.call([instance.settings]));
                var level = arguments[0],
                        callbacks = arguments[1],
                        collapingObjects = {},
                        ieShadowFilterDistortion, lwidth, lpush, lMarginLeft, lMarginLeftFC,
                        $baseLevelHolder = $('#' + instance.settings.menuID + ' div.levelHolderClass:first'),
                        collapseAll = (level == undefined) ? true : false,
                        currWidth;
                collapingObjects[ 'collapsingEnded' ] = false;
                if (typeof level == 'object') {
                    level = level.attr('data-level');
                }
                else if (typeof level == 'string') {
                    var $selectedLevelHolder = findMenusByTitle(level);
                    if ($selectedLevelHolder && $selectedLevelHolder.length == 1) {
                        level = $selectedLevelHolder.attr('data-level');
                    }
                    else {
                        level = $baseLevelHolder.attr('data-level');
                    }
                }
                else if (level == undefined || !isInt(level) || level < 0) {
                    level = $baseLevelHolder.attr('data-level');
                }
                if (callbacks == undefined && typeof callbacks != 'object') {
                    callbacks = [{'method': instance.settings.onCollapseMenuEnd, 'args': [instance.settings]}];
                } else {
                    $.merge(callbacks, [{'method': instance.settings.onCollapseMenuEnd, 'args': [instance.settings]}]);
                }
                var $nextLevelHolders = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                        .filter(function() {
                    var retObjs = (instance.settings.direction == 'rtl') ?
                            ($(this).attr('data-level') > level) && (parseInt($(this).css('margin-right')) >= 0 && $(this).position().left < instance.settings.container.width() - instance.settings.overlapWidth)
                            :
                            ($(this).attr('data-level') > level) && (parseInt($(this).css('margin-left')) >= 0 && $(this).position().left >= 0);
                    return retObjs;
                }),
                        $prevLevelHolders = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                        .filter(function() {
                    var retObjs = (instance.settings.direction == 'rtl') ?
                            ($(this).attr('data-level') <= level) && (parseInt($(this).css('margin-right')) >= 0 && $(this).position().left < instance.settings.container.width() - instance.settings.overlapWidth)
                            :
                            ($(this).attr('data-level') <= level) && (parseInt($(this).css('margin-left')) >= 0 && $(this).position().left >= 0);
                    return retObjs;
                });
                if ($prevLevelHolders.length > 0) {
                    collapingObjects[ 'prevAnimEnded' ] = false;
                    $nextLevelHolders.each(function(key, val) {
                        ieShadowFilterDistortion = ($(val).css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) ? $(val).get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength : 0;
                        lwidth = (instance.settings.mode == 'overlap') ? $(val).width() - ($nextLevelHolders.length + $prevLevelHolders.length - $(val).attr('data-level') - 1) * (instance.settings.overlapWidth + ieShadowFilterDistortion) - ieShadowFilterDistortion : $(val).width() - ieShadowFilterDistortion
                        if (instance.settings.direction == 'rtl') {
                            $(val).stop().animate({
                                marginRight: ((-1) * lwidth),
                                width: lwidth
                            });
                        }
                        else {
                            $(val).stop().animate({
                                marginLeft: ((-1) * lwidth),
                                width: lwidth
                            });
                        }
                    });
                    collapingObjects[ 'nextAnimEnded' ] = ($nextLevelHolders.length > 0) ? false : true;
                    $nextLevelHolders.last().queue(function() {
                        collapingObjects[ 'nextAnimEnded' ] = true;
                        animatedEventCallback(collapingObjects, callbacks);
                    });
                    $prevLevelHolders.each(function(key, val) {
                        ieShadowFilterDistortion = ($(val).css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) ? $(val).get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength : 0;
                        var $makeLevelHolderVisible = $prevLevelHolders.filter(function() {
                            return $(this).attr('data-level') == level;
                        });
                        $makeLevelHolderVisible.css('visibility', 'visible');
                        $makeLevelHolderVisible.find('.' + instance.settings.backItemClass).css('visibility', 'visible');
                        $makeLevelHolderVisible.find('ul').css('visibility', 'visible');
                        $makeLevelHolderVisible.removeClass(instance.settings.menuInactiveClass);
                        lwidth = (instance.settings.mode == 'overlap') ? $(val).width() - $nextLevelHolders.length * (instance.settings.overlapWidth + ieShadowFilterDistortion) - ieShadowFilterDistortion : $(val).width() - ieShadowFilterDistortion;
                        if (instance.settings.direction == 'rtl') {
                            $(val).stop().animate({
                                width: lwidth,
                                marginRight: ($(val).attr('data-level') == $baseLevelHolder.attr('data-level') && collapseAll) ?
                                        (instance.settings.fullCollapse) ?
                                        (-1) * $(val).width()
                                        :
                                        ((-1) * $(val).width() + ((instance.settings.mode == 'overlap') ? $nextLevelHolders.length + 1 : 1) * instance.settings.overlapWidth)
                                        :
                                        0
                            }, function() {
                                if ($(val).attr('data-level') == $baseLevelHolder.attr('data-level') && collapseAll) {
                                    $baseLevelHolder.children('ul').first().hide(500, function() {
                                        $baseLevelHolder.addClass(instance.settings.menuInactiveClass);
                                    });
                                }
                                currWidth = $baseLevelHolder.width() + parseInt($baseLevelHolder.css('margin-right'), 10);
                                sizeElementWidth(instance.settings.container, currWidth);
                            });
                        }
                        else {
                            $(val).stop().animate({
                                width: lwidth,
                                marginLeft: ($(val).attr('data-level') == $baseLevelHolder.attr('data-level') && collapseAll) ?
                                        (instance.settings.fullCollapse) ?
                                        (-1) * $(val).width()
                                        :
                                        ((-1) * $(val).width() + ((instance.settings.mode == 'overlap') ? $nextLevelHolders.length + 1 : 1) * instance.settings.overlapWidth)
                                        :
                                        0
                            }, function() {
                                if ($(val).attr('data-level') == $baseLevelHolder.attr('data-level') && collapseAll) {
                                    $baseLevelHolder.children('ul').first().hide(500, function() {
                                        $baseLevelHolder.addClass(instance.settings.menuInactiveClass);
                                    });
                                }
                                currWidth = $baseLevelHolder.width() + parseInt($baseLevelHolder.css('margin-left'), 10);
                                sizeElementWidth(instance.settings.container, currWidth);
                            });
                        }
                        lpush = (instance.settings.mode == 'overlap') ? ((-1) * ($nextLevelHolders.length * (instance.settings.overlapWidth + ieShadowFilterDistortion))) : 0;
                        if ($(val).attr('data-level') == $baseLevelHolder.attr('data-level') && collapseAll) {
                            var blpush = (instance.settings.fullCollapse) ? (-1) * ($baseLevelHolder.width() - ieShadowFilterDistortion) : (-1) * ($baseLevelHolder.width() - ieShadowFilterDistortion) + instance.settings.overlapWidth;
                            pushContainers(blpush);
                        }
                        else {
                            pushContainers(lpush);
                        }
                    });
                    $prevLevelHolders.last().queue(function() {
                        collapingObjects[ 'prevAnimEnded' ] = true;
                        animatedEventCallback(collapingObjects, callbacks);
                    });
                }
                collapingObjects[ 'collapsingEnded' ] = true;
                animatedEventCallback(collapingObjects, callbacks);
                return $this;
            }

            // Expand Menu helper
            function expandMenuActions() {
                if ($(instance).find('div.levelHolderClass').is(':animated'))
                    return false;
                instance.settings.onExpandMenuStart.apply(this, Array.prototype.slice.call([instance.settings]));
                var menuTitle = arguments[0],
                        callbacks = arguments[1],
                        ieShadowFilterDistortion, lwidth, lpush, blpush, currWidth,
                        expandingObjects = {},
                        $baseLevelHolder = $('#' + instance.settings.menuID + ' div.levelHolderClass:first'),
                        baseExpand = (menuTitle == undefined) ? true : false,
                        baseLevelHolderCollapsed = (instance.settings.direction == 'rtl') ?
                        parseInt($baseLevelHolder.css('margin-right'), 10) < 0 || $baseLevelHolder.position().left >= instance.settings.container.width() - instance.settings.overlapWidth
                        :
                        parseInt($baseLevelHolder.css('margin-left'), 10) < 0 || $baseLevelHolder.position().left < 0;
                expandingObjects[ 'expandingEnded' ] = false;
                if (callbacks == undefined && typeof callbacks != 'object') {
                    callbacks = [{'method': instance.settings.onExpandMenuEnd, 'args': [instance.settings]}];
                } else {
                    $.merge(callbacks, [{'method': instance.settings.onExpandMenuEnd, 'args': [instance.settings]}]);
                }
                if (baseExpand) {
                    expandingObjects[ 'baseAnimEnded' ] = false;
                    $baseLevelHolder.removeClass(instance.settings.menuInactiveClass);
                    currWidth = $baseLevelHolder.width();
                    sizeElementWidth(instance.settings.container, currWidth);
                    if (instance.settings.direction == 'rtl') {
                        $baseLevelHolder.stop().animate({
                            marginRight: 0
                        }, function() {
                            $baseLevelHolder.children('ul').first().show(500, function() {
                                expandingObjects[ 'baseAnimEnded' ] = true;
                                animatedEventCallback(expandingObjects, callbacks);
                            });
                        });
                    }
                    else {
                        $baseLevelHolder.stop().animate({
                            marginLeft: 0
                        }, function() {
                            $baseLevelHolder.children('ul').first().show(500, function() {
                                expandingObjects[ 'baseAnimEnded' ] = true;
                                animatedEventCallback(expandingObjects, callbacks);
                            });
                        });
                    }
                    blpush = (instance.settings.fullCollapse) ? $baseLevelHolder.width() : $baseLevelHolder.width() - instance.settings.overlapWidth;
                    var pushbm = (!menuExpanded($baseLevelHolder)) ? pushContainers(blpush) : null;
                } else {
                    var $selectedLevelHolder;
                    if (typeof menuTitle == 'object') {
                        $selectedLevelHolder = menuTitle;
                    }
                    else if (typeof menuTitle == 'string') {
                        $selectedLevelHolder = findMenusByTitle(menuTitle);
                    }
                    else {
                        $selectedLevelHolder = null;
                        $.error('Provided menu selector is not valid');
                    }
                    if ($selectedLevelHolder && $selectedLevelHolder.length == 1) {
                        var $activeLevelHolder = activeMenu(),
                                activeLevel = ($activeLevelHolder.length == 1) ? $activeLevelHolder.attr('data-level') : 0,
                                baseWidth = $selectedLevelHolder.width(),
                                setToOpenHolders = pathToRoot($selectedLevelHolder);
                        expandingObjects[ 'setToOpenAnimEnded' ] = false;
                        if (setToOpenHolders) {
                            var parentLevelHoldersLen = $(setToOpenHolders).length - 1;
                            $baseLevelHolder.find('ul').each(function() {
                                $(this).show(0);
                            });
                            $(setToOpenHolders).find('ul').css('visibility', 'hidden');
                            $(setToOpenHolders).find('div').css('visibility', 'visible');
                            $(setToOpenHolders).find('.' + instance.settings.backItemClass).css('visibility', 'hidden');
                            $(setToOpenHolders).each(function(key, val) {
                                ieShadowFilterDistortion = ($(val).css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) ? $(val).get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength : 0;
                                lwidth = baseWidth - ieShadowFilterDistortion + (parentLevelHoldersLen - $(val).attr('data-level')) * (instance.settings.overlapWidth + ieShadowFilterDistortion);
                                if (instance.settings.container.width() < lwidth && instance.settings.mode == 'overlap')
                                    sizeElementWidth(instance.settings.container, lwidth);
                                if (instance.settings.direction == 'rtl') {
                                    $(val).stop().animate({
                                        marginRight: 0,
                                        width: (instance.settings.mode == 'overlap') ? lwidth : baseWidth - ieShadowFilterDistortion
                                    }, function() {
                                        $(val).addClass(instance.settings.menuInactiveClass);
                                    });
                                }
                                else {
                                    $(val).stop().animate({
                                        marginLeft: 0,
                                        width: (instance.settings.mode == 'overlap') ? lwidth : baseWidth - ieShadowFilterDistortion
                                    }, function() {
                                        $(val).addClass(instance.settings.menuInactiveClass);
                                    });
                                }
                            });
                            $(setToOpenHolders).last().queue(function() {
                                $(this).removeClass(instance.settings.menuInactiveClass);
                                expandingObjects[ 'setToOpenAnimEnded' ] = true;
                                animatedEventCallback(expandingObjects, callbacks);
                            });
                            if (baseLevelHolderCollapsed) {
                                blpush = (instance.settings.fullCollapse) ? $baseLevelHolder.width() : ($baseLevelHolder.width() - instance.settings.overlapWidth);
                                pushContainers(blpush);
                            }
                            if (instance.settings.mode == 'overlap') {
                                lpush = ((baseLevelHolderCollapsed) ? (baseWidth + (parentLevelHoldersLen - ((instance.settings.fullCollapse) ? 0 : 1)) * (instance.settings.overlapWidth + ieShadowFilterDistortion)) : ((parentLevelHoldersLen - activeLevel) * (instance.settings.overlapWidth + ieShadowFilterDistortion)));
                                pushContainers(lpush);
                            }
                            $selectedLevelHolder.css('visibility', 'visible');
                            $selectedLevelHolder.find('.' + instance.settings.backItemClass).css('visibility', 'visible');
                            $selectedLevelHolder.find('ul').css('visibility', 'visible');
                            $selectedLevelHolder.removeClass(instance.settings.menuInactiveClass);
                        }
                        else {
                            $.error('Invalid menu object provided');
                        }
                    }
                    else {
                        $.error('No or too many menus named ' + menuTitle);
                    }
                }
                expandingObjects[ 'expandingEnded' ] = true;
                animatedEventCallback(expandingObjects, callbacks);
            }

            // Expand menu
            function expandMenu() {
                var menu = arguments[0],
                        $expandLevelHolder,
                        $activeLevelHolder = activeMenu(),
                        $sharedLevelHolders, collapseLevel, $searchRes;
                if (typeof menu == 'object') {
                    $expandLevelHolder = menu;
                }
                else if (typeof menu == 'string') {
                    $searchRes = findMenusByTitle(menu);
                    if ($searchRes) {
                        $expandLevelHolder = $searchRes.eq(0);
                    }
                    else {
                        $.error(menu + ' menu level does not exist!');
                    }
                }
                else {
                    $expandLevelHolder = $('#' + instance.settings.menuID + ' div.levelHolderClass:first');
                }
                $sharedLevelHolders = comparePaths($expandLevelHolder, $activeLevelHolder, true);
                collapseLevel = ($sharedLevelHolders.length > 0) ? Math.max.apply(null,
                        $sharedLevelHolders.map(function() {
                    return $(this).attr('data-level');
                }).get()) : 0;
                if (collapseLevel < $activeLevelHolder.attr('data-level')) {
                    collapseMenu(collapseLevel, [{'method': expandMenuActions, 'args': arguments}]);
                }
                else {
                    expandMenuActions.apply(this, Array.prototype.slice.call(arguments));
                }
                return $this;
            }

            // Find menu(s) by Title text
            function findMenusByTitle() {
                var menuTitle = arguments[0],
                        response,
                        $selectedLevelHolders = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                        .filter(function() {
                    return (($(this).children('h2').text() == menuTitle));
                });
                if ($selectedLevelHolders.length > 0) {
                    returnValue = $selectedLevelHolders;
                    response = returnValue;
                }
                else {
                    returnValue = false;
                    response = returnValue;
                }
                return response;
            }

            // Find item(s) by Name
            function findItemsByName() {
                var itemName = arguments[0],
                        response,
                        $selectedItems = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass li')
                        .filter(function() {
                    return (($(this).children('a').text() == itemName));
                });
                if ($selectedItems.length > 0) {
                    returnValue = $selectedItems;
                    response = returnValue;
                }
                else {
                    returnValue = false;
                    response = returnValue;
                }
                return response;
            }

            // Find pathToRoot for provided menu
            function pathToRoot() {
                var $selectedLevelHolder = arguments[0],
                        $parentLevelHolders, setToOpenHolders, response;
                if ($selectedLevelHolder == undefined || $selectedLevelHolder.length != 1) {
                    returnValue = false;
                    return returnValue;
                }
                ;
                $parentLevelHolders = $selectedLevelHolder.parents('div.levelHolderClass');
                setToOpenHolders = $.merge($parentLevelHolders.get().reverse(), $selectedLevelHolder.get());
                returnValue = setToOpenHolders;
                return returnValue;
            }

            // Finds the same part of the path to root of two provided menus 
            function comparePaths() {
                var $levelHolder0 = arguments[0],
                        $levelHolder1 = arguments[1],
                        mode = (arguments[2] != undefined) ? arguments[2] : false,
                        $parentLevelHolders0, $parentLevelHolders1, setParents0, setParents1, lPath, sPath, comparePath, response;
                if ($levelHolder0 == undefined || $levelHolder1 == undefined) {
                    returnValue = false;
                    return returnValue;
                }
                ;
                $parentLevelHolders0 = ($levelHolder0.length == 1) ? $levelHolder0.parents('div.levelHolderClass') : null;
                $parentLevelHolders1 = ($levelHolder1.length == 1) ? $levelHolder1.parents('div.levelHolderClass') : null;
                setParents0 = ($parentLevelHolders0 != null) ? $.merge($parentLevelHolders0.get().reverse(), $levelHolder0.get()) : [];
                setParents1 = ($parentLevelHolders1 != null) ? $.merge($parentLevelHolders1.get().reverse(), $levelHolder1.get()) : [];
                lPath = (setParents0.length >= setParents1.length) ? setParents0 : setParents1;
                sPath = (lPath === setParents0) ? setParents1 : setParents0;
                comparePath = $(lPath).filter(function() {
                    return (mode) ? ($.inArray(this, sPath) != -1) : ($.inArray(this, sPath) == -1);
                });
                returnValue = comparePath;
                return returnValue;
            }

            // Active menu
            function activeMenu() {
                var $activeLevelHolders = instance.settings.container
                        .find('#' + instance.settings.menuID + ' div.levelHolderClass')
                        .filter(function() {
                    var retObjs = (instance.settings.direction == 'rtl') ?
                            ((parseInt($(this).css('margin-right')) >= 0 && $(this).position().left < instance.settings.container.width() - instance.settings.overlapWidth))
                            :
                            ((parseInt($(this).css('margin-left')) >= 0 && $(this).position().left >= 0));
                    return retObjs;
                }),
                        maxLevel = Math.max.apply(null,
                        $activeLevelHolders.map(function() {
                    return $(this).attr('data-level');
                }).get()),
                        $activeLevelHolder = $activeLevelHolders.filter(function() {
                    return $(this).attr('data-level') == maxLevel;
                });
                returnValue = $activeLevelHolder;
                return returnValue;
            }

            // Menu expanded
            function menuExpanded() {
                var $levelHolder = arguments[0],
                        returnValue = false;
                if ($levelHolder == undefined)
                    return returnValue;

                var check = (instance.settings.direction == 'rtl') ?
                        (parseInt($levelHolder.css('margin-right')) >= 0 && $levelHolder.position().left < instance.settings.container.width() - instance.settings.overlapWidth)
                        :
                        (parseInt($levelHolder.css('margin-left')) >= 0 && $levelHolder.position().left >= 0);
                return check;
            }

            // Add item(s)
            function addItems() {
                var items = arguments[0],
                        $levelHolder = arguments[1],
                        position = arguments[2];
                if ($levelHolder == undefined || typeof items != 'object' || !$levelHolder)
                    return false;
                if (items.level == undefined)
                    items.level = parseInt($levelHolder.attr('data-level'), 10);
                if (position == undefined)
                    position = 0;
                var $itemGroup = $levelHolder.find('ul:first');
                $.each(items, function() {
                    if (this.name != undefined)
                        createItem(this, $levelHolder, position);
                });
                sizeDOMelements(instance.menuWidth);
                return $this;
            }

            // Remove item(s)
            function removeItems() {
                var $items = arguments[0];
                if ($items == undefined || typeof $items != 'object' || $items.length == 0)
                    return false;
                $items.remove();
                var $activeMenu = activeMenu();
                if ($activeMenu.length == 1) {
                    $activeMenu.css('visibility', 'visible');
                    $activeMenu.find('.' + instance.settings.backItemClass).css('visibility', 'visible');
                    $activeMenu.find('ul').css('visibility', 'visible');
                    $activeMenu.removeClass(instance.settings.menuInactiveClass);
                    var widthDiff = $activeMenu.width() - instance.menuWidth;
                    if (widthDiff != 0) {
                        var $visibleLevelHolders = visibleLevelHolders();
                        if ($visibleLevelHolders)
                            $visibleLevelHolders.each(function() {
                                $(this).width($(this).width() - widthDiff);
                            });
                    }
                }
                sizeDOMelements(instance.menuWidth);
                return $this;
            }

            // Manage multiple animated events and associated callbacks
            function animatedEventCallback(animatedObjects, callbacks) {
                var doCallBack = true;
                $.each(animatedObjects, function(key, val) {
                    doCallBack = doCallBack && val;
                });
                if (doCallBack)
                    window.setTimeout(function() {
                        $.each(callbacks, function(key, val) {
                            val['method'].apply(this, Array.prototype.slice.call(val['args']));
                        });
                    }, 1);
            }

            // Get/set settings options
            function manageOptions() {
                var response = false;
                if (instance.settings[arguments[0]] != undefined) {
                    if (arguments[1] != undefined)
                        instance.settings[arguments[0]] = arguments[1];
                    response = instance.settings[arguments[0]];
                } else {
                    $.error('No option ' + arguments[0] + ' found in jQuery.multilevelpushmenu');
                }
                return response;
            }

            // Mobile check
            // http://coveroverflow.com/a/11381730/989439
            function mobileCheck() {
                var check = false;
                (function(a) {
                    if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                        check = true
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            }

            if (mobileCheck()) {
                clickEventType = 'touchend';
                dragEventType = 'touchmove';
            }
            else {
                clickEventType = 'click';
                dragEventType = 'mousedown';
            }

            // Invoke called method or init
            if (methods[options]) {
                returnValue = methods[options].apply(this, Array.prototype.slice.call(args, 1));
                return returnValue;
            } else if (typeof options === 'object' || !options) {
                returnValue = methods.init.apply(this, arguments);
                return returnValue;
            } else {
                $.error('No ' + options + ' method found in jQuery.multilevelpushmenu');
            }

            // Return object instance or option value
            if (!returnValue) {
                returnValue = this;
            }
        });
        return returnValue;
    }
}(jQuery));