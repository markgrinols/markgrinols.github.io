let rawPuzzle = {}
let wordList = []
let likelyProperNounMap = {}
let original_word_list = []
let attribution = []

const load = async () => {
    const url = "puzzleData.json"
    const puzzles = await fetchJson(url)

    // rawPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
    rawPuzzle = puzzles[0]
    updateHyperlinks()
    generateWordList({ shuffle: true })
    attribution = rawPuzzle.attribution
}

function isPunctuation(str) {
    const t = /[.;:?,]/
    return t.test(str)
}

const generateWordList = (options) => {
    const puncRegex = /[.;:?,]/g
    const txtWithSpaces = rawPuzzle.text.replace(puncRegex, " $&")
    wordList = txtWithSpaces.split(' ')

    original_word_list = [...wordList].map( (x) => x.toLowerCase())

    // save capitalization info
    // todo: this will simply be baked into the puzzle data
    for(let i = 1; i < wordList.length; i++) {
        // if word is capitlized, but is not first letter or after a period, assume it's propername.
        // Not perfect, breaks on "God is dead."
        const word = wordList[i]
        likelyProperNounMap[word.toLowerCase()] = (word[0] === word[0].toUpperCase() && wordList[i - 1] != '.')
    }

    // this will ultimately be removed - puzzles will not be random at runtime
    if (options?.shuffle === true) {
        // shuffle words, leaving punctuation in place
        const nonPunctuationIndexes = Array.from(Array(wordList.length).keys()).filter(w => !isPunctuation(wordList[w]))
        const shuffledIndexes = [...nonPunctuationIndexes]
        shuffledIndexes.sort((a, b) => 0.5 - Math.random());
        const shuffledWords = []
        for (let i = 0; i < wordList.length; i++) {
            const isPunc = !nonPunctuationIndexes.includes(i)
            const newWord = isPunc ?  wordList[i] : wordList[shuffledIndexes.pop()]
            shuffledWords.push( newWord )
        }
        wordList = shuffledWords
    }
}

const updateHyperlinks = () => {
    for (let i = 0; i < rawPuzzle.attribution.length; i++) {
        rawPuzzle.attribution[i] = rawPuzzle.attribution[i].replace('<a href=', "<a target='_blank' href=")
    }
}

const fetchJson = async (url) => {
    try {
        const data = await fetch(url)
        const json = await data.json()
        return json
    } catch (error) {
        console.log(error)
    }
};

const isInCorrectLocation = (word, index) => {
    return  original_word_list[index] === word
}

const requiresCapitalization = (txt) => {
    return likelyProperNounMap[txt]
}


export { load, wordList, attribution, isPunctuation, isInCorrectLocation, requiresCapitalization }