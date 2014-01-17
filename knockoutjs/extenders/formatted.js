/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * formatted - Formats an observables data.
 * @demo http://jsfiddle.net/bizzl/qxK83/
 * @param options Either a formatting function, or an options hash.
 * @param options.formatFunction A formatting function.
 * @field formatFunction An observable containing the formatting function for later changes.
 * @field source The original observable containing the raw data.
 * @field parentObservable If used with other extenders, this points to the previously declared extension.
 */
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
