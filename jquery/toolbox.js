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
 * @name Toolbox
 * @author Benjamin Kleiner
 * @version 1.0.0
 * Realizes a toolbox with cashew, similar to the one in plasma-desktop used by KDE 4.x.
 * Methods:
 * $(element).toolbox(object options):			Creates a toolbox from element, using options
 * 							as map of options. Returns $(element).
 * $(element).toolbox(string name):			Returns the value of the option identified by name,
 * 							provided that element got turned into a toolbox.
 * $(element).toolbox(string name, variant value):	Sets the value of the option identified by name to value,
 * 							provided that element got turned into a toolbox.
 * 							Returns $(element).
 *
 * Available Options:
 * icon:		src url for the icon. Default is "toolbox.png".
 * iconAlt:		Alternative text for the icon. Default is " ".
 * inactiveOpacity:	Opacity of the inactive cashew. Default is 0.4.
 * activeOpacity:	Opacity of the active cashew (and toolbox). Default is 0.8.
 */

(function ($) {

	var standardOptions = {
		icon: "toolbox.png",
		iconAlt: " ",
		inactiveOpacity: 0.4,
		activeOpacity: 0.8
	};

	var paddingPlus = 10;
	var paddingExtend = 5;

	function cssCashewBorder(dir) {
		dir = dir.toLowerCase();
		if (dir == "n")
			return "000% 000% 100% 100%";
		if (dir == "ne")
			return "000% 000% 000% 100%";
		if (dir == "e")
			return "100% 000% 000% 100%";
		if (dir == "se")
			return "100% 000% 000% 000%";
		if (dir == "s")
			return "100% 100% 000% 000%";
		if (dir == "sw")
			return "000% 100% 000% 000%";
		if (dir == "w")
			return "000% 100% 100% 000%";
		if (dir == "nw")
			return "000% 000% 100% 000%";
	}

	function cssCashewPadding(dir, extended) {
		dir = dir.toLowerCase();
		var result = {
			paddingTop: 5,
			paddingRight: 5,
			paddingBottom: 5,
			paddingLeft: 5
		};
		if (dir == "ne") {
			result.paddingLeft += paddingPlus;
			result.paddingBottom += paddingPlus;
		}
		if (dir == "se") {
			result.paddingLeft += paddingPlus;
			result.paddingTop += paddingPlus;
		}
		if (dir == "sw") {
			result.paddingRight += paddingPlus;
			result.paddingTop += paddingPlus;
		}
		if (dir == "nw") {
			result.paddingRight += paddingPlus;
			result.paddingBottom += paddingPlus;
		}
		if (extended)
			for (var a in result)
				result[a] += paddingExtend;
		return result;
	}

	function cssCashewPosition(dir) {
		dir = dir.toLowerCase();
		if (dir == "n")
			return {top: 0, left: "50%"};
		if (dir == "ne")
			return {top: 0, right:	0};
		if (dir == "e")
			return {top: "50%", right: 0};
		if (dir == "se")
			return {bottom: 0, right: 0};
		if (dir == "s")
			return {bottom: 0, left: "50%"};
		if (dir == "sw")
			return {bottom: 0, left: 0};
		if (dir == "w")
			return {top: "50%", left: 0};
		if (dir == "nw")
			return {top: 0, left: 0};
	}

	function createToolbox(options) {
		var block = this;

		var internalOptions = {
			width: block.width(),
			height: block.height(),
			visible: false,
			options: $.extend({}, standardOptions, options)
		};

		var cssBlock = $.extend(cssCashewPosition(internalOptions.options.direction), {
			position: "absolute",
			overflow: "hidden",
			height: 0,
			width: 0
		});

		var cssCashew = $.extend(
			cssCashewPosition(internalOptions.options.direction),
			cssCashewPadding(internalOptions.options.direction, false),
			{
				MozBorderRadius:	cssCashewBorder(internalOptions.options.direction),
				borderRadius:		cssCashewBorder(internalOptions.options.direction),
				backgroundColor:	"black",
				position:		"absolute",
				display:		"block",
				zIndex:			0,
				opacity:		internalOptions.options.inactiveOpacity
			}
		);

		block
			.css(cssBlock)
			.click(function (evt) { evt.stopPropagation(); });

		internalOptions.cashew = $("<div/>")
			.css(cssCashew)
			.append(block)
			.append($("<img/>").attr({
				alt: internalOptions.options.iconAlt,
				src: internalOptions.options.icon

			}))
// 			.attr("tabindex", -1)
			.bind("click", function() {
				var cssBlock = {}, cssCashew = {};
				var dir = internalOptions.options.direction.toLowerCase();
				if (internalOptions.visible) {
					cssCashew = $.extend({
							padding: 5,
							opacity: internalOptions.options.inactiveOpacity
						}, cssCashewPadding(dir, false));
					cssBlock = $.extend(cssCashewPosition(dir), {width: 0, height: 0});
				} else {
					cssCashew = $.extend({
							padding: 5,
							opacity: internalOptions.options.activeOpacity
						}, cssCashewPadding(dir, true));
					cssBlock = {width: internalOptions.width, height: internalOptions.height};
					if (dir == "n")
						$.extend(cssBlock, {
							top: internalOptions.cashew.outerHeight(),
							left: -cssBlock.width / 2
						});
					else if (dir == "ne")
						$.extend(cssBlock, {
							top: internalOptions.cashew.outerHeight(),
							right: internalOptions.cashew.outerWidth()
						});
					else if (dir == "e")
						$.extend(cssBlock, {
							top: -cssBlock.height / 2,
							right: internalOptions.cashew.outerWidth()
						});
					else if (dir == "se")
						$.extend(cssBlock, {
							bottom: internalOptions.cashew.outerHeight(),
							right: internalOptions.cashew.outerWidth()
						});
					else if (dir == "s")
						$.extend(cssBlock, {
							bottom: internalOptions.cashew.outerHeight(),
							left: -cssBlock.width / 2
						});
					else if (dir == "sw")
						$.extend(cssBlock, {
							bottom: internalOptions.cashew.outerHeight(),
							left: internalOptions.cashew.outerWidth()
						});
					else if (dir == "w")
						$.extend(cssBlock, {
							top: -cssBlock.height / 2,
							left: internalOptions.cashew.outerWidth()
						});
					else if (dir == "nw")
						$.extend(cssBlock, {
							top: internalOptions.cashew.outerHeight(),
							left: internalOptions.cashew.outerWidth()
						});
				}
				block.animate(cssBlock, 500);
				$(this).animate(cssCashew, 250);
				internalOptions.visible = !internalOptions.visible;
			})
			.appendTo($("body"));
		this.data("toolbox.options", internalOptions);
		return this;
	}

	function modifyToolbox(option, value) {
		var internalOptions = this.data("toolbox.options");
		if (typeof value == "undefined")
			return internalOptions.options[option];

		internalOptions.options[option] = value;

		if (option == "icon")
			internalOptions.cashew.children("img").attr("src", value);
		if (option == "iconAlt")
			internalOptions.cashew.children("img").attr("alt", value);

		var cssBlock = $.extend(cssCashewPosition(internalOptions.options.direction), {
			position: "absolute",
			overflow: "hidden",
			height: 0,
			width: 0
		});

		var cssCashew = $.extend(
			cssCashewPosition(internalOptions.options.direction),
			cssCashewPadding(internalOptions.options.direction, false),
			{
				MozBorderRadius:	cssCashewBorder(internalOptions.options.direction),
				borderRadius:		cssCashewBorder(internalOptions.options.direction),
				backgroundColor:	"black",
				position:		"absolute",
				display:		"block",
				zIndex:			0,
				opacity:		internalOptions.options.inactiveOpacity
			}
		);

		this.removeAttr("style");
		this.css(cssBlock);
		internalOptions.cashew.removeAttr("style");
		internalOptions.cashew.css(cssCashew);
		internalOptions.visible = false;

		return this;
	}

	$.fn.toolbox = function(options, value) {
		if (typeof options == "string")
			return modifyToolbox.apply(this, [options, value]);
		else
			return this.each(function() {
				createToolbox.apply($(this), [options]);
			});
	};

})(jQuery);