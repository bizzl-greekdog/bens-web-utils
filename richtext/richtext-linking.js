/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @author Benjamin Kleiner
 * @copyright 2014
 * Hyperlink related functions for query.richtext.
 */

(function($) {
	/**
	 * A basic prompt function, making <code>window.prompt</code> deferred.
	 * @param text A string of text to display to the user.
	 * @param defaultText A string containing the default value displayed in the text input field.
	 * @return Deferred promise.
	 */
	function basePrompt(text, defaultText) {
		var defer = $.Deferred();
		window.setTimeout(function() {
			var r = window.prompt(text, defaultText);
			if (r === null || r === '')
				defer.reject();
			else
				defer.resolve(r);
		}, 0);
		return defer.promise();
	}
	
	/**
	 * Gets first anchor within a selection in an editor pane.
	 * @param editor An editor pane.
	 * @return The first anchor node found, or <code>false</code> if there was none.
	 */
	function getFirstAnchor(editor) {
		var sel = document.getSelection();
		var range = false;
		for (var i = 0; i < sel.rangeCount; i++) {
			range = sel.getRangeAt(i);
			var ancestor = range.commonAncestorContainer;
			if ($.contains(editor.get(0), ancestor) || editor.get(0) == ancestor)
				break;
			range = false;
		}
		if (!range)
			return false;
		var result = false;
		$(editor).find('a').each(function() {
			if (range.intersectsNode(this)) {
				result = this;
				return false;
			}
		});
		return result;
	}
	
	/**
	 * Reads or modifies the <code>href</code> of the first anchor tag found within a
	 * selection in an editor pane.
	 * @param editor An editor pane.
	 * @param h Optional new value for <code>href</code>.
	 * @return The <code>href</code> of the first anchor tag found, an empty string if there was none, or undefined if <code>href</code> was set.
	 */
	function href(editor, v) {
		var a = getFirstAnchor(editor);
		if (!v)
			return a ? a.href : '';
		else if (a)
			a.href = v;
	}
	
	var createLink = $.fn.richtext.buttons.classes.toggleButton('createLink', '&#xf0c1;');
	
	/**
	 * Text to be used for the prompt window.
	 */
	createLink.promptText = 'Enter URL';
	
	/**
	 * This function is called to create a prompt. It's prefilled, but can
	 * be overidden by developers to fit in better. Just make sure that it
	 * takes the two parameters and returns a deferred promise, which gets
	 * resolved with the input value on success and rejected on cancel.
	 * @param text A string of text to display to the user.
	 * @param defaultText A string containing the default value displayed in the text input field.
	 * @return Deferred promise.
	 */
	createLink.promptFunction = basePrompt;
	
	/**
	 * Overide <code>$.fn.richtext.buttons.classes.toggleButton.execute</code>
	 * to allow modifying existing anchors.
	 * @param editor The editor pane.
	 * @param button The button node.
	 */
	createLink.execute = function(editor, button) {
		if (!!getFirstAnchor(editor)) {
			createLink.promptFunction(createLink.promptText, href(editor)).then(function(url) {
				href(editor, url);
				editor.trigger('update');
			});
		} else {
			createLink.promptFunction(createLink.promptText).then(function(url) {
				document.execCommand(createLink.cmd, false, url);
				editor.trigger('update');
			});
		}
	};
	
	/**
	 * Overide <code>$.fn.richtext.buttons.classes.toggleButton.update</code>
	 * to detect anchor nodes.
	 * @param editor The editor pane.
	 * @param button The button node.
	 */
	createLink.update = function(editor, button) {
				if (!!getFirstAnchor(editor))
					button.addClass('pressed');
				else
					button.removeClass('pressed');
	};
	
	/**
	 * Button to create/modify hyperlink.
	 */
	$.fn.richtext.buttons.list.createLink = createLink;
	
	var removeLink = $.fn.richtext.buttons.classes.toggleButton('unlink', '&#xf127;');
	
	/**
	 * Overide <code>$.fn.richtext.buttons.classes.toggleButton.update</code>
	 * to detect anchor nodes.
	 * @param editor The editor pane.
	 * @param button The button node.
	 */
	removeLink.update = function(editor, button) {
				if (!!getFirstAnchor(editor))
					button.addClass('pressed');
				else
					button.removeClass('pressed');
	};
	
	/**
	 * Button to remove hyperlink.
	 */
	$.fn.richtext.buttons.list.removeLink = removeLink;
})(jQuery);