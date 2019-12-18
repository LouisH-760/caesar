/*
 * ueb04.js
 *
 */

import {terminal} from "./dfhi.js";
import {offset} from "./cipherLegal.js";
import {caesar} from "./cypherCrack.js";

let chars = [
    'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y',
    'Z', 'Ä', 'Ö', 'Ü',
// lowercase
    'a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y',
    'z', 'ä', 'ö', 'ü', 'ß',
// digits
    '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9',
// Punctuations
    ',', ';', ':', '.', '?',
    '!', "'", '-', '"', '/',
    '\\', '(', ')', '[', ']',
    '*', '+', '~', '$', '%',
    '=', '&', '{', '}', '–'
]; // dictionary for competition.

window.main = function(){
    let cipher = document.getElementById("cipher").value;
    cipher = cipher.replace(/(\r\n|\n|\r)/gm, "");
    terminal.printl(caesar(cipher, chars, "de"));
};




