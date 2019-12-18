/**
 * @author Hong-Phuc Bui
 * initial version 27.12.2018
 * */
const TYPE_CLASS_PREFIX = "dom-output-";
const MAXIMUM_OBJECT_REPRESENT_LENGTH = 58;


export class DomOutput {

	/**
	 * @constructor
	 *
	 * @param {string} outputElementId the element ID of an element in DOM, in which
	 * output objects are in written
	 */
	constructor(outputElementId) {
		this.output = document.getElementById(outputElementId);
		this._style = "";
		this.outputElementId = outputElementId;
	}

	/**
	 * set style output, default is an empty string.
	 * @param {string} cssStyle a String represents a syntactical valid CSS-Style, for example
	 * `color: red; font-size:12px`
	 * */
	set style(cssStyle) {
		this._style = cssStyle;
	}

	get style() {
		return this._style;
	}

	/**
	 * @return {string} content of the terminal as plain text
	 * */
	get text() {
		return this.output.innerText;
	}
	
	/**
	 * print each element of argv in an <code> Tag. Elements are converted to String
	 * by its natural String representation.
	 *
	 * @param {...Object} argv objects to be printed
	 *
	 * */
	print(...argv) {
		this._lazyInit( "print", "_print", ...argv);
	}

	/**
	 * like {@link print} but with an line break after the last element is printed.
	 * @param {...Object} argv objects to be printed
	 * */
	printl(...argv) {
		this._lazyInit("printl", "_printl", ...argv);
	}
	
	/**
	 * convert an HTML string to DOM-Element and appends it as the last element of output.
	 * @param {string} html HTML String
	 * */
	printh(html) {
		this._lazyInit("printh", "_printh", html);
	}
	
	/**
	 * convert each element of argv to HTML String
	 *
	 * @return {DocumentFragment}
	 * */
	_html(...argv) {
		let html = document.createDocumentFragment();
		argv
			.map(a => representTopLevelObject(a))
			.forEach(represent => {
				html.appendChild( represent );
			});
		return html;
	}

	/**
	 * clear all output
	 * */
	clear() {
		try {
			this.output.innerText = "";
		}catch (e) { // TypeError
			console.log("output is not initialized.");
		}
	}
	
	_print(...argv) {
		let toHTML = this._html(...argv);
		this.output.appendChild(toHTML);
	}
	
	_printl(...argv) {
		let toHTML = this._html(...argv);
		toHTML.appendChild(document.createElement("br"));
		this.output.appendChild(toHTML);
	}
	
	_printh(html) {
		this.output.insertAdjacentHTML('beforeend', html);
	}
	
	_lazyInit(sourceFn, targetFn, ...argv) {
		if (!this.output) {
			this.output = document.getElementById(this.outputElementId);
			if (this.output) {
				this[targetFn](...argv);
				this[sourceFn] = this[targetFn];
			} else {
				console.warn("Cannot initialize output with #" + this.outputElementId);
				console.log(...argv);
			}
		} else {
			this[targetFn](...argv);
			this[sourceFn] = this[targetFn];
		}
	}
}


function representTopLevelObject(arg) {
	if  (typeof arg === "string") {
		return span("string",arg);
	}
	else {
		return represent(arg, MAXIMUM_OBJECT_REPRESENT_LENGTH);
	}
}

function span(type, text) {
	let sp = document.createElement("code");
	sp.className = TYPE_CLASS_PREFIX + type;
	sp.appendChild(document.createTextNode(text));
	return sp;
}

function eltSize(elt) {
	return elt.textContent.length;
}

function represent(val, maximumSize) {
	if (typeof val === "boolean") return span("bool", String(val));
	if ((typeof val === "number") || (typeof  val === "bigint") ) return span("number", val.toString());
	if (typeof val === "string") return span("string-2", JSON.stringify(val));
	if (typeof val === "symbol") return span("symbol", String(val));
	if (val == null) return span("null", String(val));
	if (Array.isArray(val)) return representArray(val, maximumSize);
	else return representObj(val, maximumSize);
}

function representArray(val, maximumSize) {
	return representIterable(val, maximumSize);
}

function representObj(val, maximumSize) {
	if (val instanceof Set) {
		return representSet(val, maximumSize);
	}
	if (val instanceof Map) {
		return representMap(val, maximumSize);
	}	
	let string = (typeof val.toString == "function") && val.toString();
	if (!string || /^\[object .*\]$/.test(string)) {
		return representSimpleObj(val, maximumSize);
	}
	let m = string.match(/^\s*(function[^(]*\([^)]*\))/) ;
	if (val.call && m ) {
		return span("function", m[1] + "{…}");
	}

	let elt = span("etc", string);
	elt.addEventListener("click", () => expandObj(elt, "obj", val));
	return elt;
}

function representSet(val, maximumSize) {
	let wrap = document.createElement("span");
	wrap.appendChild(document.createTextNode("Set("));
	wrap.appendChild( representIterable([...val], maximumSize) );
	wrap.appendChild(document.createTextNode(")"));
	return wrap;
}

function representMap(val, maximumSize) {
	let wrap = document.createElement("span");
	wrap.appendChild(document.createTextNode("Map("));
	wrap.appendChild( representIterable([...val], maximumSize, '[', ']') );
	wrap.appendChild(document.createTextNode(")"));
	return wrap;
}

function representIterable(val, maximumSize, beginDelimiter='[', endDelimiter=']' ) {
	maximumSize -= 2;
	let wrap = document.createElement("span");
	wrap.appendChild(document.createTextNode( beginDelimiter ));
	for (let i = 0; i < val.length; ++i) {
		if (i) {
			wrap.appendChild(document.createTextNode(", "));
			maximumSize -= 2;
		}
		let next = maximumSize > 0 && represent(val[i], maximumSize);
		let nextSize = next ? eltSize(next) : 0;
		if (maximumSize - nextSize <= 0) {
			wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "array", val));
			break;
		}
		maximumSize -= nextSize;
		wrap.appendChild(next);
	}
	wrap.appendChild(document.createTextNode(endDelimiter ));
	return wrap;
}


function constructorName(obj) {
	if (!obj.constructor) return null;
	let m = String(obj.constructor).match(/^function\s*([^\s(]+)/);
	if (m && m[1] !== "Object") return m[1];
}


function representSimpleObj(val, space) {
	space -= 2;
	let wrap = document.createElement("span");
	let name = constructorName(val);
	if (name) {
		space -= name.length;
		wrap.appendChild(document.createTextNode(name))
	}
	wrap.appendChild(document.createTextNode("{"));
	try {
		let first = true;		
		/*for (let prop of Object.getOwnPropertyNames(val) ){*/
		for (let prop in val ){
			if (first) {
				first = false;
			} else {
				space -= 2;
				wrap.appendChild(document.createTextNode(", "));
			}
			let next = space > 0 && represent(val[prop], space);
			let nextSize = next ? prop.length + 2 + eltSize(next) : 0;
			if (space - nextSize <= 0) {
				wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "obj", val));
				break;
			}
			space -= nextSize;
			wrap.appendChild(span("prop", prop + ": "));
			wrap.appendChild(next)
		}
	} catch (e) {
		wrap.appendChild(document.createTextNode("…"))
	}
	wrap.appendChild(document.createTextNode("}"));
	return wrap;
}

function expandObj(node, type, val) {
	let wrap = document.createElement("span");
	let opening = type === "array" ? "[" : "{", 
		cname;
	if (opening === "{" && (cname = constructorName(val))) {
		opening = cname + " {";
	}
	wrap.appendChild(document.createTextNode(opening));
	let block = wrap.appendChild(document.createElement("div"));
	block.className = "sandbox-output-etc-block";
	let table = block.appendChild(document.createElement("table"));

	function addProp(name) {
		let row = table.appendChild(document.createElement("tr"));
		row.appendChild(document.createElement("td")).appendChild(span("prop", name + ":"));
		row.appendChild(document.createElement("td")).appendChild(represent(val[name], 40));
	}

	if (type === "array") {
		for (let i = 0; i < val.length; ++i) addProp(i)
	} else {
		for (let prop in val ) {
			addProp(prop);
		}		
	}
	wrap.appendChild(document.createTextNode(type === "array" ? "]" : "}"));
	node.parentNode.replaceChild(wrap, node)
}
