/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * A knockout binding for CodeMirror. It's kind of limited, as it only supports
 * observables for it's content, the highlighting mode and wether line numbers
 * should be shown. A fourth, unobservable option called <code>preset</code> can contain
 * a name for an javascript object put into <code>ko.bindingHandlers.codemirror.presets</code>
 * which will be used for further options. It can also contain a function
 * <code>__init__(cm)</code>, which will be called at the end of the initialization
 * with the CodeMirror object so you can do further setup.
 * NOTE Do not bind to textarea. Use a <code>div</code> or other block node!
 * @param codemirror Primary trigger. Value should be the content observable.
 * @param lineNumbers Wether line numbers should be shown. Defaults to <code>false</code>.
 * @param mode The highlighting mode. Defaults to <code>null</code>.
 * @param preset Name of a preset containing further options. Defaults to <code>default</code>. Observables will be resolved.
 * @demo
 * @copyright Benjamin Kleiner 2014
 * @see http://codemirror.net
 */
ko.bindingHandlers.codemirror = {
	/**
	 * Merges two javascript objects into a new one.
	 * In case of duplicate keys the one found last will be used.
	 * @param * Objects to be merged.
	 * @return A new object containing all keys.
	 */
	merge: function() {
		var obj = {};
		for (var i = 0; i < arguments.length; i++)
			for (key in arguments[i])
				if (arguments[i].hasOwnProperty(key))
					obj[key] = arguments[i][key];
		return obj;
	},
	/**
	 * Unwraps all keys in an object.
	 * @param obj A javascript object which might contain observables.
	 * @return A new object containing no observables.
	 */
	unwrapAll: function(obj) {
		var result = {};
		for (var key in obj)
			if (obj.hasOwnProperty(key))
				result[key] = ko.unwrap(obj[key]);
		return result;
	},
	/**
	 * The preset storage.
	 */
	presets: {default: {}},
	/**
	 * Binding init as required by KnockoutJS.
	 * @param element
	 * @param valueAccessor
	 * @param allBindings
	 * @param viewModel
	 * @param bindingContext
	 */
	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		/**
		 * A new, somewhat safer getter.
		 * @param key The binding key whoms value should be fetched.
		 * @param defaultValue The default value to be used if the key doesn't exist.
		 * @param keepWrapped Wether the value should stay wrapped. Defaults to <code>false</code>.
		 * @return The bindings value.
		 */
		allBindings.get2 = function(key, defaultValue, keepWrapped) {
			var result = allBindings.has(key) ? allBindings.get(key) : defaultValue;
			if (!keepWrapped)
				result = ko.unwrap(result);
			return result;
		};
		binder = ko.bindingHandlers.codemirror;
		
		// Select preset.
		var presetOptions = allBindings.get2('preset', 'default');
		if (binder.presets.hasOwnProperty(presetOptions))
			presetOptions = binder.presets[presetOptions];
		else
			presetOptions = binder.presets.default;
		
		// Merge options.
		var options = binder.merge(presetOptions, {
			mode: allBindings.get2('mode', null, true),
			lineNumbers: allBindings.get2('lineNumbers', false, true)
		});
		
		// Create the editor and set it's content.
		var cm = CodeMirror(element, binder.unwrapAll(options));
		cm.setValue(ko.unwrap(valueAccessor()));
		
		/*
		 * Subscribe to any observable options. This way some options
		 * which can only be set via the preset can be observables to,
		 * but be cautios...
		 */
		for (var key in options)
			if (options.hasOwnProperty(key) && ko.isObservable(options[key])) {
				var fn = function(nv) {
					var k = arguments.callee.key;
					cm.setOption(k, nv);
				};
				fn.key = key;
				options[key].subscribe(fn);
			}
		
		// Subscribe to the content observable.
		if (ko.isObservable(valueAccessor())) {
			cm.on('change', function(e, changes) {
				valueAccessor()(e.getValue());
			});
		}
		
		/*
		 * Store the CodeMirror object. This could be done better with
		 * jQuery.data, but then we'd have another dependency...
		 */
		element.__codemirror__ = cm;
		
		// Call the __init__ function.
		if (options.__init__ && typeof options.__init__ == 'function')
			options.__init__(cm);
	},
	/**
	 * Binding update as required by KnockoutJS.
	 * @param element
	 * @param valueAccessor
	 * @param allBindings
	 * @param viewModel
	 * @param bindingContext
	 */
	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		if (element.__codemirror__.getValue() != ko.unwrap(valueAccessor()))
			element.__codemirror__.setValue(ko.unwrap(valueAccessor()));
	}
};