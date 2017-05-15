'use strict';

document.addEventListener('DOMContentLoaded', function () {
    function createRoom(event) {
        event.preventDefault();

        // @TODO AJAX call here
    }

    Array.from(document.getElementsByClassName('container')).forEach(function (element) {
        if (element.id === 'homepage-index-container') {
            document.getElementById('homepage-index-form').addEventListener('submit', createRoom);

            document.getElementById('homepage-index-submit').addEventListener('submit, click', createRoom);
        }
    });
});
