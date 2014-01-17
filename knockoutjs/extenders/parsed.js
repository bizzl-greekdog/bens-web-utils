ko.extenders.parsed = function(source, options) {
    if (typeof options != 'object')
        options = {parseFunction: options};
    var pfn = ko.observable(options.parseFunction);
    var self = ko.computed({
        read: function() { return source(); },
        write: function(v) {
            return source(pfn()(v));
        }
    });
    self.parseFunction = pfn;
    self.source = source.source ? source.source : source;
    self.parentObservable = source;
    return self;
};
