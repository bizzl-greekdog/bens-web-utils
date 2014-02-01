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
 * @name stupidStory
 * @author Benjamin Kleiner
 * @version 1.0.0
 * Implements a little story that let's the user input some variables. Based on
 * a script found at the now defunct roflweb.de, which used window.prompt and
 * document.write.
 * Methods:
 * $(element).stupidStory(string text, object variables):
 * 	Creates a story from text in element, using variables as map of variable
 * 	names and prompts, e.g. like this: {var1: "enter name", var2: "enter age"}.
 *
 * Available Options:
 *  -
 */

(function($) {

	var onKeyPress = function(event) {
		var currentVar = $(this).data("stupidStory.currentVar");
		var vars = $(this).data("stupidStory.vars");
		var prompts = $(this).data("stupidStory.prompts");
		var blocks = $(this).data("stupidStory.textBlocks");
		if (event.which == 13) {
			if ($(this).find(".prompt").length > 0)
				$(this).find(".prompt").remove();
			var text = $(this).html();
			if (currentVar) {
				text += vars[currentVar];
				currentVar = "";
			}
			while (blocks.length > 0) {
				var line = blocks.shift();
				if (line in prompts)
					if (line in vars)
						text += vars[line];
					else {
						currentVar = line;
						break;
					}
				else
					text += line;
			}
			$(this).html(text);
			if (!blocks.length && !currentVar) {
				$(this).stupidStory(false);
				return;
			}
			$(this).data("stupidStory.currentVar", currentVar);
		}

		if (currentVar) {
			if (!vars[currentVar])
				vars[currentVar] = "";
			if (event.which > 31)
				vars[currentVar] = vars[currentVar] + String.fromCharCode(event.which);
			else if (event.which == 8 && vars[currentVar] && vars[currentVar].length > 0)
				vars[currentVar] = vars[currentVar].substr(0, vars[currentVar].length - 1);
			var p = $(this).find(".prompt");
			p = p.length > 0 ? p : $("<span class=\"prompt\"></span>").appendTo(this);
			p.text(vars[currentVar] ? vars[currentVar] : prompts[currentVar]);
		}
	};

	var onClick = function(event) {
		if (typeof($(this).attr("tabindex")) == 'undefined')
			$(this).attr("tabindex", -1);
		this.focus();
	};

	$.fn.stupidStory = function(text, vars) {
		return this.each(function() {
			if (text == false) {
				return $(this)
					.removeData("stupidStory.currentVar")
					.removeData("stupidStory.textBlocks")
					.removeData("stupidStory.prompts")
					.removeData("stupidStory.vars")
					.unbind("keypress", onKeyPress)
					.unbind("click", onClick);
			}
	
			var rex = [];
			for (i in vars)
				rex.push(i);
			rex.sort(function(a, b) {
				return (a < b) ? 1 : -1;
			});
			var blocks = text.split(new RegExp("\\$(" + rex.join("|") + ")", "g"));
			return $(this)
				.data("stupidStory.currentVar", "")
				.data("stupidStory.textBlocks", blocks)
				.data("stupidStory.prompts", vars)
				.data("stupidStory.vars", {})
				.keypress(onKeyPress)
				.click(onClick)
				.trigger($.extend($.Event("keypress"), {which: 13}));
		});

	};
})(jQuery);