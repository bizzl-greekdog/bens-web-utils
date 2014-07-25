// Preliminary added so I can work on it in Cloud9.io. I'll have to ask Ryan before I can actually release it!
/* This Source Code Form is subject to the terms of the MIT License.
 * If a copy of the MIT was not distributed with this
 * file, You can obtain one at http://opensource.org/licenses/MIT .
 */

/**
 * Enables KnockoutJS to work with HTML5's `contenteditable`. This variety access
 * the text content.
 * Mostly external code, but I found it to work perfectly, so I added it here.
 * @demo
 * @copyright Ryan Niemeyer 2011
 * @see https://groups.google.com/d/topic/knockoutjs/Mh0w_cEMqOk/discussion
 * @see http://stackoverflow.com/questions/7904522/knockout-content-editable-custom-binding
 */
ko.bindingHandlers.editableText = {
	init: function(element, valueAccessor, allBindingsAccessor) {
		element.setAttribute('contenteditable', 'true');
		ko.utils.registerEventHandler(element, 'keyup', function() {
			var modelValue = valueAccessor();
			var elementValue = element.textContent;
			if (ko.isWriteableObservable(modelValue)) {
				modelValue(elementValue);
			} else {
				var allBindings = allBindingsAccessor();
				if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].editableText)
					allBindings['_ko_property_writers'].editableText(elementValue);
			}
		});
	},
	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var value = ko.utils.unwrapObservable(valueAccessor()) || '';
		if (element.textContent !== value)
			element.textContent = value;
	}
};
