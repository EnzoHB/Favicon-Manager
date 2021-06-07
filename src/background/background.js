import('/modules/set-extension-info.js').then(({setExtensionInfo}) => {
import('/modules/check-in-memory.js').then(({checkInMemory}) => {
import('/modules/change-favicon.js').then(({changeFavIcon}) => {
import('/modules/backup-favicon.js').then(({backupFavIcon}) => {
import('/modules/find-favicon.js').then(({findFavIcon}) => {
import('/modules/get-urls.js').then(({getURLs}) => {
import('/modules/unpack.js').then(({unpack}) => {
import('/modules/pack.js').then(({pack}) => {

setExtensionInfo({});

chrome.tabs.onCreated.addListener(tabCreated => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, newTab) => {
        if (changeInfo.status === 'complete') {

            const extensionInfo = setExtensionInfo({}); 
            const tab = newTab;

            const urls = getURLs(tab); 
            const response = checkInMemory(tab); 
            const URLObject = unpack(response.requiredURL); 

                const empty = response.found? URLObject.empty: undefined;
                const original = response.found? URLObject.original: undefined; 

            findFavIcon(tab).then(icon => { 

                const isValidF = (icon) => icon != undefined && icon != empty && icon != original? icon : false;

                    const returned = isValidF(tab.favIconUrl);
                    const finded = isValidF(icon);
                    const favIcon = returned || finded || undefined;

                    console.log(returned, finded, favIcon);

                        if (favIcon) response.found? update() : set();
                        else response.found? run() : error();

                function update() {
            
                    URLObject.original = favIcon;
                     run();
                };

                function set() {
                    const object = createURLObject(favIcon);
                    extensionInfo.webTracking == 'on'? 
                     run(object) : false;
                };

                function run(object = URLObject) {

                object.state == 1?
                     changeFavIcon(tab, object) :
                     backupFavIcon(tab, object) ;
                    
                    pack(object);
                };

                function error() {
                    console.log('Error - Resete a Página'); //  Temporário
                };

                function createURLObject(favIconUrl) {
                    return {
                        url: urls.requiredURL,
                        mainURL: urls.mainURL,
                        state: extensionInfo.defaultState,
                        original: favIconUrl,
                        empty: 'https://i.ibb.co/x276r26/empty-resized.png'
                    };
                };
            });
        };
    });
});

});
});
});
});
});
});
});
});