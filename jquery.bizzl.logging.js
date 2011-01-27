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
 * @name logging
 * @author Benjamin Kleiner
 * @version 1.0.0
 * Adds some interceptable logging functions. All four methods will throw a event
 * named like the method onto document, except for $.fail, which will throw an
 * error event instead of a fail event ($.error was already taken, sorry).
 * Every method takes a variable number of parameters, of which each will be
 * logged as a separate message.
 * Methods:
 * $.log(variant msg1, ...):	Normal logging.
 * $.warn(variant msg1, ...):	Log messages as warnings.
 * $.fail(variant msg1, ...):	Log messages as errors.
 * $.info(variant msg1, ...):	Log messages as information.
 */

(function($) {

	wc = window.console || {};

	var __console__ = {
		log:	wc.log		|| function(){},
		warn:	wc.warn		|| function(){},
		error:	wc.error	|| function(){},
		info:	wc.info		|| function(){}
	};

	function __log__(type, data) {
		for (var i = 0; i < data.length; i++) {
			var msg = /*data.callee.caller.name + ": " + */data[i];
			__console__[type](msg);
			$(document).trigger(type, [msg]);
		}
	}

	$.log = function() { __log__("log", arguments); };
	$.warn = function() { __log__("warn", arguments); };
	$.fail = function() { __log__("error", arguments); };
	$.info = function() { __log__("info", arguments); };

})(jQuery);