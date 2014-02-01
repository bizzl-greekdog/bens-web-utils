/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @name jquery.tagwidget
 * @author Benjamin Kleiner
 * @copyright 2010
 * Creates an easy to use tag widget using an existing select box as backend, so
 * the server side doesn't has to care wether javascript is on or off in the client.
 * Note:
 * When you externally change the selection inside the select box (e.g. via a script),
 * you'll have to fire the custom event `tagwidget.update` on the changed option elements,
 * e.g. like this:
 * ```javascript
 * $(this).trigger('tagwidget.update');
 * ```
 * 
 * It still works, but I won't maintain it anymore since it's easier to do this
 * with KnockoutJS or another MVVM framework.
 */

(function($) {
	function createTagWidget(options) {
		options = $.extend({}, options);
		var div = $('<div/>')
			.addClass('tagwidget')
			.addClass('cloud');
		var toggleOption = function(event, nochange) {
			var opt = $(this).data('option');
			if (!nochange)
				opt.selected = ! opt.selected;
			$(this).toggleClass('unselected', !opt.selected).toggleClass('selected', opt.selected);
		};
		this.find('option').each(function() {
			var span = $('<span/>')
				.addClass($(this).attr('selected') ? 'selected' : 'unselected')
				.text($(this).text())
				.click(toggleOption)
				.dblclick(toggleOption)
				.data('option', this)
				.appendTo(div);
			$(this).data('tagwidget-span', span);
		});
		this
			.after(div)
			.css('display', 'none')
			.data('tagwidget', div)
			.data('tagwidget.options', options)
			.bind('DOMNodeInserted', function(event) {
				var target = event.originalTarget ? event.originalTarget : event.target;
				var span = $('<span/>')
					.addClass($(target).attr('selected') ? 'selected' : 'unselected')
					.text($(target).text())
					.click(toggleOption)
					.dblclick(toggleOption)
					.data('option', target)
					.appendTo(div);
				$(target).data('tagwidget-span', span);
			})
			.bind('DOMNodeRemoved', function(event) {
				var target = event.originalTarget ? event.originalTarget : event.target;
				$(target).data('tagwidget-span').remove();
			})
			.bind('tagwidget.update', function (event) {
				var target = event.target ? $(event.target) : $(this).find('option');
				target.each(function() {
					var span = $(this).data('tagwidget-span');
					if (span && span.hasClass('selected') != this.selected)
						span.trigger('click', [true]);
				});
			});
		return this;
	}

	function modifyTagWidget(option, value) {
		var options = this.data('tagwidget.options');
		if (typeof value == 'undefined')
			return options[option];
		options[option] = value;
		return this;
	}

	/**
	 * Creates an easy to use tag widget using an existing select box as backend.
	 * @param options An optional hash with options for creation. None supported.
	 * @param name A string identifying an option tag. Returns the value of said option for the first element in the set.
	 * @param value An optional value. Used in conjunction with name. Will set the value of said option for the first element in the set.
	 * @return The whole set on creation, otherwise the first element (when setting an option) or anything else (when getting an option).
	 */
	$.fn.tagWidget = function(options, value) {
		if (typeof options == 'string')
			return modifyTagWidget.apply(this.eq(0), [options, value]);
		else
			return $(this).each(function() {
				createTagWidget.apply($(this), [options]);
			});
	};
})(jQuery);