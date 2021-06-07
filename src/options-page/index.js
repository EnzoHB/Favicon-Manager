// ---------------------- Modules ---------------------------- //

import { iterateThroughLS } from '/modules/iterate-through-ls.js';
import { checkInMemory } from '/modules/check-in-memory.js';
import { pack } from '/modules/pack.js';
import { unpack } from '/modules/unpack.js';
import { setExtensionInfo } from '/modules/set-extension-info.js';
import { backupFavIcon } from '/modules/backup-favicon.js';
import { changeFavIcon } from '/modules/change-favicon.js';

// -------------------- HTML DOM Elements ---------------------//

const local = localStorage;
const allFavBtn = document.getElementsByClassName('change')[0];
const clearCache = document.getElementsByClassName('clear')[0];
const webTrackingBtn = document.getElementsByClassName('pause')[0];

// -------------- Pre Loading Functions ---------------------- //

const changeState = setState()
const updateWebTracking = setWebTracking();

// ---------------- Event Listeners --------------------------//

allFavBtn.addEventListener('click', () => changeState())
clearCache.addEventListener('click', () => clearAllCache());
webTrackingBtn.addEventListener('click', () => updateWebTracking());

// ----------------- Loading Functions --------------------------- // 

updateTable();
setEventListeners();

// ------------------------ Functions ----------------------------//

function updateTable() {

    const table = document.getElementsByClassName('URLObjects')[0];
    
    table.innerHTML = '';
    table.innerHTML = `
        <tr>
            <th style='width: 147px;'>Domain</th>
            <th style='width: 37px;'>State</th>
            <th style='width: 56px;'>Original</th>
            <th style='width: 64px;'>Standard</th>
            <th style='width: 73px;'>Delete</th>
        </tr>
    `

    for (const URLObject of iterateThroughLS()) {

        const mainURL = URLObject.mainURL;
        const url = URLObject.url;
        const state = URLObject.state;
        const original = URLObject.original;
        const empty  = URLObject.empty;

        const error = 'https://i.ibb.co/FYrTFmQ/error.png'

            const tr = `
            <tr id='${url}'>
                <td>${mainURL}</td>
                <td>${state}</td>
                <td><img src='${original != null? original : error}' class='favIcon'></td>
                <td><img src='${empty}' class='favIcon'></td>
                <td><button class='${url} remove'>Remove</button></td>
            </tr>`;

            table.innerHTML += tr;
    };
};

function setEventListeners() {

    for (const URLObject of iterateThroughLS()) {

        const state = URLObject.state;
        const url = URLObject.url;

        const button = document.getElementsByClassName(url)[0];
        const targetTr = document.getElementById(url)

        button.addEventListener('click', () => {
            if (state == 0) { local.removeItem(url); targetTr.remove() };
        });
    };
};

function setState() {

    const allFavBtn = document.getElementsByClassName('change')[0];
    const extensionInfo = setExtensionInfo({});

    let state = extensionInfo.defaultState

    const updateButton = () => {
        state == 0?
         allFavBtn.innerText = 'Change all Favicons: OFF': 
         allFavBtn.innerText = 'Change all Favicons: ON' ;
    };

    return function() {

        state == 0?
         state++ :
         state-- ;

        updateButton();
            setExtensionInfo({defaultState: state});

            for (const URLObject of iterateThroughLS()) {

                const targetTr = document.getElementById(URLObject.url);
                URLObject.state = state;

                pack(URLObject);
                    targetTr.remove();
            };

            updateTable();
            setEventListeners();

        chrome.tabs.query({}, openedTabs => {
            for (const tab of openedTabs) {
                const response = checkInMemory(tab)

                if (response.found) {
                    const URLObject = unpack(response.requiredURL);

                    state == 1?
                     changeFavIcon(tab, URLObject) :
                     backupFavIcon(tab, URLObject) ;
                };
            };
        });
    };
};

function clearAllCache() {
    const pendingURLs = new Array;

    for (const URLObject of iterateThroughLS()) {
        if (URLObject.state == 0) {
            const url = URLObject.url

                pendingURLs.push(url)
                const targetTr = document.getElementById(url);
                    targetTr.remove();
        };
    };

    pendingURLs.forEach(url => local.removeItem(url));
};

function setWebTracking() {
    const extensionInfo = setExtensionInfo({});
    let state = extensionInfo.webTracking == 'on'? 0 : 1;

    const updateButton = () => {
        state == 0?
         webTrackingBtn.innerText = 'Pause Web Tracking: OFF' :
         webTrackingBtn.innerText = 'Pause Web Tracking: ON'  ;
    };

    updateButton();

    return function() {
        state == 0?
         state++ :
         state-- ;

        updateButton();

        state == 0?
         setExtensionInfo({webTracking: 'on'}) :
         setExtensionInfo({webTracking: 'off'})  ;
    }; 
};

// Código Refatoradíssimo!!! Muito sensacional; 