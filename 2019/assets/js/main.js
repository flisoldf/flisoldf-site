var apiUrl = 'http://api.flisoldf.blog.local';

$().ready(function () {
    demo.verticalDots();
    demo.initContactUsMap2();
    $('body').materialScrollTop();

    prepareFormSubmit('#pl-form', '/talk', 'Submetendo a palestra...');
});

window.onscroll = () => {
    const brand = document.querySelector('.navbar-brand');

    if (this.scrollY <= 500) {
        $(brand).hide();
    } else {
        $(brand).show();
    }
};

/**
 * Prepare form to submission.
 * 
 * @param {*} formId Form identification.
 * @param {*} targetUrl URL of target.
 * @param {*} waitingMessage Message show then user is waiting.
 */
function prepareFormSubmit(formId, targetUrl, waitingMessage) {
    var form = $(formId);
    var submit = $('input[type="submit"]', form);

    submit.click(function (event) {
        // Stop submit the form, we will post it manually.
        event.preventDefault();

        // Display a loading modal
        $('body').loadingModal({
            position: 'auto',
            text: waitingMessage,
            color: '#fff',
            opacity: '0.7',
            backgroundColor: 'rgb(0,0,0)',
            animation: 'doubleBounce'
        });

        // Create an FormData object 
        var data = new FormData(form[0]);

        // If you want to add an extra field for the FormData
        // data.append("CustomField", "This is some extra data, testing");

        // disabled the submit button
        submit.prop('disabled', true);

        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: apiUrl + targetUrl,
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                // Hide and destroy the loading modal
                $('body').loadingModal('hide');
                $('body').loadingModal('destroy');

                // console.log('SUCCESS : ', data);
                submit.prop('disabled', false);
                bootbox.alert(data.message);
            },
            error: function (e) {
                // Hide and destroy the loading modal
                $('body').loadingModal('hide');
                $('body').loadingModal('destroy');

                // console.log('ERROR : ', e);
                submit.prop('disabled', false);
                bootbox.alert(e.responseJSON.message);
            }
        });
    });
}