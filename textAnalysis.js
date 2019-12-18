
export function countChars(text)
{
    let chars = {};
    for(let i = 0; i < text.length; i++)
    {
        let char = text.charAt(i).toLowerCase();
        if(chars[char] == null)
        {
            chars[char] = 1;
        }
        else
        {
            chars[char] += 1;
        }
    }
    return chars;
}

export function mostCommonLetter(text)
{
    let chars = countChars(text);
    let bestScore = -1;
    let bestChar = "";
    for(let [key, value] of Object.entries(chars))
    {
        if(key != " " && value > bestScore)
        {
            bestChar = key;
            bestScore = value;
        }
    }
    return bestChar;
}
