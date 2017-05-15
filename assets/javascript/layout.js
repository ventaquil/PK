'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const jsOnlyElements = Array.prototype.slice.call(document.getElementsByClassName('js-only'));

    jsOnlyElements.forEach(function (element) {
        element.className = element.className.replace('js-only', '').trim();
    });
});
