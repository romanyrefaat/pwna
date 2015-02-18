// // ########################################
// ########## PAGE LOAD HANDLERS ##########
// ########################################
(function($) {
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
        $('.bootstrap-dialog').removeClass('type-info,type-default').addClass('type-danger');
        $('.bootstrap-dialog-footer-buttons .btn').removeClass('btn-primary,btn-default').addClass('btn-danger');
        $('.bootstrap-dialog-title').html('<i class="fa fa-times"></i> Error');
        $('.bootstrap-dialog-message').html(message);
    }
    function modal2Success(modal, message) {
        modal.enableButtons(true);
        modal.setClosable(true);
        $('.bootstrap-dialog').removeClass('type-info,type-default').addClass('type-success');
        $('.bootstrap-dialog-footer-buttons .btn').removeClass('btn-primary,btn-danger,btn-default').addClass('btn-success');
        $('.bootstrap-dialog-title').html('<i class="fa fa-check"></i> Success');
        $('.bootstrap-dialog-message').html(message);
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
                $(this).parent('.input-group').removeClass('has-error');
                $('label[for="' + fieldName + '"]').removeClass('error');
                if ($(this).attr('type') === 'radio') {
                    if (!$('input[name="' + fieldName + '"]:checked').val()) {
                        $('label[for="' + fieldName + '"]').addClass('error');
                        hasErrors = true;
                    }
                } else {
                    var fieldValue = $.trim($(this).val());
                    if (fieldValue === '') {
                        $(this).parent('.input-group').addClass('has-error');
                        hasErrors = true;
                    }
                }
            });
            var customValidationErrors = luminateExtend.utils.ensureArray(settings.customFormValidation());
            if (customValidationErrors.length > 0) {
                hasErrors = true;
                errMessages.push(customValidationErrors);
            }
            if (hasErrors) {
                if (errMessages.length > 0) {
                    var errorsList;
                    if (errMessages.length > 1) {
                        errorsList = $('<ul></ul>');
                        for (var i = 0; i < errMessages.length; i++) {
                            errorsList.append($('<li>' + errMessages[i] + '</li>'));
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
        var elem = $(this);
        elem.bindLuminateForm({
            customFormValidation: function() {
                var errors = [];
                var emailField = elem.find('input[name="cons_email"]');
                if ($.trim(emailField.val()) === '') {
                    errors.push('Please enter your email address.');
                }
                return errors;
            }
        });
        return this;
    }
    window.emailSignupCallback = {
        error: function(data) {
            //alertError(data.errorResponse.message);
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
                window.luminateSubmitForm.get(0).reset();
                modal2Success(window.luminateSubmitDialog, 'Thank you for signing up!')
            }
            // TODO: Check if we remove sign up forms after submission
            window.luminateSubmitForm.bindSignupForm();
        }
    };
    $('.js-signup-form').each(function() {
        $(this).bindSignupForm();
    });
    if ($(window).width() > 769) {
        $('.navbar .dropdown > a').click(function() {
            location.href = this.href;
        });
    }
    // Fix payment type radio check due to .attr vs .prop
    $('.payment-type-option').click(function() {
        $(this).find('input').prop('checked', true);
    });
})(jQuery);