const storage = window.localStorage;

export default function(options) {
    options = options || {};

    var throwError = function(errorMsg) {
        throw new Error(errorMsg);
    };

    var getItem = function(key, successCallback) {
        if(successCallback){
            var item = storage.getItem(key)
            if(typeof successCallback === 'function') {
                return successCallback(item);
            }
        } else {
            storage.getItem(key);
        }
        
    };

    var getItems = function(keys, successCallback) {
        var items = [];
        for(var i = 0; i < keys.length; i++) {
            var item = storage.getItem(keys[i]);
            items.push(item);
        };
        return successCallback(items);
    };

    var setItem = function(key, value, successCallback) {
        storage.setItem(key, value);
        if(typeof successCallback === 'function') {
            return successCallback();
        }
    };

    var removeItem = function(key, successCallback) {
        storage.removeItem(key)
        if(typeof successCallback === 'function') {
            return successCallback();
        }
    };

    var init = function() {
        if(storage) {
            return true;
        } else {
            throwError("storage is not defined");
            return false;
        }
    };

    return {
        init: init,
        getItem: getItem,
        getItems: getItems,
        setItem: setItem,
        removeItem: removeItem
    };
}