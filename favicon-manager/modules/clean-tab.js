function cleanTab(dirtyTab) {
    const url = dirtyTab.url;
    const favIconUrl = dirtyTab.favIcon;

        const regX = /.+?:\/\/(.+?)\//;
        const needed = regX.exec(url);

            return {
                mainURL: needed[0],
                shortedURL: needed[1],
                favIcon: favIconUrl // Algumas vezes será undefined;
            };
};

export { cleanTab };