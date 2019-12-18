# Caesar
Code javascript pour déchiffrer le code césar automatiquement
# Fichiers:
- `DomIO.js`, `dfhi.js`, `dfhi.css`, `dom-output.css` : Librairies données par le professeur **à ajouter pour que le programme fonctionne!**
- `ueb04.html`, `ueb04.css` : Affichage / Programme principal
- `cipherLegal.js` : librairie d'opérations de base de chiffrage / déchiffrage
    - `String offset(offset, text, chars)` : fonction qui permet d'encrypter / décrypter le code césar à l'aide d'un offset donné (`offset`), du texte en lui même (`text`) et de l'alphabet donné (`char`)
- `cipherCrack.js` : librairie contenant le code qui effectue le "crack" du texte chiffré
    - `String caesar(cipher, chars, language)` : fonction qui "cracke" du code césar en utilisant la méthode probabiliste ou appelle la fonction de bruteforce si le résultat n'est pas satisfaisant et renvoie le résultat (ainsi que l'offset)
    -`String caesarBruteForce(cipher, char, words)` : fonction qui décrypte le code césar par force brute et renvoie le résultat le plus satisfaisant (ainsi que l'offset)
    - `int check(output, wordset)` : fonction qui renvoie le nombre de mots de l'ensemble de mots donnés dans le texte (score) pour déterminer la probabilité d'un résultat d'être le texte en clair
- `textAnalysis.js` : librairie permettant d'analyser des chaines de caractères
    - `Object countChars(text)` : renvoie la fréquence de chaque charactère dans le texte donné (`text`) passé en minuscule et redonne le résultat sous forme de dictionnaire avec comme clé le caractère et comme valeur associée son nombre d'apparitions
    - `char mostCommonLetter(text)` : renvoie le caractère le plus fréquent dans le texte donné (`text`) sans prendre en compte les espaces en utilisant la fonction `countChars()`.
