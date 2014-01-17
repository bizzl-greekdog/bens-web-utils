/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * sorted - Sorts an observable array.
 * @demo 
 * @param options A sorting function, the name of a predefined sorting function, or an options hash.
 * @param options.sortFunction A sorting function or the name of a predefined sorting function.
 * @param options.reverse Wether sorting should be in reverse order.
 * @field sortFunction An observable containing the sorting function for later changes.
 * @field reverse An observable containing the sorting direction for later changes.
 * @field source The original observable containing the raw data.
 * @field parentObservable If used with other extenders, this points to the previously declared extension.
 */
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

/**
 * A namespace for predefined sorting functions.
 * Yeah, it's more verbose than the common `fn`, but I like it more.
 * You don't need the full name most of the times, anyway.
 */
ko.extenders.sorted.functions = {};

/**
 * Sorts by value. Pretty much the default, just for nicer code, as
 * {sortFunction: false} is ugly.
 */
ko.extenders.sorted.functions.value = function(a, b) {
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
};

/**
 * Sorts by `length` field.
 */
ko.extenders.sorted.functions.length = function(a, b) {
    if (a.length !== undefined && b.length !== undefined)
        return ko.extenders.sorted.functions.value(a.length, b.length);
    return 0;
};
