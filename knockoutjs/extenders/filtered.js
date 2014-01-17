ko.extenders.filtered = function(source, filter) {
    if (!ko.isObservable(source))
        source = ko.observableArray(source);
    var filter = ko.observable(filter);
    var self = ko.computed(function() {
        return ko.utils.arrayFilter(source(), filter());
    });
    self.filter = filter;
    self.source = source.source ? source.source : source;
    self.parentObservable = source;
    return self;
};
