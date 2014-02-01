/*
 * Copyright (c) 2010 Benjamin Kleiner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * In case of minification you are allowed to reduce this comment into this form:
 * // Copyright (c) <year> <copyright holders>
 * // Licensed under MIT License: http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @name enabling
 * @author Benjamin Kleiner
 * @version 1.0.0
 * Adds some convenience functions to easily en- or disable elements.
 * Methods:
 * $(element).enable():		Will enable the element. Returns $(element).
 * $(element).disable():	Will disable the element. Returns $(element).
 * $(element).enabled():	Returns true if the element is enabled.
 * $(element).enabled(bool v):	Will en- or disable element, depending on the
 * 				boolean interpretation of v. Returns $(element).
 */

(function($) {

	$.fn.enable = function() {
		this.each(function() { $(this).removeAttr("disabled"); });
		return this;
	};

	$.fn.disable = function() {
		this.each(function() { $(this).attr("disabled", "disabled"); });
		return this;
	};
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
				r.push(!$(this).attr("disabled"));
			});
			return r.length > 1 ? r : r[0];
		}
	};
})(jQuery);
