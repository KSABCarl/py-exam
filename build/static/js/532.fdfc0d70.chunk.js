/*! For license information please see 532.fdfc0d70.chunk.js.LICENSE.txt */
(()=>{"use strict";const e=Symbol("Comlink.proxy"),t=Symbol("Comlink.endpoint"),n=Symbol("Comlink.releaseProxy"),r=Symbol("Comlink.finalizer"),o=Symbol("Comlink.thrown"),i=e=>"object"===typeof e&&null!==e||"function"===typeof e,a=new Map([["proxy",{canHandle:t=>i(t)&&t[e],serialize(e){const{port1:t,port2:n}=new MessageChannel;return s(e,t),[n,[n]]},deserialize(e){return e.start(),f(e,[],t);var t}}],["throw",{canHandle:e=>i(e)&&o in e,serialize(e){let t,{value:n}=e;return t=n instanceof Error?{isError:!0,value:{message:n.message,name:n.name,stack:n.stack}}:{isError:!1,value:n},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function s(t){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:globalThis,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:["*"];n.addEventListener("message",(function a(l){if(!l||!l.data)return;if(!function(e,t){for(const n of e){if(t===n||"*"===n)return!0;if(n instanceof RegExp&&n.test(t))return!0}return!1}(i,l.origin))return void console.warn("Invalid origin '".concat(l.origin,"' for comlink proxy"));const{id:u,type:p,path:d}=Object.assign({path:[]},l.data),f=(l.data.argumentList||[]).map(m);let y;try{const n=d.slice(0,-1).reduce(((e,t)=>e[t]),t),r=d.reduce(((e,t)=>e[t]),t);switch(p){case"GET":y=r;break;case"SET":n[d.slice(-1)[0]]=m(l.data.value),y=!0;break;case"APPLY":y=r.apply(n,f);break;case"CONSTRUCT":y=function(t){return Object.assign(t,{[e]:!0})}(new r(...f));break;case"ENDPOINT":{const{port1:e,port2:n}=new MessageChannel;s(t,n),y=function(e,t){return h.set(e,t),e}(e,[e])}break;case"RELEASE":y=void 0;break;default:return}}catch(v){y={value:v,[o]:0}}Promise.resolve(y).catch((e=>({value:e,[o]:0}))).then((e=>{const[o,i]=g(e);n.postMessage(Object.assign(Object.assign({},o),{id:u}),i),"RELEASE"===p&&(n.removeEventListener("message",a),c(n),r in t&&"function"===typeof t[r]&&t[r]())})).catch((e=>{const[t,r]=g({value:new TypeError("Unserializable return value"),[o]:0});n.postMessage(Object.assign(Object.assign({},t),{id:u}),r)}))})),n.start&&n.start()}function c(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function l(e){if(e)throw new Error("Proxy has been released and is not useable")}function u(e){return v(e,{type:"RELEASE"}).then((()=>{c(e)}))}const p=new WeakMap,d="FinalizationRegistry"in globalThis&&new FinalizationRegistry((e=>{const t=(p.get(e)||0)-1;p.set(e,t),0===t&&u(e)}));function f(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],o=!1;const i=new Proxy(arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},{get(t,a){if(l(o),a===n)return()=>{!function(e){d&&d.unregister(e)}(i),u(e),o=!0};if("then"===a){if(0===r.length)return{then:()=>i};const t=v(e,{type:"GET",path:r.map((e=>e.toString()))}).then(m);return t.then.bind(t)}return f(e,[...r,a])},set(t,n,i){l(o);const[a,s]=g(i);return v(e,{type:"SET",path:[...r,n].map((e=>e.toString())),value:a},s).then(m)},apply(n,i,a){l(o);const s=r[r.length-1];if(s===t)return v(e,{type:"ENDPOINT"}).then(m);if("bind"===s)return f(e,r.slice(0,-1));const[c,u]=y(a);return v(e,{type:"APPLY",path:r.map((e=>e.toString())),argumentList:c},u).then(m)},construct(t,n){l(o);const[i,a]=y(n);return v(e,{type:"CONSTRUCT",path:r.map((e=>e.toString())),argumentList:i},a).then(m)}});return function(e,t){const n=(p.get(t)||0)+1;p.set(t,n),d&&d.register(e,t,e)}(i,e),i}function y(e){const t=e.map(g);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const h=new WeakMap;function g(e){for(const[t,n]of a)if(n.canHandle(e)){const[r,o]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},o]}return[{type:"RAW",value:e},h.get(e)||[]]}function m(e){switch(e.type){case"HANDLER":return a.get(e.name).deserialize(e.value);case"RAW":return e.value}}function v(e,t,n){return new Promise((r=>{const o=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===o&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),n)}))}var b=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(t){i(t)}}function s(e){try{c(r.throw(e))}catch(t){i(t)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))},w=function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"===typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(s){return function(c){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,s[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&s[0]?r.return:s[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,s[1])).done)return o;switch(r=0,o&&(s=[2&s[0],o.value]),s[0]){case 0:case 1:o=s;break;case 4:return a.label++,{value:s[1],done:!1};case 5:a.label++,r=s[1],s=[0];continue;case 7:s=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===s[0]||2===s[0])){a=0;continue}if(3===s[0]&&(!o||s[1]>o[0]&&s[1]<o[3])){a.label=s[1];break}if(6===s[0]&&a.label<o[1]){a.label=o[1],o=s;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(s);break}o[2]&&a.ops.pop(),a.trys.pop();continue}s=t.call(e,a)}catch(c){s=[6,c],r=0}finally{n=o=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,c])}}};importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"),"localhost"!==self.location.hostname&&(console.log=function(){},console.error=function(){});var E={getInput:function(e,t){var n=new XMLHttpRequest;return n.open("GET","/react-py-get-input/?id=".concat(e,"&prompt=").concat(t),!1),n.send(null),n.responseText}};s({init:function(e,t,n){return b(this,void 0,void 0,(function(){var r,o,i,a;return w(this,(function(s){switch(s.label){case 0:return r=self,[4,self.loadPyodide({stdout:e})];case 1:return r.pyodide=s.sent(),[4,self.pyodide.loadPackage(["pyodide-http"])];case 2:return s.sent(),n[0].length>0?[4,self.pyodide.loadPackage(n[0])]:[3,4];case 3:s.sent(),s.label=4;case 4:return n[1].length>0?[4,self.pyodide.loadPackage(["micropip"])]:[3,7];case 5:return s.sent(),[4,self.pyodide.pyimport("micropip").install(n[1])];case 6:s.sent(),s.label=7;case 7:return o=self.crypto.randomUUID(),i=self.pyodide.version,self.pyodide.registerJsModule("react_py",E),"\nimport pyodide_http\npyodide_http.patch_all()\n",[4,self.pyodide.runPythonAsync("\nimport pyodide_http\npyodide_http.patch_all()\n")];case 8:return s.sent(),a='\nimport sys, builtins\nimport react_py\n__prompt_str__ = ""\ndef get_input(prompt=""):\n    global __prompt_str__\n    __prompt_str__ = prompt\n    print(prompt, end="")\n    s = react_py.getInput("'.concat(o,'", prompt)\n    print(s)\n    return s\nbuiltins.input = get_input\nsys.stdin.readline = lambda: react_py.getInput("').concat(o,'", __prompt_str__)\n'),[4,self.pyodide.runPythonAsync(a)];case 9:return s.sent(),t({id:o,version:i}),[2]}}))}))},run:function(e){return b(this,void 0,void 0,(function(){return w(this,(function(t){switch(t.label){case 0:return[4,self.pyodide.runPythonAsync(e)];case 1:return t.sent(),[2]}}))}))},readFile:function(e){return self.pyodide.FS.readFile(e,{encoding:"utf8"})},writeFile:function(e,t){return self.pyodide.FS.writeFile(e,t,{encoding:"utf8"})},mkdir:function(e){self.pyodide.FS.mkdir(e)},rmdir:function(e){self.pyodide.FS.rmdir(e)}})})();
//# sourceMappingURL=532.fdfc0d70.chunk.js.map