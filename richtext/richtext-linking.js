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
	
	function insideAnchor(editor) {
		return (!!getFirstAnchor(editor));
	}
	
	function href(editor, v) {
		var a = getFirstAnchor(editor);
		if (!v)
			return a ? a.href : '';
		else if (a)
			a.href = v;
	}
	
	var createLink = $.fn.richtext.buttons.classes.toggleButton('createLink', '&#xf0c1;');
	createLink.promptText = 'Enter URL';
	createLink.promptFunction = basePrompt;
	createLink.execute = function(editor, button) {
		if (insideAnchor(editor)) {
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
	createLink.update = function(editor, button) {
				if (insideAnchor(editor))
					button.addClass('pressed');
				else
					button.removeClass('pressed');
	};
	$.fn.richtext.buttons.list.createLink = createLink;
	
	var removeLink = $.fn.richtext.buttons.classes.toggleButton('unlink', '&#xf127;');
	removeLink.update = function(editor, button) {
				if (insideAnchor())
					button.addClass('pressed');
				else
					button.removeClass('pressed');
	};
	$.fn.richtext.buttons.list.removeLink = removeLink;
})(jQuery);