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

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.innerText = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    function saveTextToLocalStorage(text) {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-MM-SS
        const key = `jp-reading-bookmark_${dateStr}_${timeStr}`;
        localStorage.setItem(key, text);
    }

    function displaySavedText() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('jp-reading-bookmark_'));
        keys.forEach(key => {
            const text = localStorage.getItem(key);
            const div = document.createElement('div');
            div.style.margin = '10px';
            div.style.padding = '10px';
            div.style.border = '1px solid #ccc';
            div.style.backgroundColor = '#f9f9f9';
            div.innerText = text;
            document.body.appendChild(div);
        });
    }

    if (checkUrl(window.location.href)) {
        document.addEventListener('mouseup', () => {
            const highlightedText = getHighlightedText();
            // saveTextToFile(highlightedText);
            saveTextToLocalStorage(highlightedText);
            showNotification('Text saved successfully!');
        });
    }

    window.addEventListener('load', displaySavedText);
})();