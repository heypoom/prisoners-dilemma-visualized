import {Strategy} from '../@types/Strategy'

type Move = boolean
type S = Strategy<Move>

export const createGame = (s1: S, s2: S) => (moves: Move[]) => {
  const strategy = moves.length % 2 === 0 ? s1 : s2

  return [...moves, strategy(moves)]
}

export function playRounds(s1: S, s2: S, rounds = 1): Move[] {
  const play = createGame(s1, s2)
  let game: Move[] = []

  for (let round = 0; round < rounds * 2; round++) {
    game = play(game)
  }

  return game
}
