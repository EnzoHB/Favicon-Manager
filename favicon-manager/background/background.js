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

                const favIcon = tab.favIconUrl || icon;
                const isValid = favIcon != undefined && favIcon != empty && favIcon != original;

                    if (isValid) response.found? update() : set();
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
                    console.log('Error - Resete a Página');
                };

               /* if (response.found) {
                    URLObject.state == 1?
                     changeFavIcon(tab, URLObject) :
                     backupFavIcon(tab, URLObject) ;

                } else {
                    findFavIcon(tab).then(icon => {
                        const favIcon = tab.favIconUrl || icon;
                            extensionInfo.webTracking == 'on'?
                             pack(createURLObject(favIcon)) : false;
                    })
                }; */

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

// o favIcon é diferente de todos esses? Sim, mas ele existe? Não; seta na mémoria
                // o favIcon é diferente de todos esses? Sim, mas ele existe? Sim; updata na memória
                // O FavIcon é diferente de todos esses? Não, mas ele existe? Não; Error;
                // O FavIcon é diferente de todos esses? Não, mas ele existe? Sim; Roda;

/*
Solução - a cada vez que for identificado que o URL do FavIcon é diferente do que está na meória,
diferente de empty e difernete de null ou undefined,
preciso pegar a quele favicon e atualizar na memória;
*/

/* Eu preciso que: 
    A Cada vez que alguém entrar em uma Tab, eu checar se o FavIcon
    é diferente de orginal, empty, undefined e null. Se sim, atualizá-lo; 
*/

});
});
});
});
});
});
});
});