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
 * @name TagWidget
 * @author Benjamin Kleiner
 * @version 0.90.0
 * Realizes an easy to use tag widget using an existing select box as backend, so
 * the server side doesn't has to care wether javascript is on or off in the client.
 * Note:
 * When you externally change the selection inside the select box (e.g. via a script),
 * you'll have to fire the custom event tagwidget.update on the changed option elements,
 * e.g. like this: $(this).trigger("tagwidget.update");
 * Methods:
 * $(element).tagWidget(object options):		Creates a tag widget from a select box, using options
 * 							as map of options. Returns $(element).
 * $(element).tagWidget(string name):			Returns the value of the option identified by name,
 * 							provided that element got turned into a tag widget.
 * $(element).tagWidget(string name, variant value):	Sets the value of the option identified by name to value,
 * 							provided that element got turned into a tag widget.
 * 							Returns $(element).
 *
 * Available Options:
 * -
 */

(function($) {

	function createTagWidget(options) {
		options = $.extend({

		}, options);
		var div = $("<div/>")
			.addClass("tagwidget")
			.addClass("cloud");
		var toggleOption = function(event, nochange) {
			var opt = $(this).data("option");
			if (!nochange)
				opt.selected = ! opt.selected;
			$(this).toggleClass("unselected", !opt.selected).toggleClass("selected", opt.selected);
		};
		this.find("option").each(function() {
			var span = $("<span/>")
				.addClass($(this).attr("selected") ? "selected" : "unselected")
				.text($(this).text())
				.click(toggleOption)
				.dblclick(toggleOption)
				.data("option", this)
				.appendTo(div);
			$(this).data("tagwidget-span", span);
		});
		this
			.after(div)
			.css("display", "none")
			.data("tagwidget", div)
			.data("tagwidget.options", options)
			.bind("DOMNodeInserted", function(event) {
				var target = event.originalTarget ? event.originalTarget : event.target;
				var span = $("<span/>")
					.addClass($(target).attr("selected") ? "selected" : "unselected")
					.text($(target).text())
					.click(toggleOption)
					.dblclick(toggleOption)
					.data("option", target)
					.appendTo(div);
				$(target).data("tagwidget-span", span);
			})
			.bind("DOMNodeRemoved", function(event) {
				var target = event.originalTarget ? event.originalTarget : event.target;
				$(target).data("tagwidget-span").remove();
			})
			.bind("tagwidget.update", function (event) {
				var target = event.target ? $(event.target) : $(this).find("option");
				target.each(function() {
					var span = $(this).data("tagwidget-span");
					if (span && span.hasClass("selected") != this.selected)
						span.trigger("click", [true]);
				});
			});
		return this;
	}

	function modifyTagWidget(option, value) {
		var options = this.data("tagwidget.options");
		if (typeof value == "undefined")
			return options[option];
		options[option] = value;
		return this;
	}

	$.fn.tagWidget = function(options, value) {
		if (typeof options == "string")
			return modifyTagWidget.apply(this.eq(0), [options, value]);
		else
			return $(this).each(function() {
				createTagWidget.apply($(this), [options]);
			});
	};
})(jQuery);