/* schema
        {
            txt:"By all means, move at a glacial pace. You know how that thrills me.",
            lines: [
                "Miranda Priestly",
                "<a href='https://www.imdb.com/title/tt0458352'>The Devil Wears Prada</a>",
                "2006",
                "Played by Meryl Streep"
            ],
            ee: "this is easter egg html"
        },
*/
export const getRandomPuzzle = () => {
    const puzzles = [
        {
            id: 0,
            v: 1,
            l: 'en',
            text:"By all means, move at a glacial pace. You know how that thrills me.",
            givens: [1, 9],
            caps: [],
            attribution: [
                "Miranda Priestly",
                "<a href='https://www.youtube.com/watch?v=GMTU-LUESgA'>The Devil Wears Prada</a> (2006)",
                "Played by <a href='https://en.wikipedia.org/wiki/Meryl_Streep_on_screen_and_stage'>Meryl Streep</a>",
            ]
        },
        "The way to get started is quit talking and begin doing.",
        "Don't judge each day by the harvest you reap but by the seeds that you plant.",
        "When you reach the end of your rope, tie a knot in it and hang on.",
        "By all means, move at a glacial pace. You know how that thrills me.",
        "Keep your friends close, but your enemies closer.",
        "Things fall apart; the centre cannot hold.",
        "I think that I shall never see a poem lovely as a tree.",
        "We few, we happy few, we band of brothers.",
        "My mother sacrificed her dreams so I could dream.",
        "Every time I travel I meet myself a little more.",
        "And when wind and winter harden, all the loveless land, it will whisper of the garden, you will understand.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "It is during our darkest moments that we must focus to see the light.",
        "In the end, it's not the years in your life that count. It's the life in your years.",
        "Life is either a daring adventure or nothing at all.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "Success is not final; failure is not fatal: It is the courage to continue that counts.",
        "I find that the harder I work, the more luck I seem to have.",
        "When you're curious, you find lots of interesting things to do.",
        "Plunge boldly into the thick of life, and seize it where you will, it is always interesting.",
        "The most interesting information comes from children, for they tell all they know and then stop.",
        "One never notices what has been done; one can only see what remains to be done.",
        "It's not that I'm afraid to die. I just don't want to be there when it happens.",
        "It is possible to commit no errors and still lose. That is not a weakness. That is life.",
        "I am pleased to see that we have differences. May we together become greater than the sum of both of us.",
        "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true.",
    ]

    // const p = puzzles[Math.floor(Math.random() * puzzles.length)]
    const p = puzzles[0]
    for(let i = 0; i < p.attribution.length; i++) {
        p.attribution[i] = p.attribution[i].replace('<a href=', "<a target='_blank' href=")
    }
    return p
}
