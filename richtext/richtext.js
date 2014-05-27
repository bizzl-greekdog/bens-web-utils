/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * @name jquery.richtext
 * @author Benjamin Kleiner
 * @copyright 2014
 * A simple richtext editor for jQuery. Uses Font Awesome.
 */

(function($) {
	function ToBoolean(b) {
		if (b.toLowerCase) return b.toLowerCase() == 'true';
		return b;
	}
	
	function initializeToolbar(editor, options) {
		if (! options.forEach)
			return '';
		var toolbar = $('<nav/>').addClass('toolbar');
		options.forEach(function(n) {
			if ($.fn.richtext.buttons.list[n])
				n = $.fn.richtext.buttons.list[n];
			if (n.create)
				toolbar.append(n.create(editor));
		});
		return toolbar;
	}
	
	function initializeEditor(widget, options) {
		/* TODO Add more modes? */
		options = $.extend({}, $.fn.richtext.defaults, options);
		var text = widget.html();
		var oldClasses = widget.attr('class');
		var editor = $('<div/>')
			.attr('contenteditable', 'true')
			.addClass('editor')
			.html(text)
			.on('mousedown mouseup keydown keyup', function() { $(this).trigger('update'); })
			.on('update', function() { widget.trigger('richtext-update'); });
		widget.addClass('richtext').html('');
		if (options.toolbars && options.toolbars.forEach)
			options.toolbars.forEach(function(tb) {
				widget.append(initializeToolbar(editor, tb));
			});
		widget
			.append(editor)
			.data('richtext', {
				options: options,
				oldClasses: oldClasses,
				editor: editor
			});
	}
	
	function destroyEditor(widget) {
		var options = widget.data('richtext');
		widget.removeData('richtext');
		/* TODO Deep destroy? */
		widget
			.html(options.editor.html())
			.attr('class', options.oldClasses); // NOTE A bit hardcore, maybe just remove .richtext ?
	};
	
	$.fn.richtext = function(options, value) {
		if (options === false)
			return this.each(function() { destroyEditor($(this)); });
		else if (typeof options === 'string') {
			if (options.toLowerCase() == 'content') {
				if (value === undefined)
					return this.eq(0).data('richtext').editor.html();
				this.eq(0).data('richtext').editor.html(value);
			}
			return this;
		} else
			return this.each(function() { initializeEditor($(this), options); });
	};
	
	$.fn.richtext.buttons = {};
	$.fn.richtext.buttons.classes = {};
	$.fn.richtext.buttons.classes.label = function(text) {
		var impl = {
			text: text,
			create: function(editor) {
				return $('<span/>').text(impl.text);
			}
		};
		return impl;
	};
	$.fn.richtext.buttons.classes.simpleButton = function(cmd, icon) {
		var impl = {
			icon: icon,
			cmd: cmd,
			execute: function(editor, button) {
				document.execCommand(impl.cmd, false, null);
				editor.trigger('update');
			},
			create: function(editor) {
				var btn = $('<button/>');
				btn	.html(impl.icon)
					.addClass('simple-button')
					.click(function(evt) {
						impl.execute(editor, btn);
					});
				return btn;
			}
		};
		return impl;
	};
	$.fn.richtext.buttons.classes.toggleButton = function(cmd, icon) {
		var impl = {
			icon: icon,
			cmd: cmd,
			execute: function(editor, button) {
				document.execCommand(impl.cmd, false, null);
				editor.trigger('update');
			},
			update: function(editor, button) {
				if (ToBoolean(document.queryCommandState(impl.cmd)))
					button.addClass('pressed');
				else
					button.removeClass('pressed');
			},
			create: function(editor) {
				var btn = $('<button/>');
				btn	.html(impl.icon)
					.addClass('simple-button')
					.click(function(evt) {
						impl.execute(editor, btn);
					});
				editor.on('update', function(evt) {
					impl.update(editor, btn);
				});
				return btn;
			}
		};
		return impl;
	};
	$.fn.richtext.buttons.list = {
		insertHorizontalRule: $.fn.richtext.buttons.classes.simpleButton('insertHorizontalRule', '&#x2015;'),
		indent: $.fn.richtext.buttons.classes.simpleButton('indent', '&#xf03c;'),
		outdent: $.fn.richtext.buttons.classes.simpleButton('outdent', '&#xf03b;'),
		cut: $.fn.richtext.buttons.classes.simpleButton('cut', '&#xf0c4;'),
		copy: $.fn.richtext.buttons.classes.simpleButton('copy', '&#xf0c5;'),
		paste: $.fn.richtext.buttons.classes.simpleButton('paste', '&#xf0ea;'),
		undo: $.fn.richtext.buttons.classes.simpleButton('undo', '&#xf0e2;'),
		redo: $.fn.richtext.buttons.classes.simpleButton('redo', '&#xf01e;'),
		removeFormat: $.fn.richtext.buttons.classes.simpleButton('removeFormat', '&#xf12d;'),
		/**/
		bold: $.fn.richtext.buttons.classes.toggleButton('bold', '&#xf032;'),
		italic: $.fn.richtext.buttons.classes.toggleButton('italic', '&#xf033;'),
		underline: $.fn.richtext.buttons.classes.toggleButton('underline', '&#xf0cd;'),
		strikethrough: $.fn.richtext.buttons.classes.toggleButton('strikethrough', '&#xf0cc;'),
		superscript: $.fn.richtext.buttons.classes.toggleButton('superscript', '&#xf12b;'),
		subscript: $.fn.richtext.buttons.classes.toggleButton('subscript', '&#xf12c;'),
		insertOrderedList: $.fn.richtext.buttons.classes.toggleButton('insertOrderedList', '&#xf0cb;'),
		insertUnorderedList: $.fn.richtext.buttons.classes.toggleButton('insertUnorderedList', '&#xf03a;'),
		justifyleft: $.fn.richtext.buttons.classes.toggleButton('justifyleft', '&#xf036;'),
		justifycenter: $.fn.richtext.buttons.classes.toggleButton('justifycenter', '&#xf037;'),
		justifyright: $.fn.richtext.buttons.classes.toggleButton('justifyright', '&#xf038;'),
		justifyfull: $.fn.richtext.buttons.classes.toggleButton('justifyfull', '&#xf039;'),
		/**/
		'|': $.fn.richtext.buttons.classes.label('|')
	};
	
	$.fn.richtext.defaults = {
		mode: 'embedded',
		toolbars: [
			['undo', 'redo', '|', 'cut', 'copy', 'paste', '|', 'bold', 'italic', 'underline']
		]
	};
})(jQuery);