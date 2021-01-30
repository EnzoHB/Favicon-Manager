function unpack(url) {
    const mainURL = url;
    const local = localStorage;
        return JSON.parse(local.getItem(mainURL));
};

export { unpack };

// Recebe uma main URL. Geralmente, trabalha em conjunto com checkInMemory;

// Retorna a string que estava na memória convertida para o formato de objeto
// através de JSON.parse;