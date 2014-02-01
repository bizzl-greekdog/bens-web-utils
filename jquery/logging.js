/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @name jquery.logging
 * @author Benjamin Kleiner
 * @copyright 2010, 2014
 * Adds some interceptable logging functions. All four methods will throw a event
 * named like the method onto document, except for $.fail, which will throw an
 * error event instead of a fail event ($.error was already taken, sorry).
 * Every method takes a variable number of parameters, which can be
 * fired as separate events if the logging mode is set to jQuery.logModes.single.
 * Calling `preventDefault` or having the handler return `false` will prevent
 * the messages from being posted to the browsers console.
 */

(function($) {
	wc = window.console || {};
	
	$.logModes = {
		single: 'single',
		multiple: 'multiple'
	};

	var __console__ = {
		log:	wc.log	|| $.noop,
		warn:	wc.warn	|| $.noop,
		error:	wc.error|| $.noop,
		info:	wc.info	|| $.noop,
		mode:	$.logModes.multiple
	};

	function __log__(type, data) {
		data = Array.prototype.slice.call(data, 0);
		var passthrough = true;
		if (__console__.mode === $.logModes.multiple) {
			var e = $.Event(type, {messages: data});
			$(document).trigger(e);
			passthrough = !e.isDefaultPrevented();
		} else {
			$.each(data, function() {
				var e = $.Event(type, {messages: [this]});
				$(document).trigger(e);
				passthrough = passthrough && !e.isDefaultPrevented();
			});
		}
		if (passthrough)
			__console__[type].apply(window, data);
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
	
	/**
	 * Get and set logging mode. Avaiable are `single` (one event per logged value)
	 * and `multiple` (one event for all logged values).
	 * @param mode Optional. Used to set the logging mode.
	 * @return The current logging mode.
	 */
	$.logMode = function(mode) {
		if (mode !== undefined && Object.keys($.logModes).indexOf(mode) > -1)
			__console__.mode = mode;
		return __console__.mode;
	};
})(jQuery);