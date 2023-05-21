import {describe, it, expect} from 'vitest'

import {playRounds} from '../simulation/simulate'

import {
  TitForTat,
  AlwaysCooperate,
  AlwaysDefect,
  Fixed,
  GrimTrigger,
  Forgive,
} from '../simulation/strategies'

import {Strategy} from '../@types/Strategy'

type Move = boolean
type S = Strategy<Move>

const c = (g: Move[]) => g.map((s) => (s ? 'C' : 'D')).join('')

const s = (g: string): S =>
  Fixed(g.split('').map((s) => (s === 'C' ? true : false)))

const play = (s1: S, s2: S, rounds = 1) => c(playRounds(s1, s2, rounds))

describe('Prisoner Dilemma Strategies', () => {
  it(`should always mirror opponent's previous move`, () => {
    expect(play(s('CDC'), TitForTat, 3)).toBe('CCDDCC')
    expect(play(s('DDD'), TitForTat, 3)).toBe('DDDDDD')
    expect(play(s('DCD'), TitForTat, 3)).toBe('DDCCDD')
    expect(play(AlwaysCooperate, TitForTat, 3)).toBe('CCCCCC')
    expect(play(TitForTat, AlwaysDefect, 3)).toBe('CDDDDD')
    expect(play(AlwaysDefect, TitForTat, 3)).toBe('DDDDDD')
  })
  it(`should always defect once the opponent defects`, () => {
    expect(play(s('DCC'), GrimTrigger, 3)).toBe('DDCDCD')
    expect(play(s('CCDC'), GrimTrigger, 4)).toBe('CCCCDDCD')
  })

  it(`should forgive defection after 2 rounds`, () => {
    expect(play(s('CDCC'), Forgive(2), 5)).toBe('CCDDCDCDCC')
  })

  it(`should not forgive detection before 2 rounds`, () => {
    expect(play(s('CDDC'), Forgive(2), 5)).toBe('CCDDDDCDCD')
    expect(play(s('CDDC'), Forgive(5), 5)).toBe('CCDDDDCDCC')
  })
})
