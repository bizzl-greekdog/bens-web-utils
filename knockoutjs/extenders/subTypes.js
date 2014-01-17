/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * subTypes - Adds fields to an observable.
 * @demo 
 * @param options An hash containing new fields as keys.
 * @param options._wrapFunctions Wether functions should be wrapped as ko.computed. Default: false
 */
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
