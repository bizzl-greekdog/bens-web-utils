/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

String.extend({
	/**
	 * Checks if the string is empty.
	 * Lifted from the comparison.
	 * @likeIn prototypejs
	 */
	isEmpty: function() {
		return this === '';
	},

	/**
	 * Evaluates the string as JSON and returns the resulting object.
	 * Lifted from the comparison.
	 * @likeIn prototypejs
	 */
	evalJSON: function() {
		return JSON.parse(this);
	},

	/**
	 * Checks if the string is valid JSON.
	 * Kinda lifted from the comparison.
	 * @likeIn prototypejs
	 */
	isJSON: function() {
		var r = false;
		try { this.evalJSON(); r = true; }
		catch (e) {}
		return r;
	},

	/**
	 * Returns a string with the first occurrence of the regex pattern replaced.
	 * @likeIn prototypejs
	 * @param pattern The pattern to replace.
	 * @param substitute The substitute to replace the patterns with.
	 * @param count the number of occurences to replace.
	 */
	sub: function(pattern, substitute, count) {
		if (Object.isUndefined(count))
			return this.replace(pattern, substitute);
		return this.replace(pattern, function(match, index) {
			if (count === 0)
				return match;
			count--;
			if (Object.isFunction(substitute))
				return substitute.call(this, match, index);
			else
				return substitute;
		});
	},

	/**
	 * Splits the string in a fashion similar to most command line shells.
	 * So it's kinda like Python's `shlex` library.
	 */
	shlex: function() {
		var i = 0;
		var result = [];
		var current = '';
		var escaped = false;
		var opened = false;
		while (i < this.length) {
			if (escaped) {
				escaped = false;
				current += this[i];
			} else if (this[i] == '"' || this[i] == "'") {
				opened = !opened;
			} else if (this[i] == ' ') {
				if (opened) current += this[i];
				else if (current.length) {
					result.push(current);
					current = '';
				}
			} else {
				current += this[i];
			}
			i++;
			if (i == this.length)
				result.push(current);
		}
		return result;
	}
});