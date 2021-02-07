import { pack } from '/modules/pack.js';
import { unpack } from '/modules/unpack.js';
import { cleanTab } from '/modules/clean-tab.js';
import { backupFavIcon } from '/modules/backup-favicon.js';
import { changeFavIcon } from '/modules/change-favicon.js';

const radios = document.getElementsByClassName('inputRadio');

    chrome.tabs.query({active: true, currentWindow: true}, dirtyTab => {
        const cleanedTab = cleanTab(dirtyTab);
        const URLObject = unpack(cleanedTab.mainURL);
        const state = URLObject.state;

        state == 0?
         radios[1].setAttribute('checked', '') :
         radios[0].setAttribute('checked', '') ;

        radios[1].addEventListener('click', () => update(0));
        radios[0].addEventListener('click', () => update(1));

        function update(id) {
            const pseudoState = id;
            URLObject.state = pseudoState;

            pseudoState == 0?
             backupFavIcon(tab, URLObject) :
             changeFavIcon(tab, URLObject) ;

            pack(URLObject);
        };
    });