(function( window, undefined ) {
"use strict"
var document = window.document;
	//navigator = window.navigator,
	//location = window.location;
var gecko = (function() {
    //cxt could be context or false to clean up the cache
	var gecko = function( sel, cxt ) {
		//jquery style
		return new gecko.fn.init( sel, cxt, rGk );
	},
	//no conflict vars
	_gecko = window.gecko,
	_gk = window.gk,
	//gecko parent pointer
	rGk,	
	//userAgent = navigator.userAgent,
	//ready list
	rL,
	//DOMContentLoaded
	DCL,
	//local pointers... faster
	toString = Object.prototype.toString,
	push = Array.prototype.push,
	//fallback function
	fallback = function (name, fallback) {
		var nativeFn = Array.prototype[name];
		return function (obj, iterator, memo) {
		    var fn = obj ? obj[name]: 0;
		    return fn && fn === nativeFn ?
			fn.call(obj, iterator, memo):
			fallback(obj, iterator, memo);
		};
	},
	slice = Array.prototype.slice;
	gecko.fn = gecko.prototype = {
		constructor: gecko,		
		init: function( sel, cxt, rGk ) {
			//no selector gk(), gk('')
			if ( !sel ) {
				return this;
			}
			//dom element
			if ( sel.nodeType ) {
				this.cxt = this[0] = sel;
				this.length = 1;
				return this;
			}
			//gk(function(){}) ready shorthand
			if ( gecko.isF( sel ) ) {
				return rGk.ready( sel );
			}
			//local vars
			var i=-1, nodes = [],c, ce;
			var doc = cxt ? (!cxt.pop ? [cxt] : (typeof cxt === 'object' ? cxt : [document] )): [document];
			//if false, clear cache if not we have context
			if (typeof cxt !== 'object'){
				ce = cxt === false ? cxt : true;
			}
			//check caches
			while(c=doc[++i]){
				if (gecko.cache[c] && gecko.cache[c][sel] && ce ){
					//we got something, return cached
					if (gecko.cache[c][sel].length < 1){
						return undefined;
					}
					if (gecko.cache[c][sel][1]){
						nodes = gecko.cache[c][sel];
					} else {
						nodes = gecko.cache[c][sel];
					}
					if (nodes[1]){
						return gecko.makeArray( nodes, this );
					}else{
						this.length = nodes.length;
						this[0] = nodes[0];
						return this;
					}
				}
			}
			//selector its a gk object
			if ( sel.ctx !== undefined ) {
				this.ctx = sel.ctx;
				return gecko.makeArray( sel, this );
			}
			//start selector
			i= -1;
			while(c=doc[++i]){
				// apply querySelector if exists
				if (c['querySelectorAll']) {
					gecko.sets = c['querySelectorAll'](sel);
				} else if (cxt && cxt[0]) {
					//context its a gk object, get the element only
					return gk(sel, (cxt[0]));
				} else {							
					switch (sel) {
					//return some simple and fast cases
						case 'a':
							gecko.sets = c.links ? c.links : c['getElementsByTagName']('a');
							break;
						case 'body':
							gecko.sets = c.body;
							break;
						case 'form':
							gecko.sets = c.forms ? c.forms : c['getElementsByTagName']('form');
							break;
						case 'head':
							gecko.sets = c['getElementsByTagName']('head')[0];
							break;
						case 'img':
							gecko.sets = c.images ? c.images : c['getElementsByTagName']('img');
							break;
						case 'title':
							gecko.sets = c.title;
							break;
						// generic case
						default:
						// split selectors by comma -- to from initial groups of elements
							var groups = sel.split(/, */),
								groups_length = groups.length - 1,
								j = -1;
							while (j++ < groups_length) {
								// split selectors by space -- to form groups tag-id-class
								var singles = groups[j].split(/ +/),
									singles_length = singles.length - 1,
									i = -1,
									level = 0;
								// clean nodes with DOM root
								gecko.nodes = c;
								while (i++ < singles_length) {
									/* inspired with John's Resig fast replace implementation,
									more details:
									http://ejohn.org/blog/search-and-dont-replace/
									http://webo.in/articles/habrahabr/40-search-not-replace/
									*/
									singles[i].replace(/([^\.#]+)?(?:#([^\.#]+))?(?:\.([^\.#]+))?/, function(a, tag, id, klass) {
									// fast check for ID
										if (tag == '' && klass == '' && !level) {
											gecko.nodes = c[0 ? 'all' : 'getElementById'](id);
										} else {
											// fast check for TAG
											if (klass == '' && id == '' && !level) {
												gecko.nodes = c['getElementsByTagName'](tag);
											// generic sel to get element by TAG, CLASS, ID
											} else {
												// array to merge results
												var newNodes = [],
													// length of root nodes
													nodes_length = gecko.nodes.length,
													J = -1,
													// iterator of return array, equals to its length
													idx = 0;
												// if root is single -- just make it as an array
												if (!nodes_length) {
													gecko.nodes = [gecko.nodes[0]?gecko.nodes[0]:gecko.nodes];
													gecko.nodes.length = 1;
													nodes_length = 1;
												}
												while (J++ < nodes_length) {
													var node = gecko.nodes[J];
													if (node) {
													// find all TAGs
														var childs = node['getElementsByTagName'](tag ? tag : '*'),
															childs_length = childs.length - 1,
															h = -1;
														while (h++ < childs_length) {
															var child = childs[h];
															// check them for ID or CLASS
															if ((!id || (id && child.id == id)) && (!klass || (klass && child.className.match(klass)))) {
															// add to result array
																newNodes.push(child);
															}
														}
													}
												}
												// put selected nodes in local nodes' set
												gecko.nodes = newNodes;
											}
										}
										// dirty iterator to prevent choosing document for deep elements
										level++;
									});
									// remember selected nodes to global set to start new selection
									if (groups_length) {
										var nodes_length = gecko.nodes.length - 1,
											K = -1,
											idx = gecko.sets ? gecko.sets.length : 0;
											gecko.sets = gecko.sets ? gecko.sets : {};
										while (K++ < nodes_length) {
											gecko.sets[idx++] = gecko.nodes[K];
										}
										gecko.sets.length = idx;
										// or just copy nodes to this set
									}
								}
							}												
							gecko.sets = gecko.sets ? gecko.sets : gecko.nodes;
							break;
					}
						
				}
				// save result in cache
				if (!gecko.cache[c]){
					gecko.cache[c] = [];
				}
				if (!gecko.cache[c][sel]){
					gecko.cache[c][sel] = [];
				}
				gecko.cache[c][sel] = gecko.sets;
				// clear all properties to prevent memory leaks
				gecko.sets = gecko.nodes = null;
				// return saved result
				if (gecko.cache[c][sel].length < 1){
					return undefined;
				}else{
					if (gecko.cache[c][sel][1]){
						nodes = gecko.cache[c][sel];
					} else {
						nodes = gecko.cache[c][sel];
					}
				}
			}
			//return nodes with the object			
			if (nodes[1]){
				return gecko.makeArray( nodes, this );
			}else{
				this.length = nodes.length;
				this[0] = nodes[0];
				return this;
			}
		},
		//local each
		each: function( callback, args ) {
			return gecko.each( this, callback, args );
		},
		//version
		gecko: "0.0.1",
		//local length
		length: 0,
		//ready function
		ready: function( fn ) {
			// Attach the listeners
			gecko.bindReady();
			// Add the callback
			rL.add( fn );
			return this;
		},
		// For internal use only.
		// Behaves like an Array's method, not like a gecko method.
		push: push,
		sort: [].sort,
		splice: [].splice
	};
	//prototyping
	gecko.fn.init.prototype = gecko.fn;
	//extend function
	gecko.extend = gecko.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !gecko.isF(target) ) {
			target = {};
		}
		// extend gecko itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}
		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( gecko.isPlainObject(copy) || (copyIsArray = gecko.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && gecko.isArray(src) ? src : [];
						} else {
							clone = src && gecko.isPlainObject(src) ? src : {};
						}
						// Never move original objects, clone them
						target[ name ] = gecko.extend( deep, clone, copy );
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
		// Return the modified object
		return target;
	};
	//extend base object
	gecko.extend({
		//no conflict stuff
		noConflict: function( deep ) {
			if ( window.gk === gecko ) {
				window.gk = _gk;
			}
			if ( deep && window.gecko === gecko ) {
				window.gecko = _gecko;
			}
			return gecko;
		},
		isReady: false,
		readyWait: 1,
		// current set of nodes, to handle single selectors
		nodes : null,
		// current sets of nodes, to handle comma-separated selectors
		sets : null,
		// cache for selected nodes
		cache : {},
		ready: function( wait ) {
			// Either a released hold or an DOMready/load event and not yet ready
			if ( (wait === true && !--gecko.readyWait) || (wait !== true && !gecko.isReady) ) {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( !document.body ) {
					return setTimeout( gecko.ready, 1 );
				}
				// Remember that the DOM is ready
				gecko.isReady = true;
				// If a normal DOM Ready event fired, decrement, and wait if need be
				if ( wait !== true && --gecko.readyWait > 0 ) {
					return;
				}
				// If there are functions bound, to execute
				rL.fireWith( document, [ gecko ] );
				// Trigger any bound ready events
				if ( gecko.fn.trigger ) {
					gecko( document ).trigger( "ready" ).off( "ready" );
				}
			}
		},
		bindReady: function() {
			if ( rL ) {
				return;
			}
			rL = gecko.Callbacks( "once memory" );
			// Catch cases where $(document).ready() is called after the
			// browser event has already occurred.
			if ( document.readyState === "complete" ) {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				return setTimeout( gecko.ready, 1 );
			}
			// Mozilla, Opera and webkit nightlies currently support this event
			if ( document.addEventListener ) {
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", DCL, false );
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", gecko.ready, false );
			// If IE event model is used
			} else if ( document.attachEvent ) {
				// ensure firing before onload,
				// maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", DCL );
				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", gecko.ready );
				// If IE and not a frame
				// continually check to see if the document is ready
				var toplevel = false;
				try {
					toplevel = window.frameElement == null;
				} catch(e) {}
				if ( document.documentElement.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		},
		merge: function( first, second ) {
        //merge objects
			var i = first.length,
				j = 0;
			if ( typeof second.length === "number" ) {
				for ( var l = second.length; j < l; j++ ) {
					first[ i++ ] = second[ j ];
				}
			} else {
				while ( second[j] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}
			first.length = i;
			return first;
		},
		makeArray: function( array, results ) {
        //make object an array
			var ret = results || [];
			if ( array != null ) {
				// The window, strings (and functions) also have 'length'
				// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
				var type = gecko.type( array );
				if ( array.length == null || type === "string" || type === "function" || type === "regexp" || gecko.isWindow( array ) ) {
					push.call( ret, array );
				} else {
					gecko.merge( ret, array );
				}
			}
			return ret;
		},
		isWindow: function( obj ) {
			return obj && typeof obj === "object" && "setInterval" in obj;
		},
		each: function(o, c, a, z) {
			// If not an Array or Object (which would both be object - or function, because Safari's node Collections are!),
			// we cannot iterate
			// first value===true -> run on a copy of the object
			if (o===true) { return gecko.each(gecko.extend(z||c instanceof Array?[]:{},c), a, z); }
			// if we haven't got anything to iterate, return
			if (!o||!o.length&&!o.hasOwnProperty) { return o; }
			// Get length of an Array
			var l=o.length||0, a=a||(l===undefined || gecko.isF(o) || (o instanceof Object && !gecko.isArray(o))), i=0;  
			// We use call to set this to the object we iterate over, thus we can manipulate it within the callback
			// Iterate Array over a counter
			if (a) { 
				if (o.gecko){
					for (;i<l;) { 
						if ( c.call(o[i], i, o[i++]) === false ) {
							break;
						}					
					} 
				}else{
					for (var k in o) { 
						if ( c.call(o[k], k, o[k]) === false ){ break }
					} 
				}
			}
			// Iterate Object over its Instances (hasOwnProperty to avoid the prototype)
			else { 
				for (;i<l;) { 
					if ( c.call(o, i, o[i++]) === false ) {
						break;
					}					
				} 
			}
			return o;
		},
        //is function
		isF: function( obj ) {
			return gecko.type(obj) === "function";
		},
        //is array
		isArray: Array.isArray || function( obj ) {
			return gecko.type(obj) === "array";
		},
        //type of object
		type: function( obj ) {
			if (obj == null) { return String( obj ) };
			return toString.call(obj).match(/^\[object (.*)\]$/)[1].toLowerCase();
		},		
		browser: {},
		/*
			basic yet powerful event system
			t.e([node(s):DOM Node|Array], [eventname:String, optional], [callback:Function, this=node, arguments=[event object], optional], [remove:Boolean=true, optional]);
			// even if no callback is given, the event array is returned
			// if no eventname is given, the whole event object is returned

			// Basic event handler
			t.eh([event:Event Object, this=node])
			// To trigger an event object, use "t.eh.call(node, event)"

			TODO: normalized events (mouseenter/leave)
		*/
		e: function(n, e, c, r) {
			// Handle Node Collections
			if (!n.nodeName && n.length) { return gecko.each(n, function(i, o) { gecko.extend(o, e, c, r); }, true); }
			// Define Events Object, if not present
			if (!n.ev) { n.ev={}; }
			// return full object if event name is omitted
			if (e===undefined) { return n.ev; }
			// create Event array / handler if not present (and fill it with the current event)
			if (!n.ev[e]) { n.ev[e]=[]; if (typeof(n['on'+e])==='function') { n.ev[e].push(n['on'+e]); }; }
			if (n['on'+e]!==gecko.eh) { n['on'+e]=gecko.eh; }
			// add callback if present or delete if r is set
			if (c!==undefined) {
				if (r) { n.ev[e]=gecko.f(n.ev[e], function(gecko, x) { return c===x?u:x; }, true); }
				else { n.ev[e].push(c); }
			}
			return n.ev[e];
		},
		// Event Handler
		eh : function(o) {
			// normalize event;
			var e=(o||window.event), D=document.documentElement, n=this;
			gecko.extend(e, {key: (e.which||e.keyCode||e.charCode), ts: (new Date())*1, mouseX: (e.clientX||0)+(window.pageXOffset||D.scrollLeft||0), mouseY: (e.clientY||0)+(window.pageYOffset||D.scrollTop||0)});
			if (!e.target) { e.target=e.srcElement||document; }
			// iterate over event array
			gecko.each((n.ev||{})[e.type], function(i, c) { 
				if (typeof c==='function') { 
					c.call(n, e); 
				}
			});
		},
		//where is in the array
		w:function(x, a) { 
			var l=a.length; 
			while (l>-1&&a[--l]!==x); 
			return l; 
		},
		//filter
		f:function(o, c, y) {
			if (!o) { return o; }
			// find whether we have an array or an object and a callback function or comparative object
			var y=y||o instanceof Array;
			// if no callback or comparable object is defined, we predefine a unique function
			if (c===undefined) { y=true; var c=function(i, v) { var l=i; while (--l>=0) { if (this[l]===v) { return undefined; }}; return v; } }
			// Instanciate result Object/Array
			var r=(y ? [] : {});
			// Iterate over the original Object, if return value is not undefined, add instance to result
			gecko.each(o, function(k, v) { if ((c.call(o, k, v))!==undefined) {
				if (y) { r.push(v); } else { r[k]=v; }
			}}, y);
			return r;
		},
        //cookies
		ce: function(o) {
			// Get cookie via RegExp
			if (typeof(o)==='string') { (new RegExp('(^|[ ;])'+escape(o)+'=([^;]+)')).exec(document.cookie); return unescape(RegExp.$2); }
			// otherwise Asseble Cookie
			if (o.name && o.value) { document.cookie=escape(o.name)+'='+escape(o.value)+(o.date?('; expires='+(o.date instanceof Date?o.date:new Date(new Date()*1+o.date)).toGMTString()):'')+(o.domain?('; domain='+o.domain):'')+(o.path?'; path='+o.path:'')+(o.extra||'')+';'; }
		},
		//parrallel functionality
		parallel : function (fns, callback) {
			var results = new fns.constructor();
			gecko.eachParallel(fns, function (fn, k, cb) {
			    fn(function (err) {
				var v = Array.prototype.slice.call(arguments, 1);
				results[k] = v.length <= 1 ? v[0]: v;
				cb(err);
			    });
			}, function (err) {
			    (callback || function () {})(err, results);
			});
		},
		//serial functionality
		series : function (fns, callback) {
			var results = new fns.constructor();
			gecko.eachSeries(fns, function (fn, k, cb) {
			    fn(function (err, result) {
				var v = Array.prototype.slice.call(arguments, 1);
				results[k] = v.length <= 1 ? v[0]: v;
				cb(err);
			    });
			}, function (err) {
			    (callback || function () {})(err, results);
			});
		},
        //each in parallel
		eachParallel : function (obj, iterator, callback) {
			var len = obj.length || gecko.keys(obj).length;
			if (!len) {
			    return callback();
			}
			var completed = 0;
			gecko.eachSync(obj, function () {
			    var cb = function (err) {
				if (err) {
				    callback(err);
				    callback = function () {};
				}
				else {
				    if (++completed === len) {
					callback();
				    }
				}
			    };
			    var args = Array.prototype.slice.call(arguments);
			    if (iterator.length) {
				args = args.slice(0, iterator.length - 1);
				args[iterator.length - 1] = cb;
			    }
			    else {
				args.push(cb);
			    }
			    iterator.apply(this, args);
			});
		},
        //each sync
		eachSync : fallback('forEach', function (obj, iterator) {
			var isObj = obj instanceof Object;
			var arr = isObj ? gecko.keys(obj): (obj || []);
			for (var i = 0, len = arr.length; i < len; i++) {
			    var k = isObj ? arr[i]: i;
			    iterator(obj[k], k, obj);
			}
		}),
        //get all keys
		keys : Object.keys || function (obj) {
			var results = [];
			for (var k in obj) {
			    if (obj.hasOwnProperty(k)) {
				results.push(k);
			    }
			}
			return results;
		},
        //each serial
		eachSeries : function (obj, iterator, callback) {
			var keys_list = gecko.keys(obj);
			if (!keys_list.length) {
			    return callback();
			}
			var completed = 0;
			var iterate = function () {
			    var k = keys_list[completed];
			    var args = [obj[k], k, obj].slice(0, iterator.length - 1);
			    args[iterator.length - 1] = function (err) {
				if (err) {
				    callback(err);
				    callback = function () {};
				}
				else {
				    if (++completed === keys_list.length) {
					callback();
				    }
				    else {
					iterate();
				    }
				}
			    };
			    iterator.apply(this, args);
			};
			iterate();
		},
		/*
		JS/JSONp: load additional JavaScript / loads informations via JSONp
		unnamed functions will be temporarily named; name will be deleted for security reasons after 1 s (past timeout)
		t.j([url:String], [callback:String(Function name), Function], [timeout,Integer(ms, optional)]);
		*/
		j: function(u,c,t){
			var f=typeof c==='function';
			// Name function if unnamed
			if (f) { window[(f='fn'+(Math.random()*1E8|0)+(new Date()*1))]=function(c){ return c; }(c); c=f; }
			// Create Script-Element with url and add it to body
			var s=document.createElement('script');
			s.type='text/javascript';
			s.src=u+(c||'');
			document.body.appendChild(s);
			// Timeout
			if (t) { window.setTimeout(function() { document.body.removeChild(s); }, t); }
			// Remove formerly unnamed function's name
			if (f) { window.setTimeout(function() { delete window[c]; }, (t||0)+5000); }
		},
		/*
		ajax:
		t.a({
		    url:[url:String],
		    method:[method:String,(GET|POST), optional],
		    data:[postdata:String|Object, optional],
		    type:[response Object:String(Text, Xml, ...), optional],
		    async:[callback:Function, optional]
		});
		*/
		a: function(o) {
			// create XMLHttpRequest or leave
			var x=(window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"));
			if (!x) { return false; }
			// Open Request
			x.open(o.method||'GET', o.url, !!o.async, o.user, o.pass);
			// Send data
			x.send(o.data?(typeof o.data==='object'?gecko.p(o.data):o.data):null);
			// if not async, return result
			if (!o.async) { return o.type===true?x:x['response'+o.type||'Text']; }
			// if async, set result handler function
			x.onreadystatechange=function(e) { if (x.readyState===4) { o.async.call(x,x['response'+o.type||'Text']); } }
			// return Request object
			return x;
		},		
		/*
		parametrize
		t.p([object:Object], [middle:String, optional], [connector:String, optional], [prefix:String, optional], [suffix:String, optional], [filter1:Function, optional], [filter2:Function, optional]);
		// Defaults (without anything but "o" results in URL parameterisation
		*/
		p: function(o, m, c, p, s, f1, f2) {
			// instance => prefix+filtered key+middle+filtered value+suffix; instance + connector + instance => result
			var r=[];
			t.i(o, function(k, v) { r.push((p===u?'':p)+(f1||escape)(k)+(m===u?'=':m)+(f2||escape)(v)+(s===u?'':s)); });
			return r.join(c===u?'&':c);
		},
        //date format
		df: (function () {
			function strMonth(value) {
				switch (parseInt(value)) {
					case 1:
						return "Jan";
					case 2:
						return "Feb";
					case 3:
						return "Mar";
					case 4:
						return "Apr";
					case 5:
						return "May";
					case 6:
						return "Jun";
					case 7:
						return "Jul";
					case 8:
						return "Aug";
					case 9:
						return "Sep";
					case 10:
						return "Oct";
					case 11:
						return "Nov";
					case 12:
						return "Dec";
					default:
						return value;
				}
			}
			var parseMonth = function (value) {
				switch (value) {
					case "Jan":
						return "01";
					case "Feb":
						return "02";
					case "Mar":
						return "03";
					case "Apr":
						return "04";
					case "May":
						return "05";
					case "Jun":
						return "06";
					case "Jul":
						return "07";
					case "Aug":
						return "08";
					case "Sep":
						return "09";
					case "Oct":
						return "10";
					case "Nov":
						return "11";
					case "Dec":
						return "12";
					default:
						return value;
				}
			};
		
			var parseTime = function (value) {
				var retValue = value, hour,
					minute, second;
				if (retValue.indexOf(".") !== -1) {
					retValue = retValue.substring(0, retValue.indexOf("."));
				}
				var values3 = retValue.split(":");
				if (values3.length === 3) {
					hour = values3[0];
					minute = values3[1];
					second = values3[2];
					return {
						time: retValue,
						hour: hour,
						minute: minute,
						second: second
					};
				} else {
					return {
						time: "",
						hour: "",
						minute: "",
						second: ""
					};
				}
			};
			return {
				date: function (value, format) {
					//value = new java.util.Date()
					//2009-12-18 10:54:50.546
					try {
						var year = null,month = null,
							dayOfMonth = null, time = null;
						var time = null; //json, time, hour, minute, second
						if (typeof value.getFullYear === "function") {
							year = value.getFullYear();
							month = value.getMonth() + 1;
							dayOfMonth = value.getDate();
							time = parseTime(value.toTimeString());
						} else if (value.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}\+\d{2}:\d{2}/) != -1) { // 2009-04-19T16:11:05+02:00
							var values = value.split(/[T\+-]/);
							year = values[0];
							month = values[1];
							dayOfMonth = values[2];
							time = parseTime(values[3].split(".")[0]);
						} else {
							var values = value.split(" ");
							switch (values.length) {
							case 6: //Wed Jan 13 10:43:41 CET 2010
								year = values[5];
								month = parseMonth(values[1]);
								dayOfMonth = values[2];
								time = parseTime(values[3]);
								break;
							case 2: //2009-12-18 10:54:50.546
								var values2 = values[0].split("-");
								year = values2[0];
								month = values2[1];
								dayOfMonth = values2[2];
								time = parseTime(values[1]);
								break;
							case 7: // Tue Mar 01 2011 12:01:42 GMT-0800 (PST)
							case 9: //added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0800 (China Standard Time)
							case 10: //added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0200 (W. Europe Daylight Time)
								year = values[3];
								month = parseMonth(values[1]);
								dayOfMonth = values[2];
								time = parseTime(values[4]);
								break;
							default:
								return value;
						    }
						}
			    
						var pattern = "";
						var retValue = "";
						//Issue 1 - variable scope issue in format.date 
						//Thanks jakemonO
						for (var i = 0; i < format.length; i++) {
							var currentPattern = format.charAt(i);
							pattern += currentPattern;
							switch (pattern) {
								case "dd":
									if(dayOfMonth.length === 1){
										dayOfMonth = '0' + dayOfMonth;
									}
									retValue += dayOfMonth;
									pattern = "";
									break;
								case "MMM":
									retValue += strMonth(month);
									pattern = "";
									break;
								case "MM":
									if (format.charAt(i+1) == "M") {
										break;
									}
									retValue += month;
									pattern = "";
									break;
								case "yyyy":
									retValue += year;
									pattern = "";
									break;
								case "HH":
									retValue += time.hour;
									pattern = "";
									break;
								case "hh":
									//time.hour is "00" as string == is used instead of ===
									retValue += (time.hour == 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
									pattern = "";
									break;
								case "mm":
									retValue += time.minute;
									pattern = "";
									break;
								case "ss":
									//ensure only seconds are added to the return string
									retValue += time.second.substring(0, 2);
									pattern = "";
									break;
									//case "tz":
									//    //parse out the timezone information
									//    retValue += time.second.substring(3, time.second.length);
									//    pattern = "";
									//    break;
								case "a":
									retValue += time.hour >= 12 ? "PM" : "AM";
									pattern = "";
									break;
								case " ":
									retValue += currentPattern;
									pattern = "";
									break;
								case "/":
									retValue += currentPattern;
									pattern = "";
									break;
								case ":":
									retValue += currentPattern;
									pattern = "";
									break;
								default:
									if (pattern.length === 2 && pattern.indexOf("y") !== 0) {
										retValue += pattern.substring(0, 1);
										pattern = pattern.substring(1, 2);
									} else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) {
										pattern = "";
									}
							}
						}
						return retValue;
					} catch (e) {
					    console.log(e);
					    return value;
					}
				}
			};
		} ())
	});
	rGk = gecko(document);
	// Cleanup functions for the document ready method
	if ( document.addEventListener ) {
		DCL = function() {
			document.removeEventListener( "DOMContentLoaded", DCL, false );
			gecko.ready();
		};

	} else if ( document.attachEvent ) {
		DCL = function() {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", DCL );
				gecko.ready();
			}
		};
	}
	// The DOM ready check for Internet Explorer
	function doScrollCheck() {
		if ( gecko.isReady ) {
			return;
		}

		try {
			// If IE is used, use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			document.documentElement.doScroll("left");
		} catch(e) {
			setTimeout( doScrollCheck, 1 );
			return;
		}

		// and execute any waiting functions
		gecko.ready();
	};
	return gecko;
})();
var flagsCache = {};
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}
/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
gecko.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = gecko.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( cxt, args ) {
			args = args || [];
			memory = !flags.memory || [ cxt, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( cxt, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given cxt and arguments
			fireWith: function( cxt, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ cxt, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( cxt, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};
//extending gk object
gecko.fn.extend({
	//filter
	f: function(c) { return gecko(gecko.f(this, c, true)); },
	//look for atributes
	a: function(k, v) {
		if (v===undefined) {
			if (typeof k==='object') { var n=this; gecko.each(k, function(k, v) { n.a(k, v); }); return this; }
			var n=this[0]; return this.length?(this.nf[k]?this.nf[k][0](n):n[k]||null):undefined
		}
		this.each(function(_, n) {gecko(this).nf[k]?gecko(this).nf[k][1](n, v):n[k]=v; },true);
		return this;
	},	
	nf: (function() {
		// Basic filters: rgb2hex, class, value (normalisation for select boxes)
		var rr=/^#([\da-f])([\da-f])([\da-f])/;
		var co=/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i;
		var f={
		'rgb2hex': function(r) { var z; return ((z=rr.exec(r))?['#',z[1],z[1],z[2],z[2],z[3],z[3]].join(''):(z=co.exec(r))?'#'+gecko.each([1,2,3],function(i, v){this[i]=('0'+(z[v]|0).toString(16)).substr(-2);}).join(''):r); },
		'class': [function(n) { return n.className; }, function (n, v) { n.className=v; }],
		'value': [function(n) { return n.options?n.options[n.selectedIndex]:n.value; }, function(n, v) { if (/select/i.test(n.nodeName)) { n.selectedIndex=gecko.w(v, gecko.each(true, n.options, function(i, o) { this[i]=o.value||o.innerHTML; }, true)); }; n.value=v; }]
	       }, d=document.createElement('div'); d.style.display='none';
	       d.innerHTML='<span class="color:red;float:left;opacity:0.5">x</span>';
	       // Feature detection: float vs. stylefloat, opacity vs. alpha filter
	       var s=d.getElementsByTagName('span')[0];
	       if (s.style.opacity!=='0.5') { f.opacity=[function(n) { al.exec(t(n).c('filter')); return (parseFloat(RegExp.$1)/100); },function(n, v) { /* if you want to enforce hasLayout yourself, remove the following statement: */n.style.zoom=n.style.zoom||1;/**/ n.style.filter=(v>0&&v<1?'alpha(opacity='+(v*100)+')':n.style.filter.replace(al,'')+''); } ]; }
	       if (s.style.styleFloat) { f['float']=[function(n) { return t(n).c('styleFloat'); }, function(n, v) { n.style.styleFloat=v; }] }
	       return f;
	})(),
	//html
	h: function(h) { if (h===undefined) { return this.a('innerHTML'); }; this.a('innerHTML', h); return this; },
	//value for forms
	v: function(v) { if (v===undefined) { return (this[0]||{}).value||''; }; if (typeof v==='function') { var r={}, x; this.each(function(i, n) { if (!/^(checkbox|radio|option)$/.test(n.type||'')||n.checked||n.selected) { x=gecko(n).v(); if (n.name&&x) { r[n.name]=(r[n.name]?r[n.name]+',':'')+x; } } }); return v(r); }; this.a('value', v);  return this; },
	// remove nodes
	r: function() { 
		this.each(function(_, v) { 
			if (v) { 
				if (typeof v==='object'){
					v.parentNode.removeChild(v); 
				}
			} 
		}); 
	},
	// get/set CSS Attributes, normalized
	c: function(k, v) {
		if (v===undefined) {
			if (typeof k==='object') { var n=this; gecko.each(k, function(k, v) { n.c(k, v); }); return this; }
			// get current style of first selected node, normalize rgb(...) to #rgb
			var n=this[0]; 
			return this.length?this.nf.rgb2hex(
				this.nf[k]?this.nf[k][0](n):n.style[k]||window.getComputedStyle?(n.ownerDocument.defaultView.getComputedStyle(n,null)||{})[k]:(n.currentStyle||{})[k]||null):undefined;
		}
		this.each(function(_, n) {
			if (n.style) {
				if (gecko(this).nf[k]) {
					gecko(this).nf[k][1](n, v);
				} else {
					n.style[k]=v;
				}
			}
		}, true);
		return this;
	},
	//has/set class
	C: function(c, C) {
		if (typeof c==='string') { return (new RegExp('\\b'+c+'\\b')).test(this[0].className); }
		if (!c) { var r=new RegExp('\\b'+C+'\\b', 'g'); gecko.each(this, function(i,n) { n.className=n.className.replace(r, ''); }, true); }
		else { gecko.each(this, function(i,n) { n.className+=(n.className.length?' ':'')+C; }, true); }
		return this;
	},	
	// Events
	e: function(e, c, r) { return gecko.e(this[0], e, c, r); },
    //make drag and drop
	dd: function(op){ return this.each(function(_, n){ return new gecko.dd.at(gk(this), op) }); },
    //make resizable
	rz: function(op){ return this.each(function(_, n){ return new gecko.rz.at(gk(this), op) }); },
	show: function(op){
		return this.each(function(_, n){ return n.style.display = 'block' });
	}
});
gecko.ev = { mh : false };
/**
 * resizer
 * element
 * options{
 *	box: gecko obj,
 *	minx: int or string
 *	miny: int or string
 *	begin: function,
 *	resizing: function,
 *	end: function
 * }
 *
 **/
gecko.rz = {
	_el : null,
	//_p : null,
	//_op : null,
	at : function(el, op) {
		// callbacks	
		el[0].rB = op?op.begin?op.begin:new Function():new Function();
		el[0].r = op?op.resizing?op.resizing:new Function():new Function();
		el[0].rE = op?op.end?op.end:new Function():new Function();
		//adding elements
		var right = document.createElement('div');
		right.setAttribute('style','cursor: e-resize;width: 7px;right: -5px;top: 0;height: 100%;position: absolute;font-size: 0.1px;z-index: 99999;display: block;');
		right.setAttribute('class','e');
		right.setAttribute('parent',el[0].id);
		var down = document.createElement('div');
		down.setAttribute('style','cursor: s-resize;height: 7px;width: 100%;bottom: -5px;left: 0;position: absolute;font-size: 0.1px;z-index: 99999;display: block;');
		down.setAttribute('class','s');
		down.setAttribute('parent',el[0].id);
		var dr = document.createElement('div');
		dr.setAttribute('style','cursor: se-resize;width: 12px;height: 12px;right: -5px;bottom: -5px;position: absolute;font-size: 0.1px;z-index: 99999;display: block;');
		dr.setAttribute('class','se');
		dr.setAttribute('parent',el[0].id);
		el[0].appendChild(right);
		el[0].appendChild(down);
		el[0].appendChild(dr);
		//adding handlers
		right.onmousedown = gecko.rz._rB;
		down.onmousedown = gecko.rz._rB;
		dr.onmousedown = gecko.rz._rB;
		var rd = {};
		rd.b = op?op.box:null;		
		rd.minx = op?parseInt(op.minx):0;
		rd.miny = op?parseInt(op.miny):0;
		rd.el = el;
		el.a('rd',rd);		
		return el;
	},
	_rB : function(e){		
		if( gecko.ev.mh ) { return };
		var el = gecko.rz._el = this, w, h,
			elg = gk('#'+el.getAttribute('parent')),			
			rd = elg.a('rd'),
			b = rd ? rd.b : null;
		e = e ? e : window.event;
		el.mouseX = e.clientX;
		el.mouseY = e.clientY;
		w = rd.el.c('width');
		h = rd.el.c('height');
		//gecko.rz._op = {};
		rd.gx = e.clientX;
		rd.ow = rd.el[0].offsetWidth;
		rd.gy = e.clientY;
		rd.oh = rd.el[0].offsetHeight;
		rd.el[0].rB(rd.el[0], w, h);
		if (b){
			rd.minx = rd.minx ? rd.minx : b[0].offsetLeft || 0;
			rd.miny = rd.miny ? rd.miny : b[0].offsetTop || 0;
			rd.maxx = b[0].offsetWidth || 0;
			rd.maxy = b[0].offsetHeight || 0;
		}
		document.onmousemove = gecko.rz._r;
		document.onmouseup = gecko.rz._rE;
		e.preventDefault();
		gecko.ev.mh = true;
		return true;
	},
	_r : function(e){
		var el = gecko.rz._el,
			elg = gk('#'+el.getAttribute('parent')),
			rd = elg.a('rd'),
			b = rd ? rd.b : null,
			w, h, minx=rd.minx,miny=rd.miny,
			p = rd ? rd.el : null;
		if (el.className.indexOf("e") != -1){
			if (b){
				w = Math.max(minx, Math.min(rd.ow + e.clientX - rd.gx + b[0].offsetLeft, rd.maxx - rd.el[0].offsetLeft + b[0].offsetLeft));
			}else{
				w = Math.max(minx, rd.ow + e.clientX - rd.gx);
			}			
			p.c('width', w+'px');
		}
		if (el.className.indexOf("s") != -1){
			if (b){				
				var top = isNaN(parseInt(p.c('top'))) ? 0 : parseInt(p.c('top'));
				h = Math.max(miny, Math.min(rd.oh + e.clientY - rd.gy, b[0].offsetTop - 12 - top));//Math.min(rd.oh + e.clientY - rd.gy, rd.maxy - rd.el[0].offsetTop));
			}else{
				h = Math.max(miny, rd.oh + e.clientY - rd.gy);
			}
			//console.log(h);
			p.c('height', h+'px');
		}
		el.mouseX = e.clientX + minx;
		el.mouseY = e.clientY + miny;
		p[0].r(p[0], w, h);
		return false;
	},
	_rE : function(){
		var el = gecko.rz._el,
			elg = gk('#'+el.getAttribute('parent')),
			rd = elg.a('rd'),
			p = rd.el,
			w = parseInt(p.c('width')),
			h = parseInt(p.c('height'));
		p[0].rE(p[0], w, h);
		document.onmousemove = null;
		document.onmouseup = null;
		gecko.rz._el = null;
		gecko.ev.mh = false;
	}
}
/**
 * drag and drop
 * element
 * options{
 *	box: gecko object,
 *	handler: gecko object,
 *	begin: function,
 *	dragging: function,
 *	end: function
 * }
 **/
gecko.dd = {
    // private property.
    _el : null,
    //_op : null,
    // public method. Attach drag handler to an element.
    at : function(el, op) {
        // callbacks	
        el[0].dB = op?op.begin?op.begin:new Function():new Function();
        el[0].d = op?op.dragging?op.dragging:new Function():new Function();
        el[0].dE = op?op.end?op.end:new Function():new Function();
	if (op !== undefined){
		var dd = {};		
		dd.b = op.box ? op.box : null;
		dd.h = op.handler ? op.handler : null;		
		if (op.handler){
			//dd.h.a('parent', el[0].id);
			dd.h[0].setAttribute('parent',el[0].id);
			op.handler[0].onmousedown = gecko.dd._dB;
			dd.p = el[0];
		}else{
			el[0].onmousedown = gecko.dd._dB;
		}
		el.a('dd', dd);
	}else{
		el[0].onmousedown = gecko.dd._dB;
	}
	//el[0].style.position="relative";
        return el;
    },

    // private method. Begin drag process.
    _dB : function(e) {
	if( gecko.ev.mh ) { return };	
        var el = gecko.dd._el = this,
		elg = gk('#'+el.getAttribute('parent')),
		dd = elg.a('dd'),
		x, y, p,
		b = dd ? dd.b:null,
		h = dd ? dd.h : null;
	if (h){
		p = dd ? dd.p : null;
		el = p;
	}
        if (isNaN(parseInt(el.style.left))) { x = 0; el.style.left='0px' } else { parseInt(el.style.left) }
        if (isNaN(parseInt(el.style.top))) { y = 0; el.style.top='0px' } else { parseInt(el.style.top) }
        e = e ? e : window.event;
        el.mouseX = e.clientX;
        el.mouseY = e.clientY;
	el.dB(el, x, y);
        document.onmousemove = gecko.dd._d;
        document.onmouseup = gecko.dd._dE;
	if (b){
		dd.minx = b[0].offsetLeft || 0;
		dd.miny = b[0].offsetTop || 0;
		dd.maxx = b[0].offsetWidth || 0;
		dd.maxy = b[0].offsetHeight || 0;
	}
        e.preventDefault();		
	gecko.ev.mh = true;
	return true;
    },

    // private method. Drag (move) element.
    _d : function(e) {
	var el = gecko.dd._el,
		elg = gk('#'+el.getAttribute('parent')),
		dd = elg.a('dd'),
		minx = 0, miny=0, maxx, maxy,
		left, top, p,
		x = parseInt(el.style.left),
		y = parseInt(el.style.top),
		b = dd ? dd.b ?  dd : null : null,
		h = dd ? dd.h : null;	
	if (h){		
		p = dd ? dd.p : null;
		el = p;
		x = parseInt(el.style.left);
		y = parseInt(el.style.top);
		p.d(el, x, y);
	}else{
		el.d(el, x, y);
	}
	if (b){
		minx = b.minx;
		miny = b.miny;
		maxx = b.maxx;
		maxy = b.maxy;
		if (elg.c('position') === 'relative'){ miny = 0; }
		left = Math.max(minx?minx-30:0, Math.min(x + ((e.clientX + (minx)) - el.mouseX), maxx - el.offsetWidth));
		top = Math.max(miny?miny-30:0, Math.min(y + ((e.clientY + (miny)) - el.mouseY), maxy - el.offsetHeight));
	}else{		
		left = x + (e.clientX - el.mouseX);
		top = y + (e.clientY - el.mouseY);
	}
	el.style.left = left + 'px';
	el.style.top = top + 'px';
	el.mouseX = e.clientX + minx;
        el.mouseY = e.clientY + miny;        
        return false;
    },

    // private method. Stop drag process.
    _dE : function() {
        var el = gecko.dd._el,
		elg = gk('#'+el.getAttribute('parent')),
		dd = elg.a('dd'),
		x = parseInt(el.style.left),
		y = parseInt(el.style.top),
		h = dd ? dd.h : null;
	h ? dd.p.dE(el, x, y) : el.dE(el, x, y);
        document.onmousemove = null;
        document.onmouseup = null;
        gecko.dd._el = null;
	gecko.ev.mh = false;
    }

};
// Expose gecko to the global object
window.gecko = window.gk = gecko;

// Expose gecko as an AMD module, but only for AMD loaders that
if ( typeof define === "function" && define.amd && define.amd.gecko ) {
	define( "gecko", [], function () { return gecko; } );
}
})( window );