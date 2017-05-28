'use strict';

var cookies;
var socket;

document.addEventListener('DOMContentLoaded', function () {
    const jsOnlyElements = Array.prototype.slice.call(document.getElementsByClassName('js-only'));

    jsOnlyElements.forEach(function (element) {
        element.className = element.className.replace('js-only', '').trim();
    });

    cookies = {};
    var splited = document.cookie.split(';');
    for (var key in splited) {
        var cookie = splited[key].split('=');

        cookies[cookie[0].trim()] = cookie[1];
    }

    socket = io();
});
