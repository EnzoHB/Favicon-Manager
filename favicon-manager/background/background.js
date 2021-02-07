import('/modules/set-extension-info.js').then(({setExtensionInfo}) => {
import('/modules/check-in-memory.js').then(({checkInMemory}) => {
import('/modules/change-favicon.js').then(({changeFavIcon}) => {
import('/modules/backup-favicon.js').then(({backupFavIcon}) => {
import('/modules/find-favicon.js').then(({findFavIcon}) => {
import('/modules/clean-tab.js').then(({cleanTab}) => {
import('/modules/unpack.js').then(({unpack}) => {
import('/modules/pack.js').then(({pack}) => {

setExtensionInfo({});

chrome.tabs.onCreated.addListener(_ => {
    chrome.tabs.onUpdated.addListener((_, changeInfo, dirtyTab) => { // Youtube
        if (changeInfo.status === 'complete') {

            const id = dirtyTab.id; // Id
            const extensionInfo = setExtensionInfo({}); // info
            const cleanedTab = cleanTab(dirtyTab); // mainURL, shortedURL e FavIcon diferente;
            const found = checkInMemory(cleanedTab.mainURL); // true

                const URLObject = found? 
                 unpack(cleanedTab.mainURL) :
                 cleanedTab;

                /*
                mainURL - 
                shortedURL
                favIcon - antigo
                state - 0
                default - Antigo
                modified - PNG
                */
            findFavIcon(id).then(fallback => { // Diferente;

                // O Default é o ícone que está lá e assume o papel de original, mdoified assue o papel de empty;
                const returnedIcon = cleanedTab.favIcon // Diferente
                const defaultImage = URLObject.default; // Antigo
                const modifiedImage = URLObject.modified; // PNG

                const validate = (icon) => 
                    icon != undefined &&
                    icon != defaultImage &&
                    icon != modifiedImage? icon : false;

                    const favIcon = validate(returnedIcon) || validate(fallback) || undefined;

                        const update = () => { URLObject.default = favIcon; change(); };
                        const set = () => { setURLObject(cleanedTab, favIcon); change(); };

                        favIcon? 
                         found? update() : set() :
                         found? change() : error();

                        function change() {
                            pack(URLObject);

                            URLObject.state == 1? 
                                 changeFavIcon(id, URLObject) : 
                                 backupFavIcon(id, URLObject) ;
                        };

                        function error() {
                            console.log(`Something went wrong at ${URLObject.mainURL}`);
                             chrome.tabs.remove(id);
                                return;

                        // O que aconteceria nos 4 cenários, segunda e primeria interação mudada. Fazer isso amanhã.
                        };
            });

            function setURLObject(objetc, favIcon) { 

                    object.state = extensionInfo.defaultState; 
                    object.default = extensionInfo.default || favIcon; 
                    object.modified = extensionInfo.modified; 

                            return object;
            };
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