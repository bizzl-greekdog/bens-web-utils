/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

Function.extend({
	/**
	 * Returns a function wrapped around the original function.
	 * Lifted from the comparison.
	 * @likeIn underscorejs
	 * @likeIn prototypejs
	 * @param fn The wrapper function.
	 * @return The bound wrapper function.
	 */
	wrap: function(fn) {
		return fn.bind(null, this);
	},

	/**
	 * Returns an array of the argument names as stated in the function definition.
	 * @likeIn prototypejs
	 * @return The array of argument names.
	 */
	argumentNames: function() {
		var r = String(this)
			.match(/function *[^(]*\(([^)]*)\)/)[1]
			.split(/ *, */);
		this.argumentNames = function() { return r; };
		return r;
	},
	
	/**
	 * Wraps the function inside another function that pushes the object it is called on as the first argument.
	 * Lifted from the comparison.
	 * @likeIn prototypejs
	 * @return A wrapper function.
	 */
	methodize: function() {
		var self = this;
		return function() {
			return self.apply(null, [this].concat(Array.create(arguments))); // TODO Remove dependency?
		}
	}
});