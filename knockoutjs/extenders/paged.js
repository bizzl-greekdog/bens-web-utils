ko.extenders.paged = function(source, options) {
    if (typeof options != 'object')
        options = {pageSize: options, format: false};
    if (options.format instanceof Array)
        options.format = ko.extenders.paged.format.apply(undefined, options.format);
    if (!ko.isObservable(source))
        source = ko.observableArray(source);
    var page = ko.observable(0);
    var pageSize = ko.observable(options.pageSize);
    var pageCount = ko.computed(function() {
        return Math.ceil(source().length / pageSize());
    });
    var self = ko.computed(function() {
        if (page() >= pageCount())
            page(pageCount()-1);
        return source().slice(page() * pageSize(), (page() + 1) * pageSize());
    });
    
    self.page = page;
    self.pageSize = pageSize;
    self.pageCount = pageCount;
    self.format = ko.observable(options.format);
    self.source = source.source ? source.source : source;
    self.parentObservable = source;
    
    self.nextPage = function() {
        if (self.hasNextPage())
        self.page(self.page() + 1);
    };
    self.previousPage = function() {
        if (self.hasPreviousPage())
            self.page(self.page() - 1);
    };
    
    self.hasNextPage = ko.computed(function() {
        return self.page() < self.pageCount()-1;
    });
    self.hasPreviousPage = ko.computed(function() {
        return self.page() > 0;
    });
    
    self.pages = ko.computed(function() {
        var result = [];
        for (var i = 0; i < self.pageCount(); i++)
            result.push({
                pageNr: i,
                humanreadable: i+1,
                isCurrent: i == self.page(),
                canGoto: true,
                goto: function() { self.page(this.pageNr); }
            });
        if (self.format()) {
            result = ko.extenders.paged.format.doFormat(result, self.format(), self.page());
        }
        return result;
    });
    
    return self;
};

ko.extenders.paged.format = function(start, beforeWindowEllipsis, windowSize, afterWindowEllipsis, end) {
    return {
        start: start,
        beforeWindowEllipsis: beforeWindowEllipsis,
        windowSize: windowSize,
        afterWindowEllipsis: afterWindowEllipsis,
        end: end
    };
};

ko.extenders.paged.format.nonPage = function(text) {
    return {
        canGoto: false,
        isCurrent: false,
        humanreadable: text
    };
};

ko.extenders.paged.format.rangeOverlap = function(l1, u1, l2, u2, bool) {
    if (u1 >= l2)
        return bool ? true : {l: Math.min(l1, l2), u: Math.max(u1, u2)};
    else
        return false;
}

ko.extenders.paged.format.doFormat = function(array, format, current) {
    var winPre = 0;
    var winAft = 0;
    var ro = ko.extenders.paged.format.rangeOverlap;
    if (format.windowSize % 2) {
        winPre = winAft = (format.windowSize-1)/2;
    } else {
        winAft = format.windowSize / 2;
        winPre = winAft-1;
    }
    var start = format.start;
    var end = array.length - format.end;
    winPre = Math.max(0, current-winPre);
    winAft = Math.min(array.length-1, current+winAft+1);
    if ((ro(0, start, winPre, winAft, true) && ro(winPre, winAft, end, array.length, true)) || ro(0, start, end, array.length, true))
        return array;
    
    var p = false;
    var result = [];
    if (p = ro(0, start, winPre, winAft)) {
        result.push.apply(result, array.slice(0, p.u));
        result.push(ko.extenders.paged.format.nonPage(format.afterWindowEllipsis));
        result.push.apply(result, array.slice(end));
    } else if (p = ro(winPre, winAft, end, array.length)) {
        result.push.apply(result, array.slice(0, start));
        result.push(ko.extenders.paged.format.nonPage(format.beforeWindowEllipsis));
        result.push.apply(result, array.slice(p.l));
    } else {
        result.push.apply(result, array.slice(0, start));
        result.push(ko.extenders.paged.format.nonPage(format.beforeWindowEllipsis));
        result.push.apply(result, array.slice(winPre, winAft));
        result.push(ko.extenders.paged.format.nonPage(format.afterWindowEllipsis));
        result.push.apply(result, array.slice(end));
    }
    return result;
};
