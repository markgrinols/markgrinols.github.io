const getRandomPuzzle = async () => {

    const url = "puzzleData.json"
    const puzzles = await fetchJson(url)

    // const p = puzzles[Math.floor(Math.random() * puzzles.length)]
    let puz = puzzles[0]
    puz = updateHyperlinks(puz)
    return puz
}

const updateHyperlinks = (p) => {
    for(let i = 0; i < p.attribution.length; i++) {
        p.attribution[i] = p.attribution[i].replace('<a href=', "<a target='_blank' href=")
    }

    return p
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

export { getRandomPuzzle }