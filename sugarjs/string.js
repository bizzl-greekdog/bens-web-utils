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
	 * Finds all occurences of a regular expression, and their index.
	 * It's based on some code I found via stack overflow. Or rather: it isn't.
	 * The code didn't work, and contained a couple of weird Javascript extensions
	 * which apparently weren't in webkit. This rewrite is simpler, and works in pretty
	 * much any browser.
	 * @see http://stackoverflow.com/questions/15934353/get-index-of-each-capture-in-a-javascript-regex
	 * @param re A regular expression.
	 * @return A list of objects, each having a `match` string and and `index` integer.
	 */
	matchIndex: function(re) {
		var res  = [];
		var subs = this.match(re);
		var n = 0;
		for (var i = 0; i < subs.length; i++) {
			var idx = this.indexOf(subs[i], n);
			n = idx + 1;
			res.push({match: subs[i], index: idx});
		}
		return res;
	},
	
	/**
	 * Removes delimiters. Specifically, it removes the first and last character
	 * of a string if they are
	 *  a. equal and
	 *  b. contained in the parameter string.
	 * @param delims A string of delimiters.
	 * @return The string with it's delimiters, if any, removed.
	 */
	removeDelimiters: function(delims) {
		var a = this.charAt(0);
		var e = this.charAt(this.length-1);
		if (delims.indexOf(a) == delims.indexOf(e) && delims.indexOf(a) > -1)
			return this.substr(1, this.length-2);
		return this;
	},

	/**
	 * Splits the string in a fashion similar to most command line shells.
	 * So it's kinda like Python's `shlex` library.
	 */
	shlex: function() {
		var e = this.trim();
		var tokens = e.matchIndex(/[ '"]/g);
		tokens.push({match: '', index: e.length});
		var i = 0;
		var p = 0;
		var parsed = [];
		while (i < tokens.length) {
			var n = tokens[i].index;
			if (tokens[i].match == '"' || tokens[i].match == "'") {
				var c = tokens[i++].match;
				while (i < tokens.length && tokens[i].match != c) i++;
				n = tokens[i].index;
			} else {
				var tmp = e.substring(p, n).removeDelimiters('"\'');
				parsed.push(tmp);
				p = n+1;
			}
			i++;
		}
		return parsed;
	}
});