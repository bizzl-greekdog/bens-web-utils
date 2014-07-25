/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

Array.extend({
	/**
	 * Determine the index at which the value should be inserted into the list in order to maintain the sorted order.
	 * @likeIn underscorejs
	 * @param n The value for which to find an index.
	 * @return The index under which the value could be inserted to keep the list sorted.
	 */
	sortedIndex: function(n) {
		var r = -1;
		this.each(function(e, i) { // TODO Remove dependency?
			if (e > n) {
				r = i;
				return false;
			}
		});
		if (r < 0)
			r = this.length;
		return r;
	},
	
	/**
	 * Inserts a value into the array while maintaining a sorted order.
	 * @param n The value to be inserted.
	 */
	sortedInsert: function(n) {
		this.insert(n, this.sortedIndex(n));
	},
	
	/**
	 * Removes all elements from the array.
	 * @likeIn prototypejs
	 */
	clear: function() {
		this.length = 0;
	},
	
	/**
	 * Returns the composition of a list of functions.
	 * @likeIn underscorejs
	 * @return The composite function.
	 */
	compose: function() {
		var array = this;
		return function() {
			var args = Array.create(arguments);
			array.each(function(e, i, a) { // TODO Remove dependency?
				if (e.apply)
					args = e.apply(a, args);
				if (!Object.isArray(args)) // TODO Remove dependency?
					args = [args];
			});
			return args;
		};
	}
});