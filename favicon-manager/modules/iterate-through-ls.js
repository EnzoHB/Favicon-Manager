function* iterateThroughLS() {
    const local = localStorage;

        for (let i = 0; i < local.length; i++) {
            const url = local.key(i);

            if (url == 'extension-info') continue;

                const URLObject = JSON.parse(local.getItem(url));
                    yield URLObject;
        };
        return;
};

export {iterateThroughLS};

// Quando a função for chamada, eu preciso que ela me retorne o elemento de index 0 dentro de localStorage;
// Esse retorno deve ser em forma de objeto e deve conter as seguintes propriedades:
//  mainURL : local.key(i);
//  /* As Propriedades do objeto na memória */
//  state: 
//  original:
//  empty: 