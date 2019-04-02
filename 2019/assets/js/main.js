var apiUrl = 'http://api.flisoldf.blog.local';

$().ready(function () {
    demo.verticalDots();
    demo.initContactUsMap2();
    $('body').materialScrollTop();

    prepareFormSubmit('#pl-form', '/talks', 'Submetendo a palestra...', (formId, targetUrl, waitingMessage) => {
        $('#pl-success').show();
        $('#pl-area').hide();
        $(formId)[0].reset();
    });
    $('#pl-success a').click(() => {
        $('#pl-success').hide();
        $('#pl-area').show();
    });

    prepareFormSubmit('#cpc-form', '/collaborators', 'Enviando o pedido...', (formId, targetUrl, waitingMessage) => {
        $('#cpc-success').show();
        $('#cpc-area').hide();
        $(formId)[0].reset();
    });
    $('#cpc-success a').click(() => {
        $('#cpc-success').hide();
        $('#cpc-area').show();
    });

    var deadline = 'April 27 2019 08:00:00 GMT-0300';
    initializeClock('clockdiv', deadline);

    if (!window.location.hash) {
        $('#clockdiv').show();
    }
});

window.onscroll = () => {
    const brand = document.querySelector('.navbar-brand');

    if (this.scrollY <= 500) {
        $(brand).hide();
    } else {
        $(brand).show();
    }

    if (this.scrollY <= 120) {
        $('#clockdiv').show();
    } else {
        $('#clockdiv').hide();
    }
};

/**
 * Prepare form to submission.
 *
 * @param {*} formId Form identification.
 * @param {*} targetUrl URL of target.
 * @param {*} waitingMessage Message show then user is waiting.
 * @param {*} afterAction Action to do after all.
 */
function prepareFormSubmit(formId, targetUrl, waitingMessage, afterAction) {
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

                if (afterAction) {
                    afterAction(formId, targetUrl, waitingMessage);
                }
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

/**
 * Count down of event.
 */
function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
        var t = getTimeRemaining(endtime);

        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}