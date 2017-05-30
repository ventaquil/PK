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

    function set_friend_status(status) {
        const join_element = document.getElementById('join-subcontainer');

        if (join_element) {
            join_element.className = 'hidden';
        }

        const action_element = document.getElementById('action-subcontainer');

        if (action_element) {
            action_element.className = '';

            const status_element = document.getElementById('your-friend-status');

            if (status_element) {
                status_element.className = status ? 'online' : 'offline';

                status_element.textContent = status_element.className.charAt(0).toUpperCase() + status_element.className.slice(1);
            }

            const button_element = document.getElementById('throw-a-coin-button');

            if (button_element) {
                if (status) {
                    button_element.removeAttribute('disabled');
                } else {
                    button_element.setAttribute('disabled', 'disabled');
                }
            }
        }
    }

    Array.from(document.getElementsByClassName('container')).forEach(function (element) {
        if (element.id === 'room-show-container') {
            var room_id = 0;
            var friend_online = false;

            const room_id_element = document.getElementById('room-id');

            if (room_id_element) {
                room_id = room_id_element.value;
            }

            window.addEventListener('load', function () {
                socket.emit('connection', room_id, cookies.identifier);

                if (cookies.debug) {
                    console.log('Connection event: user -> ' + cookies.identifier + ', room -> ' + room_id);
                }

                const button_element = document.getElementById('throw-a-coin-button');

                if (button_element) {
                    button_element.addEventListener('click', function(event) {
                        event.stopPropagation();
                        event.preventDefault();

                        var tmp = new Uint8Array(1);
                        window.crypto.getRandomValues(tmp);

                        const randomValue = tmp[0];

                        socket.emit('protocol initialization', room_id, cookies.identifier, randomValue);
                    });
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

                    set_friend_status(friend_online);
                }
            });

            socket.on('somebodyisleaving', function (asked_room_id, asked_user_id) {
                if (cookies.debug) {
                    console.log('Somebodyisleaving event: user -> ' + asked_user_id + ', room -> ' + asked_room_id);
                }

                if (asked_room_id === room_id) {
                    friend_online = false;

                    set_friend_status(friend_online);
                }
            });

            window.addEventListener('unload', function () {
                socket.emit('disconnection', room_id, cookies.identifier);

                console.log('Disconnection event: user -> ' + cookies.identifier + ', room -> ' + room_id);
            });
        }
    });
});
