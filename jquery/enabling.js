/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @name jquery.enabling
 * @author Benjamin Kleiner
 * @copyright 2010
 * Adds some convenience functions to easily en- or disable elements.
 */

(function($) {
	/**
	 * Will enable all elements.
	 * @return jQuery set.
	 */
	$.fn.enable = function() {
		this.each(function() { $(this).removeAttr('disabled'); });
		return this;
	};

	/**
	 * Will disable all elements.
	 * @return jQuery set.
	 */
	$.fn.disable = function() {
		this.each(function() { $(this).attr('disabled', 'disabled'); });
		return this;
	};

	/**
	 * Returns true if the element is enabled. Acts as setter when called with a parameter.
	 * @param v An optional boolean value to en- or disable all elements.
	 * @return Boolean for single element sets, Array of Boolean for multiple, jQuery set when parameter is given.
	 */
	$.fn.enabled = function() {
		if (arguments.length) {
			var v = arguments[0];
			this.each(function() {
				if (v)
					$(this).enable();
				else
					$(this).disable();
			});
			return this;
		} else {
			var r = [];
			this.each(function() {
				r.push(!$(this).attr('disabled'));
			});
			return r.length > 1 ? r : r[0];
		}
	};
})(jQuery);
