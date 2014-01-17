ko.createType = function(base, extensions, name) {
    if ((typeof extensions != 'function') && (typeof extensions != 'object'))
        throw '"{1}" is not a valid type of extensions. Excpected "function" or "object".'.assign(typeof extensions);
    
    if (typeof extensions === 'object')
        extensions = ko.createType.wrapValue(extensions);
    
    var result = function() {
        var args = Array.create(arguments);
        var value = args.shift();
        return base(value).extend(extensions.apply(this, args));
    }
    
    if (name && !ko[name])
        ko[name] = result;
    return result;
};

ko.createType.wrapValue = function(v) {
    return function() { return v; }
};
