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
	
	/**
	 * Creates a toolbar for an editor from an array of "buttons".
	 * These can be either strings, which will be looked up in <code>$.fn.richtext.buttons.list</code>,
	 * or a definition object containing a <code>create(editor)</code> method.
	 * @param editor The editor pane. This does not referer to the whole widget!
	 * @param options An array of "buttons", which are either names or definitions.
	 * @return A jQuery set containing the toolbars main node (<code>&lt;nav/&gt;</code>)
	 */
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
	
	/**
	 * Initializes the editor widget, creating both toolbars and the actual
	 * editor pane inside the original DOM node, using it's HTML content
	 * as richtext content.
	 * @param widget The DOM node (jQuery set) which will be turned into an editor.
	 * @param options A javascript object with options.
	 */
	function initializeEditor(widget, options) {
		/* TODO Add more modes? */
		options = $.extend({}, $.fn.richtext.defaults, options);
		var text = widget.html();
		var oldClasses = widget.attr('class');
		var editor = $('<div/>')
			.attr('contenteditable', 'true')
			.addClass('editor')
			.html(text)
			.on('mousedown mouseup keydown keyup paste copy cut', function() { $(this).trigger('update'); })
			.on('update', function() {
				var self = $(this);
				if (self.html() !== self.data('previousContent')) {
					widget.trigger('richtext-update');
					self.data('previousContent', self.html());
				}
				
			});
		editor.data('previousContent', editor.html());
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
	
	/**
	 * Destroys a given editor widget. The content of the editor pane will
	 * be used as the nodes new HTML content.
	 * @param widget The DOM node (jQuery set) of the editor.
	 */
	function destroyEditor(widget) {
		var options = widget.data('richtext');
		widget.removeData('richtext');
		/* TODO Deep destroy necessary? */
		widget
			.html(options.editor.html())
			.attr('class', options.oldClasses); // NOTE A bit hardcore, maybe just remove .richtext ?
	};
	
	/**
	 * The actual method, added to jQuerys set namespace.
	 * Call empty or with an object as first parameter to create an editor widget,
	 * a string to access an option of an already Initialized editor (use second
	 * second parameter to write), or <code>false</code> to destroy an editor
	 * widget.
	 * @param options Options object or key.
	 * @param value Optional new value for an editor option.
	 * @return The value of an option if the only parameter is a known command string, the original jQuery set otherwise.
	 */
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
	
	/**
	 * Namespace for all toolbar button related things.
	 */
	$.fn.richtext.buttons = {};
	
	/**
	 * Stores "classes" (read: factory functions) to reduce code repetition.
	 */
	$.fn.richtext.buttons.classes = {};
	
	/**
	 * A simple label.
	 * @param text The labels text.
	 * @return Descriptive object.
	 */
	$.fn.richtext.buttons.classes.label = function(text) {
		var impl = {
			text: text,
			create: function(editor) {
				return $('<span/>').text(impl.text);
			}
		};
		return impl;
	};
	
	/**
	 * A simple button accessing <code>document.execCommand</code>.
	 * @param cmd A command string supported by <code>document.execCommand</code>.
	 * @param icon An HTML string to create an "icon".
	 * @return Descriptive object.
	 */
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
	
	/**
	 * A simple button accessing <code>document.execCommand</code>, getting
	 * highlighted if <code>document.queryCommandState</code> returns true.
	 * @param cmd A command string supported by <code>document.execCommand</code>.
	 * @param icon An HTML string to create an "icon".
	 * @return Descriptive object.
	 */
	$.fn.richtext.buttons.classes.toggleButton = function(cmd, icon) {
		var impl = {
			icon: icon,
			cmd: cmd,
			execute: function(editor, button) {
				document.execCommand(impl.cmd, false, null);
				editor.trigger('update');
			},
			update: function(editor, button) {
				if (document.queryCommandState(impl.cmd))
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
	
	/**
	 * A list of predefined buttons. <code>initializeToolbar</code> uses it
	 * to look up buttons if given strings.
	 */
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
	
	/**
	 * Default settings for widget constructor.
	 */
	$.fn.richtext.defaults = {
		mode: 'embedded',
		toolbars: [
			['undo', 'redo', /*'|', 'cut', 'copy', 'paste',*/ '|', 'bold', 'italic', 'underline']
		]
	};
})(jQuery);