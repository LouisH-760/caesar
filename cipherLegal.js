
export function offset(offset, text, chars){ // Encryption, Decryption
    let acc = "";
    let tempChar = "";
    for(let i = 0; i < text.length; i++)
    {
        if(chars.indexOf(text.charAt(i)) == -1)
        {
            acc += text.charAt(i);
        }
        else
        {
            tempChar = chars[(((chars.indexOf(text.charAt(i)) + offset) % chars.length) + chars.length) % chars.length];
            acc += tempChar;
        }
    }
    return acc;
}
