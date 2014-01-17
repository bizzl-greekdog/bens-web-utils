/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * parsed - Parses any input.
 * @demo http://jsfiddle.net/bizzl/qxK83/
 * @param options Either a parsing function, or an options hash.
 * @param options.parseFunction A parsing function.
 * @field parseFunction An observable containing the parsing function for later changes.
 * @field source The original observable containing the raw data.
 * @field parentObservable If used with other extenders, this points to the previously declared extension.
 */
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
