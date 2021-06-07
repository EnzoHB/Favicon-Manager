function changeFavIcon(tab, URLObject) {

const source = URLObject.empty;

    chrome.tabs.executeScript(tab.id, {code: updateExisting(source)});
    chrome.tabs.executeScript(tab.id, {code: createNewOne(source)});

    function updateExisting(source) {
        return `
            for (const link of document.getElementsByTagName('link')) {
                const icon = /icon/gi
                    if (icon.test(link.rel)) {
                        link.href = '${source}';
                    };
            };`
    };

    function createNewOne(source) {
        return `
            for (let i = 0; i < 1; i++ ) {
                const link = document.createElement('link');
                    link.rel = 'icon';
                    link.href= '${source}';
                    link.class = 'added-by-nc-favicon-manager'
                        document.head.appendChild(link);
            };`
    };
};

export { changeFavIcon };