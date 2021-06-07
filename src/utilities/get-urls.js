function getURLs(tab) {
    const fullURL = tab.url

        const matchWebSite = /.+?:\/\/.+?(\..+?)?(\..+?)?(\..+?)?\//;
        const requiredURL = matchWebSite.exec(fullURL)[0];

        const matchMain = /.+?:\/\/(.+?)\//;
        const mainURL = matchMain.exec(requiredURL)[1];

        return {
            requiredURL,
            mainURL,
            fullURL,
        };
};

export { getURLs };