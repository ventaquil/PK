'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    function create_room(event) {
        event.preventDefault();

        const xhttp = new XMLHttpRequest();
        xhttp.addEventListener('readystatechange', function () {
            if ((this.readyState === 4) && (this.status === 200)) {
                const data = JSON.parse(this.responseText);

                if (data.success) {
                    window.location.href = ['', 'room', data.href].join('/');
                }
            }
        });
        xhttp.open('post', '/create', true);
        xhttp.send();
    }

    Array.from(document.getElementsByClassName('container')).forEach(function (element) {
        if (element.id === 'homepage-index-container') {
            document.getElementById('homepage-index-form').addEventListener('submit', create_room);

            document.getElementById('homepage-index-submit').addEventListener('click', create_room);
        }
    });
});
