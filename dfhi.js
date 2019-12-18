/*
 * @author Hong-Phuc Bui
 * initial version 27.12.2018
 *
 * At a glance, this file provides a mini platform to test javascript code as a style of traditional
 * console based programming language. It creates an input field for argument vectors, a div
 * for standard output, and an Object DomOut for printing something to the standard output div.
 *
 * This file can be linked into an HTML File with the tag <script>. To use
 * this file, one must provide a javascript function with signature
 *
 * <pre>
 * function main(... argv)
 * {
 *   // .... code here
 * }
 * </pre>
 *
 * This function is called when the `Rerun` button is click. Value in input field is split in
 * an array of string and passed to main.
 *
 *
 *
 * */
import {DomOutput} from "./DomIO.js";
// "private" variable, only for this file
const OUTPUT_ID = 'text-output';


// Create Output Terminal
export let terminal = new DomOutput(OUTPUT_ID);


/**
 *  call the function main, if the function main throws any error, print it in the
 *  Terminal and log it into the Browser console.
 * 
 */
function runMain() {
	try {
		if ( typeof main === "function") {
			let argvElement = document.getElementById("argv");
			if (argvElement) {
				if (argvElement.files) {
					if (argvElement.files.length > 0) {
						main(...argvElement.files);
					}
				} else {
					let argumentsList = argvElement.value.trim();
					if (argumentsList.length > 0) {
						main(...argumentsList.split(/\s+/));
					}else {
						main();
					}
				}
			}else {
				main();
			}
		} else {
			terminal.printl("Function main(...argv) is not defined!");
		}
	}catch (ex) {
		console.error(ex);
		terminal.printl(ex);
	}
}


function init() {
	try {
		//Empty every output in console
		document.getElementById(OUTPUT_ID).innerHTML = "";
		//Student can the test the code in main() by giving something in <input id="run"/>
		document.getElementById("run").addEventListener("click", runMain);
	} catch (e) {
		console.error(e);
	}
}

document.addEventListener("DOMContentLoaded", init);