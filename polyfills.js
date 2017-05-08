
if (!window.hasOwnProperty('Promise')) {
	window.fetch = function fetch(url, opts) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = Boolean(opts.credentials);
			xhr.open(opts.method || 'GET', url);
			for (var k in opts.headers)
				xhr.setRequestHeader(k, opts.headers[k]);
			xhr.onload = function(e) { 
				resolve({
					status: e.target.status,
					headers: {get: function(name) {return e.target.getResponseHeader(name)}},
					arrayBuffer: function(){ return Promise.resolve(e.target.response)},
					blob: function(){ return Promise.resolve(new Blob([e.target.response], {type: e.target.getResponseHeader('Content-Type')}))},
					text: function(){ return Promise.resolve(e.target.responseText)},
					json: function(){ return Promise.resolve(JSON.parse(e.target.responseText))}
				});
			};
			xhr.onerror = reject;
			xhr.send(opts.body);
		});
	};
}


if (!window.hasOwnProperty('URLSearchParams')) {

	window.URLSearchParams = function(url){
		var map = new Map(); // could use Object.create(null) but it's added after es6-shims
		if (url){
			url.replace(/^\?/,'').split('&').forEach(function(pair){
				var p = pair.split('=');
				var key = p[0], val = p[1];
				try { // decode if needed
					key = decodeURIComponent(key);
				} catch(e) {}
				try {
					val = decodeURIComponent(val);
				} catch(e) {}
				map.set(key, (map.get(key) || []).concat(val));
			});
		}
		this.get = function(key){
			return this.getAll(key)[0];
		};
		this.set = function(key, value){
			map.set(key, [value]);
		};
		this.has = function(key){
			return map.has(key);
		};
		this.delete = function(key) {
			map.delete(key);
		};

		this.getAll = function(key){
			return map.get(key) || [];
		};
		this.append = function(k, v) {
			map.set(k, (map.get(k) || []).concat(v));
		};
		this.toString = function(){
			return Array.from(map, function(p) { 
				return p[1].map(function(v) {
					return encodeURIComponent(p[0])+'='+encodeURIComponent(v)
				}).join('&')
			}).join('&');
		};
		this.forEach = function(cb) {
			map.forEach(cb);
		}
	};
	Object.defineProperty(URL.prototype, 'searchParams', {
		get: function() { 
			return new URLSearchParams(this.search);
		},
		enumerable: false
	});
}

if (!Element.prototype.classList) {
	function ClassList(element) {
		this.element = element;
		this.remove = function(c) {
			var cls = this.element.className.split(/ +/);
			this.element.className = cls.filter(function(x){return x!==c}).join(' ');
		};
		this.add = function(c) {
			this.element.className += ' '+c;
		};
		this.contains = function(c) {
			return this.element.className.split(/ +/).find(function(x){return x==c});
		};
		this.toggle = function(c, force) {
			if (force===undefined) force = !this.contains(c);
			if (force) {
				this.add(c);
			} else {
				this.remove(c);
			}
			return force;
		};
	};
	Object.defineProperty(Element.prototype, 'classList', {
		get: function() { 
			return new ClassList(this);
		},
		enumerable: false
	});
}

if (!Element.prototype.matches) {
	Element.prototype.matches = 
		Element.prototype.matchesSelector || 
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector || 
		Element.prototype.oMatchesSelector || 
		Element.prototype.webkitMatchesSelector ||
		function(s) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;            
		};
}
if (!Element.prototype.closest) {
	Element.prototype.closest = function(s){
		var p = this;
		while(p&&!p.matches(s)) p = p.parentNode; 
		return p;
	}
}
