'use strict';

var room_id;
var friend_online = false;

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
                socket.emit('connection', room_id, cookies.identifier);

                if (cookies.debug) {
                    console.log('Connection event: user -> ' + cookies.identifier + ', room -> ' + room_id);
                }
            });

            const invite_form = document.getElementById('room-show-invite-form');

            const invite_button = document.getElementById('room-show-invite-button');

            if (invite_form && invite_button) {
                invite_form.addEventListener('submit', show_hidden);

                invite_button.addEventListener('click', show_hidden);
            }

            socket.on('isanybodyhere', function (asked_room_id) {
                if (cookies.debug) {
                    console.log('Isanybodyhere event: room -> ' + asked_room_id);
                }

                if (asked_room_id === room_id) {
                    socket.emit('iamhere', room_id, cookies.identifier);

                    if (cookies.debug) {
                        console.log('Iamhere event: user -> ' + cookies.identifier + ', room -> ' + room_id);
                    }
                }
            });

            socket.on('somebodyishere', function (asked_room_id, asked_user_id) {
                if (cookies.debug) {
                    console.log('Somebodyishere event: user -> ' + asked_user_id + ', room -> ' + asked_room_id);
                }

                if ((asked_room_id === room_id) && (asked_user_id !== cookies.identifier)) {
                    friend_online = true;

                    alert("Friend connected to room");
                }
            });

            socket.on('somebodyisleaving', function (asked_room_id, asked_user_id) {
                if (cookies.debug) {
                    console.log('Somebodyisleaving event: user -> ' + asked_user_id + ', room -> ' + asked_room_id);
                }

                if (asked_room_id === room_id) {
                    friend_online = false;

                    alert("Friend has leaved this room");
                }
            });

            window.addEventListener('unload', function () {
                socket.emit('disconnection', room_id, cookies.identifier);

                console.log('Disconnection event: user -> ' + cookies.identifier + ', room -> ' + room_id);
            });
        }
    });
});
