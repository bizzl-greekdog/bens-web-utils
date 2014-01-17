ko.extenders.formatted = function(source, options) {
    if (typeof options != 'object')
        options = {formatFunction: options};
    
    var ffn = ko.observable(options.formatFunction);
    var self = ko.computed({
        read: function() {
            if (!options.formatFunction)
                return source();
            return ffn()(source());
        },
        write: function(v) {
            return source(v);
        }
    });
    
    self.formatFunction = ffn;
    self.source = source.source ? source.source : source;
    self.parentObservable = source;
    return self;
};
