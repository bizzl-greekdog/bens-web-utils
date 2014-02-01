/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @name jquery.logging
 * @author Benjamin Kleiner
 * @copyright 2010
 * Adds some interceptable logging functions. All four methods will throw a event
 * named like the method onto document, except for $.fail, which will throw an
 * error event instead of a fail event ($.error was already taken, sorry).
 * Every method takes a variable number of parameters, of which each will be
 * logged as a separate message.
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
			var msg = data[i];
			__console__[type](msg);
			$(document).trigger(type, [msg]);
		}
	}

	/**
	 * For regular logging.
	 */
	$.log = function() { __log__('log', arguments); };

	/**
	 * For warnings.
	 */
	$.warn = function() { __log__('warn', arguments); };

	/**
	 * For critical errors.
	 */
	$.fail = function() { __log__('error', arguments); };

	/**
	 * For informations.
	 */
	$.info = function() { __log__('info', arguments); };
})(jQuery);