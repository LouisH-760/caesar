import {mostCommonLetter} from "./textAnalysis.js";
import {offset} from "./cipherLegal.js";

let textRefEnglish = "Keith recently came back from a trip to Chicago, Illinois. This midwestern metropolis is found along the shore of Lake Michigan. During his visit, Keith spent a lot of time exploring the city to visit important landmarks and monuments.Keith loves baseball, and he made sure to take a visit to Wrigley Field. Not only did he take a tour of this spectacular stadium, but he also got to watch a Chicago Cubs game. In the stadium, Keith and the other fans cheered for the Cubs. Keith was happy that the Cubs won with a score of 5-4.Chicago has many historic places to visit. Keith found the Chicago Water Tower impressive as it is one of the few remaining landmarks to have survived the Great Chicago Fire of 1871. Keith also took a walk through Jackson Park, a great outdoor space that hosted the World’s Fair of 1892. The park is great for a leisurely stroll, and it still features some of the original architecture and replicas of monuments that were featured in the World’s Fair.During the last part of his visit, Keith managed to climb the stairs inside of the Willis Tower, a 110-story skyscraper. Despite the challenge of climbing the many flights of stairs, Keith felt that reaching the top was worth the effort. From the rooftop, Keith received a gorgeous view of the city’s skyline with Lake Michigan in the background. ";
let mostWordsEnglish = ["the", "and", "that", "have", "this", "that", "for", "not", "with", "you", "but", "his", "from", "they", "is", "in", "at", "to", "of"]; // most common english words, no two-letter words to prevent coincidences from influencing the results too much


let textRefGerman = "Anna und Olaf wollen heute das Haus putzen. Sie teilen sich dabei die Arbeit. Anna kümmert sich um Bad und Küche und Olaf putzt das Schlafzimmer.  Zuerst erledigt Anna den Abwasch. Danach trocknet sie das saubere Geschirr ab. Anschließend muss der Boden gefegt werden. Das geht am besten mit einem Besen.  Im Bad gibt es noch mehr Arbeit für Anna. Sie muss mit einem Schwamm die Badewanne putzen und den Boden sauber wischen.  Olaf saugt währenddessen das Schlafzimmer mit dem Staubsauger. Anschließend beginnt er, mit einem Tuch Staub zu wischen. Nachdem er das getan hat, muss er noch die Betten frisch beziehen.  Dann ist das Haus wieder schön sauber.";
let mostWordsGerman = ["das", "ist", "du", "ich", "nicht", "die", "es", "und", "sie", "der", "was", "wir", "zu", "ein", "er", "in", "sie", "mir", "mit"];
export function caesar(cipher, chars, language)
{
    let textRef, commonWords;
    if(language == "en")
    {
        textRef = textRefEnglish;
        commonWords = mostWordsEnglish;
    }
    else
    {
        textRef = textRefGerman;
        commonWords = mostWordsGerman;
    }
    let refLetter = chars.indexOf(mostCommonLetter(textRef));
    let cipLetter = chars.indexOf(mostCommonLetter(cipher));
    let charOffset = cipLetter - refLetter;
    let result = offset(-charOffset, cipher, chars);
    if(check(result, commonWords) > 1)
    {
        return "offset: " + charOffset + " : " + result;
    }
    else
    {
        console.log("using bruteforce! (Score: " + check(result, commonWords) + ")");
        return caesarBruteForce(cipher, chars, commonWords);
    }
}

function caesarBruteForce(cipher, chars, words)
{
    let tries = [];
    for(let i = 0; i < chars.length; i++)
    {
        let result = offset(i, cipher, chars);
        tries.push({"result":result, "score":check(result, words)});
    }
    let bestScore = -1;
    let bestDecipher = "";
    let offsetNum;
    for(let i = 0; i < tries.length; i++)
    {
        if(tries[i]["score"] >= bestScore)
        {
            bestScore = tries[i]["score"];
            bestDecipher = tries[i]["result"];
            offsetNum = i;
        }
    }
    return "offset: " + offsetNum + " : " + bestDecipher;
}

function check(output, wordset)
{
    let score = 0;
    let words = output.toLowerCase().split(" ");
    for(let word of words)
    {
        score += (wordset.indexOf(word) != -1) ? 1 : 0;
    }
    return score;
}