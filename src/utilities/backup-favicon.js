function backupFavIcon(tab, URLObject) {

    const source = URLObject.original;

        chrome.tabs.executeScript(tab.id, {code: removeLink()});
        chrome.tabs.executeScript(tab.id, {code: updateExisting(source)});

    function updateExisting(source) {
        return `
            for (const link of document.getElementsByTagName('link')) {
                const icon = /icon/gi
                    if (icon.test(link.rel)) {
                        link.href = '${source}';
                    };
            };`
    };

    function removeLink() {
        return `
            for (const link of document.getElementsByClassName('added-by-nc-favicon-manager')) {
                link.remove();
            };`
    };
};

export { backupFavIcon };