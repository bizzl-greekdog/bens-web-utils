ko.extenders.sorted = function(source, options) {
    if (typeof options != 'object')
        options = {sortFunction: options, reverse: false};
    var sfn = ko.observable(options.sortFunction);
    var reverse = ko.observable(options.reverse);
    var self = ko.computed(function() {
        if (!sfn)
            return source();
        var result = source().slice(0);
        if (sfn instanceof Function) {
            result.sort(sfn);
        } else if (ko.extenders.sorted.functions[sfn] instanceof Function) {
            result.sort(ko.extenders.sorted.functions[sfn]);
        } else
            result.sort();
        if (reverse)
            result.reverse();
        return result;
    });
    self.sortFunction = sfn;
    self.reverse = reverse;
    self.source = source.source ? source.source : source;
    self.parentObservable = source;
    return self;
};

ko.extenders.sorted.functions = {};
ko.extenders.sorted.functions.value = function(a, b) {
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
};
ko.extenders.sorted.functions.length = function(a, b) {
    if (a.length !== undefined && b.length !== undefined)
        return ko.extenders.sorted.functions.value(a.length, b.length);
    return 0;
};
