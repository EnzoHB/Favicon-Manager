function pack(object) {
    const URLObject = object;
    const requiredURL = URLObject.url;
    const local = localStorage;

        local.setItem(requiredURL, JSON.stringify(URLObject))
};

export { pack };