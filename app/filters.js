var _ = require('lodash');

module.exports = function(env) {

  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {};
  
  /**
   * converts a parameter to a string
   * @param  {*} a a variable
   * @return {String}   The string value of the variable
   */
  filters.s = filters.toString = function toString(a) {
    return typeof a.toString === 'function' ? a.toString() : '' + a;
  };

  /**
  * checks if string contains passed substring
  * @param {*} a variable - the string you want to test
  * @param {String} the string you want to test for
  * @return {Boolean} true if found else false
   */
  filters.contains = function contains(a, s) {
    return a && s ? !!~a.indexOf(s) : false;
  };

  /**
  * checks if string contains passed substring
  * @param {*} a variable - the string you want to test
  * @param {String} r the RegExp to test
  * @return {Boolean} true if found else false
   */
  filters.containsRegExp = function containsRegExp(a,r) {
    return new RegExp(r).test(a);
  };

  /**
   * ensure input is an array
   * @param  {*} i an item
   * @return {Array}   the item as an array
   */
  filters.plural = function plural(i) {
    return Array.isArray(i) ? i : typeof i !== 'undefined' ? [i] : [];
  };

  /**
   * ensure input is not an array
   * @param  {*} a any variable
   * @return {*}   anything that isn't an array.
   */
  filters.singular = function singular(a) {
    return _.isArray(a) ? a[0] : a;
  };

  /**
   * converts an array of objects or singular object to a list of pairs.
   * @param  {Array|Object} a  an array of objects or singular object
   * @param  {String} (optional) kp key property name, used if array of objects. defaults to 'key'
   * @param  {String} (optional) vp value property name, used if array of objects. defaults to 'value'
   * @return {Array}    array of key-value arrays
   */
  filters.pairs = function pairs(a, kp, vp) {
    return _.isPlainObject(a) ? Object.keys(a).map(function(k) { return ! _.isEmpty(k) ? [k, a[k]] : '' }) :
           _.isArray(a) ? a.map(function(b) { return _.isPlainObject(b) ? [ _.get(b, kp || 'key'), _.get(b, vp || 'value') ] : b }) :
           a;
  };

  /**
   * maps pair values to object keys.
   * @param  {Array|Object} p  an array
   * @param  {String} (optional) k1 key 1 will point to first value in array
   * @param  {String} (optional) k2 key 2 will point to second value in array
   * @return {Object} 	object with two key/values
   */
  filters.unpackPair = function unpackPair(p, k1, k2) {
    var o = {}; return ( o[k1] = p[0], o[k2] = p[1], o);
  };

  /**
   * prefixes each item in a list
   * @param  {*} is a list of items, or a single item.
   * @param  {String|Function} p  a string or function to prefix the first item with.
   * @return {Array}    a list of prefixed items.
   */
  filters.prefix = function prefix(is, p) {
    return filters.plural(is).map(function(i, index) {
      return _.isFunction(p) ? p(i, index) : _.isArray(p) ? p[index] + i : p + i;
    });
  };

  /**
   * in a list of lists (is), prefixes a string (p) to the first item of the inner list
   * @param  {Array} is a list of lists
   * @param  {String|Function} p  a string or function to prefix the first item with
   * @return {Array}    a list of items with the first item of the inner item prefixed
   */
  filters.prefixFirst = function prefixFirst(is, p) {
    return filters.plural(is).map(function(i) {
      return _.isArray(i) ? (i[0] = _.isFunction(p) ? p(i[0]) : i[0], i) : i;
    });
  };

  /**
   * postfixes each item in a list
   * @param  {*} is a list of items, or a single item.
   * @param  {String|Number} p  used to postfix item.
   * @return {Array}    a list of postfixed items.
   */
  filters.postfix = function postfix(is, p) {
    return filters.plural(is).map(function(i) { return _.isArray(i) ? filters.postfix(i, p) : i + p });
  };

  /**
   * wrap a string or a list of strings in two strings.
   * @param  {Array|String} w the string or list of strings to wrap
   * @param  {String} b the before string
   * @param  {String} a the after string
   * @return {Array}   the wrapped item
   */
  filters.wrap = function wrap(w,a,b) {
    return a + w + b;
  };

  /**
   * gets the css modifiers of a base class name.
   * @param  {String} b  base class name
   * @param  {Array|String} ms modifiers
   * @return {string}    modifiers
   */
  filters.modifiers = function modifiers(b, ms) {
    return filters.plural(ms).map(function(m) { return b + '--' + m }).join(' ');
  };

  /**
   * prepends a base class with the modifiers of the base class.
   * @param  {String} b  base class
   * @param  {Array|String} ms modifiers
   * @return {String}    base class name and modifiers
   */
  filters.withModifiers = function withModifiers(b, ms) {
    return [b].concat(filters.modifiers(b, ms) || []).join(' ');
  };

  /**
   * composes the classes for the component
   * @param  {String} b  base module class
   * @param  {Object} md the metadata object
   * @return {String}    component classes
   */
  filters.componentClasses = function componentClasses(b, md) {
    return (md = md || {}, [filters.withModifiers(b, md.modifiers)].concat(md.classes || []).join(' '));
  };

  /**
   * logs an object in the template to the console on the client.
   * @param  {Any} a any type
   * @return {String}   a script tag with a console.log call.
   * @example {{ "hello world" | log }}
   * @example {{ "hello world" | log | safe }}  [for environments with autoescaping turned on]
   */
  filters.log = function log(a) {
  	return '<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>';
  };

  /**
   * Converts string to camel case
   * @param {String} any string
   * @return {String} a string
   * @example {{ "Hello There" | toCamelCase }} // helloThere
   */
  filters.toCamelCase = function toCamelCase(s) {
  	return s.trim().split(/-| /).reduce(function (pw, cw, i) {
  		return pw += (i === 0 ? cw[0].toLowerCase() : cw[0].toUpperCase()) + cw.slice(1);
  	}, '');
  };

  /**
   * Hypthenates a string
   * @param {String} string to be converted
   * @return {String}
   * @example {{ "Hello there" | toHyphenated }} // hello-there
   */
  filters.toHyphenated = function toHyphenated(s) {
  	return s.trim().toLowerCase().replace(/\s+/g, '-');
  };

  /**
   * padZeros on a number
   * @param n {Number} value to be padded
   * @param l {Number} padding length
   * @example {{ 3 | padZeros(2) }} // 003
   */
  filters.padZeros = function padZeros(n, l) {
  	var t = l - String(n).length;
  	return Array((t > -1 ? t : 0) + 1).join('0') + String(n);
  };

  filters.hashCode = function(s){
  	if (!s) { return ""; }
  	return s.split("").reduce(function (a, b) {
  		a = ((a << 5) - a) + b.charCodeAt(0);
  		return a & a;
  	}, 0);
  };

  /**
   * map over a list and transform items
   * @param  {Array} is list of items
   * @param  {Array|String} ps a list of properties to filter
   * @param  {String} rp root property to filter. Undefined by default
   * @return {Array}    lodash method to map with. 'pick' by default.
   */
  filters.reduceTo = function reduceTo(is, ps, rp, m) {
  	return _.map(is, function(i) {
  		i = _[m || 'pick']( rp? i[rp] : i, ps );
  		return _.filter(_.without(_.values(i), undefined), _.not(_.isEmpty)).length === ps.length ? i : {};
  	});
  };

  /**
   * remove unwanted items from a list
   * @param  {Array} is a list of items
   * @param  {String} e  the thing to exclude
   * @param  {String} m  an override method. ('_.without' by default)
   * @return {Array}    a list without matched items
   */
  filters.without = function without(is, e, m) {
  	switch(e) {
  		case "__empty__":
  			e = _.not(_.isEmpty); m = 'filter';
  	}

  	return _[ m || 'without' ]( is , e );
  };

  /**
   * writes the context as the value of an attribute
   * @param  {String} v the attribute value
   * @param  {String} a attribute name
   * @return {String}
   */
  filters.attr = function attr(v, a, p) {
  	return (!_.isEmpty(v) ? (p || '') + a + '="' + v + '"' : '');
  };

  /**
   * takes a list of key-value lists and converts them to attribute format
   * @param  {Array} is list of key-value lists
   * @param  {String} (optional) p  prefix the attribute name
   * @return {Array} list of attributes
   */
  filters.attrs = function attrs(is, p) {
  	return filters.plural(is).map( function(i) { return _.isArray(i) ? filters.attr(i[1], i[0], p) : '' } );
  };

  /**
   * replaces a string with another string in an object of known conversions.
   * @param  {String} s the string to be transformed
   * @param  {Object} o the object with known values
   * @param  {Object} d a default in case s is not in o. (if unspecified default is s.)
   * @return {String}
   */
  filters.tr = function tr(s, o, d) {
  	return (
  		o = o || L1.Translations.getCurrent(ctx) || {},
  		~ _.keys(o).indexOf(s) ? o[s] : typeof d !== 'undefined' ? d : s
  	);
  };

  /**
   * translate characters in a string
   * @param  {String} s  the string to translate
   * @param  {String} ss the substring to replace
   * @param  {String} r  the replacee string
   * @param  {String} f  regex flags, 'g' by default
   * @return {String}    a translated string
   */
  filters.trC = function trC(s, ss, r, f) {
  	return (s||'').replace(new RegExp(ss, typeof f === 'string' ? f : 'g'), r);
  };

  /**
   * filter a list for matching keys & values
   * @param  {Array} is a list of items
   * @param  {String} k the key to filter
   * @param  {String|Array} v the value to filter
   * @param  {Boolean} regex test the item against v as regex.
   * @return {Array}
   */
  filters.filter = function filter(is,k,v,regex) {
  	return _.filter(is, function(i) { return ! v ? _.get(i, k) : regex ? RegExp(v).test(_.get(i, k)) : !!~filters.plural(v).indexOf(_.get(i, k)) });
  };

  /**
   * filter a list for not matching keys & values
   * @param  {Array} is a list of items
   * @param  {String} k the key to filter
   * @param  {String|Array} v the value to filter
   * @return {Array}
   */
  filters.filterWithout = function filterWithout(is,k,v) {
  	return _.filter(is, function(i) { return ! (_.get(i, k) ? _.get(i, k) === v : false) });
  };

  /**
   * creates rearranges values and creates new date object
   * @param  {String} d   A date string (must be) formatted (d)d/(m)m/yyy - in parens means optional
   * @return {String}     a javascript date string
   */
  filters.newDate = function date(d) {
  	var dateArr = d.split('/');
  	return dateArr.length === 3 ? new Date(dateArr[2], parseInt(dateArr[1]) - 1, dateArr[0]) : NaN;
  };

  /**
   * gets a function for a string filter or macro name.
   * @param  {String} f the name of a filter or macro.
   * @return {Function}   the function for the filer or macro name or noop.
   */
  filters.identity = function identity(f) {
  	return _.isFunction(es[f]) ? es[f] : _.isFunction(this.ctx[f]) ? this.ctx[f].bind(this.ctx) : _.noop;
  };

  /**
   * maps a function over a list
   * @param  {Array} is a list of items
   * @param  {Function} f  a function to apply to each item in the list
   * @param  {Array} (optional) ...args any additional arguments will be partially applied to f.
   * @return {Array}    a transformed list
   */
  filters.fmap = function fmap(is, f /*, ...args */) {
  	return filters.plural(is).map(_.partial.apply(_, [f, _].concat([].slice.call(arguments, 2))));
  };

  /**
   * parses JSON from a string.
   * @param  {String} s a JSON string
   * @return {any}   a parsed JSON document
   */
  filters.parseJSON = function parseJSON(s) {
  	return JSON.parse(s);
  };

  /**
   * takes a JavaScript object and returns a JSON string representing it.
   * @param  {any} any [description]
   * @return {[type]}   [description]
   */
  filters.stringifyJSON = function stringifyJSON(any) {
  	return JSON.stringify(any);
  };

  /**
   * reduce a list with a function
   * @param  {Array} is      a list to reduce
   * @param  {Function} f       function to reduce with
   * @param  {any} (Optional) initial an initial value for the reduction.
   * @return {any}
   */
  filters.reduce = function reduce(is, f, initial) {
  	return filters.plural(is).reduce(f, initial);
  };

  /**
   * concatenates two lists
   * @param  {Array} a list a
   * @param  {Array} b list b
   * @return {Array}   a new list of a and b
   */
  filters.concat = function concat(a, b) {
  	return a && b ? a.concat(b) : a && !b ? a : b;
  };

  /**
   * plucks multiple properties - like you might expect pluck to do...
   * @param  {Array} os list of objects
   * @param  {Array} ps array of properties
   * @return {Array}    new list of objects
   */
  filters.pluckMany = function pluckMany(os, ps) {
  	return _.map(os, function(o) { return _.pick(o, ps); });
  };

  filters.tailString = function tailString(s, m) {
  	return s.substring(s.lastIndexOf(m));
  };

  /**
   * replaces occurances of a substring with another string.
   * @param  {String} s the string to augment
   * @param  {String} m a substring to match (converted to RegExp)
   * @param  {String} p the replacement for the substring. (Use $1, $2, etc to use match groups / initial.)
   * @return {String}   the augmented string
   */
  filters.replaceInString = function replaceInString(s, m, p) {
  	return s.replace(RegExp(m, 'ig'), function() {
  		var args = arguments;
  		return p.replace(/\$([0-9])/ig, function(a, _m) {
  			return args[_m - 1];
  		});
  	});
  };

  /**
   * slice an array (splice because slice is a default filter.)
   * @param  {Array} is items to slice
   * @param  {Number} a  Index to slice from
   * @param  {Number} (optional) b  Index to slice to
   * @return {Array}    a sliced list
   */
  filters.splice = function splice(is, a, b) {
  	return filters.plural(is).slice(a, b);
  };

  /**
   * splice an array
   * @param  {Array} 		is items to splice
   * @param  {Number} 	a  Index to splice from
   * @param  {Number} 	(optional) b  Index to splice to
   * @param  (optional) 	c  Item to inset at index a
   * @return {Array}   	a spliced list
   */
  filters.spliceItem = function spliceItem(is, a, b, c) {
  	return filters.plural(is).splice(a, b, c);
  };

  /**
   * deep merge that supports concating arrays & strings.
   * @param  {Object} o1           a plain object to merge
   * @param  {Object} o2           a plain object to merge
   * @param  {Boolean} mergeStrings will merge strings together if true
   * @return {Object}              the resulting merged object
   */
  filters.deeperMerge = function deeperMerge(o1, o2, mergeStrings) {

  	mergeStrings = typeof mergeStrings !== undefined ? mergeStrings : false;

  	// exit conditions
  	if      ( ! o1 && ! o2 )          { return; }
  	else if ( ! _.isPlainObject(o1) ) { return o2; }
  	else if ( ! _.isPlainObject(o2) ) { return o1; }

  	return _
  		.union(Object.keys(o1), Object.keys(o2))
  		.map(function(k) {
  			return [k, (
  				( typeof o1[k] === 'string' && typeof o2[k] === 'string' ) ? ( mergeStrings ? o1[k] + o2[k] : o2[k] ) :
  				( _.isPlainObject(o1[k]) || _.isPlainObject(o2[k]) ) ? deeperMerge(o1[k], o2[k], mergeStrings) :
  				( _.isArray(o1[k]) && _.isArray(o2[k]) ) ? o1[k].concat(o2[k]) :
  				( o1[k] && !o2[k] ) ? o1[k] : o2[k]
  			)];
  		})
  		.reduce(function(a, b) { return (a[b[0]] = b[1], a) }, {});
  };

  filters.populateCDO = function populateCDO(article) {
  	return (article.section = article.section.map(function(s) {
  		return (s.contentGroups = s.contentGroups.map(function(c) {
  			return (c.contentDisplayOptions = c.contentDisplayOptions
  				.map(JSON.parse)
  				.reduce(filters.deeperMerge), c);
  		}), s);
  	}), article);
  };

  filters.padZeros = function padZeros(n, l) {
  	var t = l - String(n).length;
  	return Array((t > -1 ? t : 0) + 1).join('0') + String(n);
  };

  /**
   * generates a list of month / year pairs from the current month to the end of the following year.
   * @param  {Array<String>} ms  a list of month names
   * @param  {Number} max the number of items to list
   * @return {Array<Object>}     A list of objects with label and value.
   */
  filters.monthYearRange = function monthYearRange(ms, max) {
  	max = max || 10;
  	return (
  		ms
  			.slice((new Date).getMonth())
  			.map(function(m) { return [m, filters.padZeros(ms.indexOf(m) + 1, 2), (new Date).getFullYear()] })
  			.concat( ms.map(function(m, i) { return [m, filters.padZeros(i + 1, 2), (new Date).getFullYear() + 1] }) )
  			.slice(0, max)
  			.map(function(r) {
  				return {
  					label: r[0] + ' ' + r[2],
  					value: r[1] + '-' + r[2]
  				};
  			})
  	);
  };

  /**
   * Converts a number of seconds to the format HH:mm:ss
   * @param  {Integer} d The number of seconds
   * @return {String} The seconds int the format HH:mm:ss
   * @see http://stackoverflow.com/a/5539081/486434
   */
  filters.secondsToHms = function secondsToHms(d) {
  	d = Number(d);
  	var h = Math.floor(d / 3600);
  	var m = Math.floor(d % 3600 / 60);
  	var s = Math.floor(d % 3600 % 60);
  	return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
  };

  /**
   * generate a range of times
   * @param  {String} from      time string with the format 00:00
   * @param  {String} to        time string with the format 00:00
   * @param  {Number} increment the number of minutes to increment by
   * @return {Array}           a range of times
   */
  filters.timeRange = function timeRange(range, key) {
  	var from = range[0]
  		, to = range[1]
  		, increment = range[2]
  		, _from = from.split(':')
  		, _to = to.split(':')
  		, count = ((+_to[0] - +_from[0]) * 60) + (+_to[1] - +_from[1]);

  	if ( count % increment === 0 ) {
  		return (_
  			.range((+_from[0]) * 60 + (+_from[1]), (+_to[0] * 60) + (+_to[1]), increment)
  			.map(filters.secondsToHms)
  			.map(function(time) {
  				return [[(typeof key === 'string' ? key : 'value'), time]];
  			})
  		);
  	} else {
  		return [];
  	}
  };

  filters.dayRange = function(range, key) {
  	return (
  		_.range(range[0], range[1] + 1).map(function(day) {
  			return [[ typeof key === 'string' ? key : 'value', filters.padZeros(day, 2) ]];
  		})
  	);
  };

  /**
   * pluck an inner item for each item in a list
   * @param  {Array} is a list of objects
   * @param  {String} p  property to pluck (supporting 'foo.bar.baz' syntax.)
   * @return {Array}    list with inner values
   */
  filters.pluck = function pluck(is, p) {
  	return filters.plural(is).map(function(i) {
  		return filters.get(i, p);
  	});
  };

  /**
   * joins a list on a string
   * @param  {Array} is items
   * @param  {String} s  string to join the list on
   * @return {String}    joined items
   */
  filters.join = function join(is, s) {
  	return filters.plural(is).join(s);
  };

  /**
  * spilts a string on the delimiter passed in
  */
  filters.split = function split(s, delimiter) {
  	return (s || '').split(delimiter);
  };

  /**
   * renders a macro
   * @param  {String|Function} m a macro name or function
   * @param {ArgumentsList} ...args further arguments will be passed to the macro or function
   * @return {String}   the rendered output
   */
  filters.__call__ = function __call__(m /*, ...args */) {
  	var args = [].slice.call(arguments, 1);
  	if ( typeof m === 'function' ) {
  		return m.apply(this.ctx, args);
  	} else if ( ~ this.exported.indexOf(m) ) {
  		return this.ctx[m].apply(this.ctx, args);
  	}
  };

  /**
   * Convert a number character to uppercased letter based on alphabet index.
   * @param  {String} n - Number character to conver to alpahbet character
   * @return {String} Converted character in Uppoercase
   */
  filters.strNumToUpperChar = function strNumToUpperChar(n) {
  	var value = parseInt(n);
  	return String.fromCharCode(64 + value);
  };

  filters.setCtx = function(_ctx) {
  	ctx = _ctx;
  };
  
  // export some lodash methods directly.
  // See: https://lodash.com/docs
  filters.merge = filters.m = _.merge;
  filters.defaults = filters.ds = _.defaults;
  filters.keys = _.keys;
  filters.values = _.values;
  filters.first = _.first;
  filters.flatten = _.flatten;
  filters.flattenDeep = _.flattenDeep;
  filters.get = _.get;
  filters.pick = _.pick;
  filters.range = _.range;
  filters.zipObject = function(a) { return _.zipObject(a) };
  filters.omit = _.omit;
  filters.clone = _.clone;
  filters.kebabCase = _.kebabCase;

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters;

};