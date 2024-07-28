// ==UserScript==
// @name         JP-reading-bookmark
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
        logMessage(`Saving text to local storage: ${text}`);
        localStorage.setItem(key, text);
    }

    function getLatestSavedText() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('jp-reading-bookmark_'));
        if (keys.length > 0) {
            const latestKey = keys.sort().pop();
            const text = localStorage.getItem(latestKey);
            logMessage(`Displaying latest saved text: ${text}`);
            return text;
        }
        return null;
    }

    // function searchAndMoveToText() {
    //     const text = getLatestSavedText();
    //     if (!text) {
    //         logMessage('No text found to enter.');
    //         return;
    //     }
    //     window.find(text);
    // }

    // function pressCtrlF() {
    //     const ctrlFEvent = new KeyboardEvent('keydown', {
    //         key: 'f',
    //         code: 'KeyF',
    //         keyCode: 70,
    //         ctrlKey: true,
    //         bubbles: true,
    //         cancelable: true
    //     });
    //     document.dispatchEvent(ctrlFEvent);
    // }

    // // Add an event listener to respond to the Ctrl+F event
    // document.addEventListener('keydown', function(event) {
    //     if (event.ctrlKey && event.key === 'f') {
    //         event.preventDefault();
    //         console.log('Ctrl+F was pressed');
    //         // Add your custom action here
    //     }
    // });

    if (checkUrl(window.location.href)) {
        document.addEventListener('mouseup', () => {
            const highlightedText = getHighlightedText();
            // saveTextToFile(highlightedText);
            saveTextToLocalStorage(highlightedText);
        });
    }

    window.addEventListener('load', showNotification(getLatestSavedText()));
})();