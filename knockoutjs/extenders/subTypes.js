ko.extenders.subTypes = function(source, options) {
    var wrapFunctions = Object.has(options, '_wrapFunctions') ? options._wrapFunctions : false;
    Object.keys(options, function(k, v) {
        if (k.at(0) === '_')
            return;
        if (!ko.isObservable(v)) {
            if (typeof v === 'function')
                v = wrapFunctions ? ko.computed(v, source) : v;
            else if (Object.isArray(v))
                v = ko.observableArray(v);
            else if (Object.has(v, 'read') && Object.has(v, 'write') && (Object.keys(v).length == 2))
                v = ko.computed(v, source);
            else
                v = ko.observable(v);
        }
        source[k] = v;
    });
    return source;
};
