'use strict';

document.addEventListener('DOMContentLoaded', function () {
    function show_hidden(event) {
        event.preventDefault();

        const next_element = this.nextElementSibling;
        if ((next_element.tagName.toLowerCase() === 'a') && (next_element.className.indexOf('hidden') !== false)) {
            const classes = next_element.className.split(' ');

            classes.forEach(function (name, index) {
                if (name === 'hidden') {
                    classes.splice(index, 1);
                }
            });

            next_element.className = classes.join(' ');

            this.remove();
        }
    }

    Array.from(document.getElementsByClassName('container')).forEach(function (element) {
        if (element.id === 'room-show-container') {
            document.getElementById('room-show-invite-form').addEventListener('submit', show_hidden);

            document.getElementById('room-show-invite-button').addEventListener('click', show_hidden);
        }
    });
});
