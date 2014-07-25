/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

Object.extend({
	/**
	 * Returns a sorted list of every method in the object.
	 * Lifted from the comparison.
	 * @likeIn underscorejs
	 * @param obj The object whoms method should be listed.
	 * @return The array of method names.
	 */
	functions: function(obj) {
		return Object.keys(obj).filter(function(key) {
			return Object.isFunction(obj[key]);
		}).sort();
	},

	/**
	 * Binds a number of methods on the object.
	 * @likeIn underscorejs
	 * @param obj The object whoms method should be bound.
	 * @param method_names* Names of the method to be bound. If non are given, all methods will be bound.
	 */
	bindAll: function(obj, method_names) {
		var args = Array.create(arguments);
		obj = args.shift();
		if (!args.length)
			args = Object.functions(obj);
		for (var i = 0; i < args.length; i++)
			obj[args[i]] = obj[args[i]].bind(obj);
	},

	/**
	 * Returns true if the object is a DOM element.
	 * Lifted from the comparison.
	 * @likeIn underscorejs
	 * @likeIn prototypejs
	 * @param obj The javascript object to be checked.
	 * @return Boolean.
	 */
	isElement: function(obj) {
		return !!(obj && obj.nodeType == 1);
	},

	/**
	 * Returns true if the object is null.
	 * Lifted from the comparison.
	 * @likeIn underscorejs
	 * @param obj The javascript object to be checked.
	 * @return Boolean.
	 */
	isNull: function(obj) {
		return obj === null;
	},

	/**
	 * Returns true if the object is undefined.
	 * Lifted from the comparison.
	 * @likeIn underscorejs
	 * @likeIn prototypejs
	 * @param obj The javascript object to be checked.
	 * @return Boolean.
	 */
	isUndefined: function(obj) {
		return obj === undefined;
	}
}, false, false);