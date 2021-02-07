function checkInMemory(mainURL) {

    for (let i = 0; i < localStorage.length; i++) {
        if (local.key(i) === mainURL) return true;
    };
    return false;
};

export { checkInMemory }

// Recebe uma Tab;
// Define um shortcut para localStorage;

// Utiliza a Regexp para dar match na URL principal: protocol://subdomain?.domain.gtld?.tld?/
// Itera pela memória comparando a URL principal com as keys em LocalStorage;

// Se já existir uma key, ele retorna um objeto com as propriedades found (true) e mainURL (mainURL);
// Se não, retorna um objeto com as propriedades found (false) e mainURL (null). 
// O Retorno de null é importante para o Error Handling;