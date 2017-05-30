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
                    console.log('Connection emit: room -> ' + room_id + ', user -> ' + cookies.identifier);
                }

                const button_element = document.getElementById('throw-a-coin-button');

                if (button_element) {
                    button_element.addEventListener('click', function (event) {
                        event.stopPropagation();
                        event.preventDefault();

                        var tmp = new Uint8Array(1);
                        window.crypto.getRandomValues(tmp);

                        const random_value = tmp[0];

                        socket.emit('protocol initialization', room_id, cookies.identifier, random_value);

                        if (cookies.debug) {
                            console.log('Protocol initialization emit: room -> ' + room_id + ', user -> ' + cookies.identifier + ', random value -> ' + random_value);
                        }

                        socket.on('protocol parity check', function (asked_room_id, asked_user_id, asked_parity) {
                            if (cookies.debug) {
                                console.log('Protocol parity check event: room -> ' + asked_room_id + ', user -> ' + asked_user_id + ', parity -> ' + asked_parity);
                            }

                            if ((asked_room_id === room_id) && (asked_user_id !== cookies.identifier)) {
                                console.log((asked_parity === (random_value % 2)) ? 'fail' : 'sukces');
                            }
                        });
                    });
                }
            });

            const invite_form = document.getElementById('room-show-invite-form');

            const invite_button = document.getElementById('room-show-invite-button');

            if (invite_form && invite_button) {
                invite_form.addEventListener('submit', show_hidden);

                invite_button.addEventListener('click', show_hidden);
            }

            socket.on('is anybody here', function (asked_room_id) {
                if (cookies.debug) {
                    console.log('Is anybody here event: room -> ' + asked_room_id);
                }

                if (asked_room_id === room_id) {
                    socket.emit('i am here', room_id, cookies.identifier);

                    if (cookies.debug) {
                        console.log('I am here emit: room -> ' + room_id + ', user -> ' + cookies.identifier);
                    }
                }
            });

            socket.on('somebody is here', function (asked_room_id, asked_user_id) {
                if (cookies.debug) {
                    console.log('Somebody is here event: room -> ' + asked_room_id + ', user -> ' + asked_user_id);
                }

                if ((asked_room_id === room_id) && (asked_user_id !== cookies.identifier)) {
                    friend_online = true;

                    set_friend_status(friend_online);
                }
            });

            socket.on('somebody is leaving', function (asked_room_id, asked_user_id) {
                if (cookies.debug) {
                    console.log('Somebody is leaving event: room -> ' + asked_room_id + ', user -> ' + asked_user_id);
                }

                if (asked_room_id === room_id) {
                    friend_online = false;

                    set_friend_status(friend_online);
                }
            });

            socket.on('protocol hashed value', function (asked_room_id, asked_user_id, asked_hashed_value) {
                if (cookies.debug) {
                    console.log('Protocol hashed value event: room -> ' + room_id + ', user -> ' + cookies.identifier + ', hashed value -> ' + asked_hashed_value);
                }

                if ((asked_room_id === room_id) && (asked_user_id !== cookies.identifier)) {
                    var tmp = new Uint8Array(1);
                    window.crypto.getRandomValues(tmp);

                    const random_value = tmp[0] % 2;

                    socket.emit('protocol parity', room_id, cookies.identifier, random_value);

                    if (cookies.debug) {
                        console.log('Protocol parity emit: room -> ' + room_id + ', user -> ' + cookies.identifier + ', parity -> ' + random_value);
                    }

                    socket.on('protocol original number', function (asked_room_id, asked_user_id, asked_random_number) {
                        if (cookies.debug) {
                            console.log('Protocol original number event: room -> ' + asked_room_id + ', user -> ' + asked_user_id + ', random number -> ' + asked_random_number);
                        }

                        if ((asked_room_id === room_id) && (asked_user_id === cookies.identifier)) { // @TODO
                            console.log((random_value === (asked_random_number % 2)) ? 'sukces' : 'fail');
                        }
                    });
                }
            });

            window.addEventListener('unload', function () {
                socket.emit('disconnection', room_id, cookies.identifier);

                console.log('Disconnection emit: room -> ' + room_id + ', user -> ' + cookies.identifier);
            });
        }
    });
});
