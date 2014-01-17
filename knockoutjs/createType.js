/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * Creates an observable type from a base type and some extensions. Use this if you have
 * to reuse some extensions over and over again.
 * @demo
 * @param base A base type. Must be an observable type.
 * @param extensions Either an hash as used by `extend`, or a function returning such a hash.
 * @param name An optional name under which the type should be attached to `ko`. Only works if there is nothing already attached to this name. The new type will still be returned.
 */
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

/**
 * Internal. Used to reduce the amount of logic in `ko.createType`
 */
ko.createType.wrapValue = function(v) {
    return function() { return v; }
};
