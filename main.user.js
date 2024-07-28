// ==UserScript==
// @name         Example Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save highlighted text to a local file using FileSaver.js
// @author       You
// @match        http://*/*
// @match        https://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function logMessage(message) {
        console.log(message);
    }

    function checkUrl(path) {
        const targetUrl = 'https://itazuranekoyomi';
        if (path.startsWith(targetUrl)) {
            logMessage('You are on the target URL!');
            return true;
        } else {
            logMessage('This is not the target URL.');
            return false;
        }
    }

    function getHighlightedText() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            return selection.toString().trim();
        }
        return null;
    }

    function saveTextToFile(text) {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-MM-SS
        const directory = 'jp-reading-bookmark/';
        const fileName = `${directory}${dateStr}_${timeStr}.txt`;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, fileName);
    }

    if (checkUrl(window.location.href)) {
        document.addEventListener('mouseup', () => {
            const highlightedText = getHighlightedText();
            saveTextToFile(highlightedText);
        });
    }
})();