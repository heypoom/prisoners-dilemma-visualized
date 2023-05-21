import {Strategy} from '../@types/Strategy'

type S = Strategy<boolean>

function opponentMoves(turns: boolean[]) {
  const agent = turns.length % 2 === 0

  return turns.filter((_, i) => (agent ? i % 2 !== 0 : i % 2 === 0))
}

export const AlwaysCooperate: S = () => true
export const AlwaysDefect: S = () => false

export const Random: S = () => Math.random() > 0.5

/**
 * Tit-for-tat involves starting with cooperation, and then
 *   mimicking the other player's previous move in subsequent rounds.
 * If the other player cooperates, the player cooperates as well.
 * If the other player defects, the player defects in response.
 * This strategy aims to encourage cooperation by reciprocating the opponent's behavior.
 */
export const TitForTat: S = (turns) => turns[turns.length - 1] ?? true

/**
 * The Grim Trigger strategy starts with cooperation
 * but switches to defection permanently
 * if the opponent ever defects.
 * It essentially punishes the opponent for
 * a single act of defection and continues to defect
 * in all subsequent rounds.
 * This strategy seeks to discourage the opponent
 * from defecting by enforcing a severe consequence.
 */
export const GrimTrigger: S = (turns) => !opponentMoves(turns).some((t) => !t)

/**
 *
 * The forgiving strategy is similar to Tit-for-Tat,
 * but it forgives the opponent's defection after
 * a certain number of rounds and reverts to cooperation.
 * This strategy allows for occasional lapses in cooperation
 * and aims to rebuild trust over time.
 */
export const Forgive =
  (round: number): S =>
  (turns) => {
    const moves = opponentMoves(turns)
    const latest = moves.slice(moves.length - round - 1, moves.length)

    return !latest.some((t) => !t)
  }

export const Fixed = (turns: boolean[]): S => {
  let s = 0

  return () => {
    const val = turns[s]
    s = s > turns.length - 2 ? 0 : s + 1

    return val
  }
}
