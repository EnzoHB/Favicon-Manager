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

                const isValidF = (icon) => icon != undefined && icon != empty && icon != original;

                    const returned = isValidF(tab.favIconUrl);
                    const finded = isValidF(icon);
                    const favIcon = returned || finded || undefined;

                        if (favIcon) response.found? update() : set();
                        else response.found? run() : error();

                function update() {
            
                    URLObject.original = favIcon;
                     run();
                };

                function set() {
    
                    extensionInfo.webTracking == 'on'? 
                     pack(createURLObject(favIcon)) : false;
                };

                function run() {

                    URLObject.state == 1?
                     changeFavIcon(tab, URLObject) :
                     backupFavIcon(tab, URLObject) ;
                    
                    pack(URLObject);
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

// Adicionado Através do GitPod. Vendo se funciona. 
// Interessante

});
});
});
});
});
});
});
});