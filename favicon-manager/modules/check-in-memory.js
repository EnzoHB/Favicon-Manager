function checkInMemory(tab) {
    const fullURL = tab.url;
    const local = localStorage;

    const matchWebSite = /.+?:\/\/.+?(\..+?)?(\..+?)?(\..+?)?\//;
    const requiredURL = matchWebSite.exec(fullURL)[0];

    const matchMain = /.+?:\/\/(.+?)\//;
    const mainURL = matchMain.exec(requiredURL)[1];

    for (let i = 0; i < local.length; i++) {
        if (local.key(i) == requiredURL) return {
            found: true,
            requiredURL: requiredURL,
            main: mainURL
        }
    };

    return {
        found: false,
        mainURL: null,
        requiredURL: null
    }
};

export { checkInMemory }

// Recebe uma Tab;
// Define um shortcut para localStorage;

// Utiliza a Regexp para dar match na URL principal: protocol://subdomain?.domain.gtld?.tld?/
// Itera pela memória comparando a URL principal com as keys em LocalStorage;

// Se já existir uma key, ele retorna um objeto com as propriedades found (true) e mainURL (mainURL);
// Se não, retorna um objeto com as propriedades found (false) e mainURL (null). 
// O Retorno de null é importante para o Error Handling;