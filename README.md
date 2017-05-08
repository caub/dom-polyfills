## DOM polyfills

- fetch
- URLSearchParams
- element#classList
- element#matches
- element#closest

Must be included after es6-shim (it uses Promises and Map)

usage:

```js
if (!Array.hasOwnProperty('from'))
	addScript('https://unpkg.com/es6-shim@latest/es6-shim.min.js'); // or use your own server
if (!window.hasOwnProperty('URLSearchParams'))
	addScript('https://unpkg.com/dom-polyfills@latest/polyfills.js');


function addScript(src) {
	var script = document.createElement('script');
	script.src = src;
	document.body.appendChild(script);
}
```


todo tests