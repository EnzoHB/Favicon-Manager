function setExtensionInfo(object = { defaultState: 0, webTracking: 'on' }) {
    const pendingObject = object; // {}
    const defaultObject = { defaultState: 0, webTracking: 'on' };
        const local = localStorage;

    try {
        const verify = local.getItem('extension-info');
            if (verify == null) throw new Error();

            const extensionInfo = JSON.parse(verify);
            const updated = Object.assign(extensionInfo, pendingObject);

            local.setItem('extension-info', JSON.stringify(updated));
                return updated;

    } catch {
        local.setItem('extension-info', JSON.stringify(defaultObject));
            return defaultObject;
    }
};

export { setExtensionInfo }

// Se eu usar setExtensionInfo(), ele reseta e retorna;
// Se eu chamar setExtensionInfo({}) - Se o objeto existir, ele é updatado e retornado;
// Se ele não existir, ele é criado com {}

// Quando a função é chamada sem parâmetros :
//  Se já existir um extension-info na memória, ele deve resetá-lo ao estado padrão;
//  Ao fazer isso, retornar esse o objeto;

//  Caso não exista, ele cria um objeto padrão na memória e o retorna;

// Quando a função é chamada com parâmetros :
//  extension-info é atualizado com os parâmetros passados;

