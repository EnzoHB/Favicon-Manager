function findFavIcon(tab) {
    return new Promise (resolve => {
        const code = `
            function search() {
                for (const link of document.getElementsByTagName('link')) {
                    const icon = /^shortcut icon|^icon/gi
                        if (icon.test(link.rel)) {
                            return link.href;
                        };
                    };
            };
        
        search()`;

        chrome.tabs.executeScript(tab.id, {code: code}, (iconLink) => {
            try {
                resolve(iconLink[0]);
            } catch {
                console.log('Icon não conseguiu ser lido');
            }
        })
    });
};

export { findFavIcon };