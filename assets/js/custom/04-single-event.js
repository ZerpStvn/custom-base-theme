(function () {
    'use strict';

    if (window !== window.top) {
        document.documentElement.classList.add('in-iframe');
        return;
    }

    jQuery(document).ready(function ($) {
        var modal     = document.getElementById('date-picker-modal');
        if (!modal) return;

        var close     = document.getElementById('date-picker-close');
        var cancel    = document.getElementById('date-picker-cancel');
        var nextBtn   = document.getElementById('dp-next');
        var backBtn   = document.getElementById('dp-back');
        var submitBtn = document.getElementById('rsvp-submit');
        var doneClose = document.getElementById('dp-done-close');
        var errorEl   = document.getElementById('rsvp-error');
        var step1     = document.getElementById('dp-step-1');
        var step2     = document.getElementById('dp-step-2');
        var step3     = document.getElementById('dp-step-3');
        var atcGoogle = document.getElementById('dp-atc-google');
        var atcIcal   = document.getElementById('dp-atc-ical');

        var eventId   = modal.getAttribute('data-event-id');
        var evTitle   = modal.getAttribute('data-event-title') || '';
        var startDt   = modal.getAttribute('data-start-dt')   || '';
        var endDt     = modal.getAttribute('data-end-dt')     || '';
        var location  = modal.getAttribute('data-location')   || '';
        var evUrl     = modal.getAttribute('data-event-url')  || '';

        var selectedTicketId = null;

        function buildGcalUrl() {
            return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
                + '&text='     + encodeURIComponent(evTitle)
                + '&dates='    + startDt + '/' + endDt
                + '&location=' + encodeURIComponent(location)
                + '&details='  + encodeURIComponent(evUrl);
        }

        function downloadIcal() {
            var ics = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//cbtheme//single-event//EN',
                'BEGIN:VEVENT',
                'DTSTART:'  + startDt,
                'DTEND:'    + endDt,
                'SUMMARY:'  + evTitle,
                'LOCATION:' + location,
                'URL:'      + evUrl,
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'event.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }

        function showStep(n) {
            step1.hidden = n !== 1;
            step2.hidden = n !== 2;
            step3.hidden = n !== 3;
            if (n === 3 && atcGoogle) {
                atcGoogle.href = buildGcalUrl();
            }
        }

        $('.js-date-picker-open').on('click', function () {
            $('[name="rsvp_ticket"]', modal).prop('checked', false);
            document.getElementById('rsvp-form').reset();
            $(errorEl).prop('hidden', true);
            selectedTicketId = null;
            nextBtn.disabled = true;
            showStep(1);
            modal.showModal();
        });

        $(modal).on('change', '[name="rsvp_ticket"]', function () {
            selectedTicketId = this.value;
            nextBtn.disabled = false;
        });

        $(nextBtn).on('click', function () { showStep(2); });
        $(backBtn).on('click', function () { showStep(1); });

        if (atcIcal) {
            $(atcIcal).on('click', downloadIcal);
        }

        $(submitBtn).on('click', function () {
            var first = $('#rsvp-first-name').val().trim();
            var last  = $('#rsvp-last-name').val().trim();
            var email = $('#rsvp-email').val().trim();

            if (!first || !last || !email) {
                $(errorEl).text('Please fill in all fields.').prop('hidden', false);
                return;
            }

            submitBtn.disabled = true;
            $(errorEl).prop('hidden', true);

            $.post(bfRsvp.ajaxurl, {
                action:     'bf_rsvp_submit',
                nonce:      bfRsvp.nonce,
                ticket_id:  selectedTicketId,
                event_id:   eventId,
                first_name: first,
                last_name:  last,
                email:      email,
            })
            .done(function (res) {
                if (res.success) {
                    showStep(3);
                } else {
                    $(errorEl).text(res.data.message || 'Something went wrong.').prop('hidden', false);
                    submitBtn.disabled = false;
                }
            })
            .fail(function () {
                $(errorEl).text('Network error. Please try again.').prop('hidden', false);
                submitBtn.disabled = false;
            });
        });

        function closeModal() { modal.close(); }
        $(close).on('click', closeModal);
        $(cancel).on('click', closeModal);
        $(doneClose).on('click', closeModal);
        $(modal).on('click', function (e) {
            if (e.target === modal) closeModal();
        });
    });
}());
