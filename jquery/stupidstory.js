/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @name jquery.stupidstory
 * @author Benjamin Kleiner
 * @copyright 2010
 * Implements a little story that let's the user input some variables. Based on
 * a script found at the now defunct roflweb.de, which used window.prompt and
 * document.write.
 * 
 * It still works, but I won't maintain it anymore since there is no use case for
 * this anywhere. I just did it for sh*** and giggles.
 */

(function($) {
	var onKeyPress = function(event) {
		var currentVar = $(this).data('stupidStory.currentVar');
		var vars = $(this).data('stupidStory.vars');
		var prompts = $(this).data('stupidStory.prompts');
		var blocks = $(this).data('stupidStory.textBlocks');
		if (event.which == 13) {
			if ($(this).find('.prompt').length > 0)
				$(this).find('.prompt').remove();
			var text = $(this).html();
			if (currentVar) {
				text += vars[currentVar];
				currentVar = '';
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
			$(this).data('stupidStory.currentVar', currentVar);
		}

		if (currentVar) {
			if (!vars[currentVar])
				vars[currentVar] = '';
			if (event.which > 31)
				vars[currentVar] = vars[currentVar] + String.fromCharCode(event.which);
			else if (event.which == 8 && vars[currentVar] && vars[currentVar].length > 0)
				vars[currentVar] = vars[currentVar].substr(0, vars[currentVar].length - 1);
			var p = $(this).find('.prompt');
			p = p.length > 0 ? p : $('<span class="prompt"></span>').appendTo(this);
			p.text(vars[currentVar] ? vars[currentVar] : prompts[currentVar]);
		}
	};

	var onClick = function(event) {
		if (typeof($(this).attr('tabindex')) == 'undefined')
			$(this).attr('tabindex', -1);
		this.focus();
	};

	/**
	 * Implements a little story that let's the user input some variables.
	 * @param text The text of the story. Variable placeholders consists of a variable name, prefixed with a dollar. Only variables declared in vars will be recognized.
	 * @param vars A hash containing variable names as keys and input prompts as values.
	 * @return jQuery set.
	 */
	$.fn.stupidStory = function(text, vars) {
		return this.each(function() {
			if (text == false) {
				return $(this)
					.removeData('stupidStory.currentVar')
					.removeData('stupidStory.textBlocks')
					.removeData('stupidStory.prompts')
					.removeData('stupidStory.vars')
					.unbind('keypress', onKeyPress)
					.unbind('click', onClick);
			}
	
			var rex = [];
			for (i in vars)
				rex.push(i);
			rex.sort(function(a, b) {
				return (a < b) ? 1 : -1;
			});
			var blocks = text.split(new RegExp('\\$(' + rex.join('|') + ')', 'g'));
			return $(this)
				.data('stupidStory.currentVar', '')
				.data('stupidStory.textBlocks', blocks)
				.data('stupidStory.prompts', vars)
				.data('stupidStory.vars', {})
				.keypress(onKeyPress)
				.click(onClick)
				.trigger($.extend($.Event('keypress'), {which: 13}));
		});

	};
})(jQuery);