# Ben's Web Utilities

This repository contains a bunch of additions I wrote/collected for a couple of javascript libraries. As such they ain't the most optimized pieces of code, and you shouldn't expect any support for fancy dependency management anytime soon, but they work fine for me and might be useful for you.
Most code is written by myself. Most external pieces (usually lifted from fiddles and _stack overflow_) are marked as such.

# License

All code is released under the MIT License. For more information look at the file named `LICENSE`.

# Overview

## jquery
This directory contains a couple of old jQuery addons I wrote long ago, and their demos.
They're old and ugly, but still work, albeit some stuff can be done easier with other
frameworks these days, so they won't be updated pretty often. Some also use deprecated
methods, which might cause them to break in the future.

	* `enabling.js`: Adds some methods to `jQuery.fn` making it easier to en- or disable things like inputs and buttons.
	* `logging.js`: Adds a new logging system which can be caught with event handlers. It's nice,
	  but only works with code explicitly written to use it.
	* `stupidstory.js`: The names says all you need to know. It's useless, unless you wan't to learn a bit about
	  key events.
	* `tagwidget.js`: Creates a simple click-to-toggle tag widget from a select box.
	* `toolbox.js`: Creates a toolbox with cashew, similar to the one in plasma-desktop used by KDE 4.x. Probably the most useful.
