'use strict';

var room_id;
var myfriend = false;

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
            const room_id_element = document.getElementById('room-id');

            if (room_id_element) {
                room_id = room_id_element.value;
            }

            window.addEventListener('load', function () {
                socket.emit('connection', 'connection');
            });

            const invite_form = document.getElementById('room-show-invite-form');

            const invite_button = document.getElementById('room-show-invite-button');

            if (invite_form && invite_button) {
                invite_form.addEventListener('submit', show_hidden);

                invite_button.addEventListener('click', show_hidden);
            }

            socket.on('isanybodyhere', function (msg) {
                socket.emit('iamhere', {user_id: cookies.identifier, room_id: room_id});
            });

            socket.on('somebodyishere', function (msg) {
                if (msg.room_id == room_id && msg.user_id != cookies.identifier) {
                    myfriend = true;
                    alert(myfriend);
                }
            });

            window.addEventListener('unload', function () {
                socket.emit('disconnection', 'disconnection');
            });
        }
    });
});
