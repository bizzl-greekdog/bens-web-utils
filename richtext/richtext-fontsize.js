/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @author Benjamin Kleiner
 * @copyright 2014
 * Font size related functions for query.richtext.
 */

(function($) {
	
	/**
	 * Heading button class.
	 * It's need as the <code>heading</code> requires a parameter.
	 * @param type_ The type of headding.
	 * @return A button description.
	 */
	function HeadingButton(type_) {
		var impl = $.fn.richtext.buttons.classes.toggleButton(type_, '<i>' + type_ + '</i>');
		impl.execute = function(editor, button) {
				document.execCommand('heading', false, impl.cmd);
				editor.trigger('update');
			};
		impl.update = function(editor, button) {
				if (document.queryCommandValue('heading') == impl.cmd)
					button.addClass('pressed');
				else
					button.removeClass('pressed');
			}
		return impl;
	}
	
	/**
	 * Simple headings buttons.
	 */
	$.fn.richtext.buttons.list.heading1 = HeadingButton('h1');
	$.fn.richtext.buttons.list.heading2 = HeadingButton('h2');
	$.fn.richtext.buttons.list.heading3 = HeadingButton('h3');
	$.fn.richtext.buttons.list.heading4 = HeadingButton('h4');
	$.fn.richtext.buttons.list.heading5 = HeadingButton('h5');
	$.fn.richtext.buttons.list.heading6 = HeadingButton('h6');
})(jQuery);