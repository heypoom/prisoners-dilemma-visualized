import {useCallback, useEffect, useState} from 'react'
import {chunk} from 'lodash'

import {
  AlwaysDefect,
  Forgive,
  TitForTat,
  AlwaysCooperate,
  GrimTrigger,
  Random,
} from './simulation/strategies'

import {Strategy} from './@types/Strategy'

import './App.css'

type Move = boolean
type S = Strategy<Move>

const strategyMap = {
  Cooperate: AlwaysCooperate,
  Defect: AlwaysDefect,
  TitForTat,
  ForgiveTwo: Forgive(2),
  GrimTrigger,
  Random,
} as const satisfies Record<string, S>

type StrategyKey = keyof typeof strategyMap

const strategyKeys = Object.keys(strategyMap) as StrategyKey[]
const defaultStrategies: StrategyKey[] = ['TitForTat', 'Defect']

const Button = ({
  children,
  className = '',
  onClick,
}: {
  children?: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <button
    className={`rounded-md ${className} text-2xl px-2 py-1 cursor-pointer`}
    onClick={onClick}
  >
    {children}
  </button>
)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const adjustScroll = () =>
  window.scrollTo({behavior: 'smooth', top: document.body.scrollHeight})

function App() {
  const [game, setGame] = useState<boolean[]>([])
  const [strategies, setStrategies] = useState(defaultStrategies)

  const step = () =>
    setGame((game) => {
      adjustScroll()

      const strategyKey = strategies[game.length % 2]
      const strategy = strategyMap[strategyKey]
      return [...game, strategy(game)]
    })

  async function playN(rounds: number) {
    for (let i = 0; i < rounds * 2; i++) {
      await delay(12)
      step()
    }

    adjustScroll()
  }

  function handleStrategyChange(strategy: string, player: number) {
    strategies[player] = strategy as StrategyKey
    setStrategies([...strategies])
  }

  const coop = useCallback(() => setGame([...game, true]), [game])
  const defect = useCallback(() => setGame([...game, false]), [game])
  const reset = () => setGame([])

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'c') coop()
      if (e.key === 'd') defect()
      if (e.key === 's') step()
      if (!Number.isNaN(parseInt(e.key))) playN(parseInt(e.key))
      if (e.key === 'r') reset()
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [coop, defect])

  return (
    <div className="flex items-center justify-content min-h-[100vh] bg-black">
      <div className="flex flex-col w-full justify-center items-center gap-y-4">
        <h1 className="text-3xl font-light pb-3">Prisoner's Dilemma</h1>

        {['A', 'B'].map((player, i) => (
          <div className="flex gap-x-2" key={player}>
            <div>Player {player}:</div>

            <select
              value={strategies[i]}
              onChange={(e) => handleStrategyChange(e.target.value, i)}
            >
              {strategyKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="py-2 max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-x-6 gap-y-3">
            {chunk(game, 2).map((chunk, i) => (
              <div key={i} className="grid grid-cols-2 gap-x-3">
                {chunk.map((move, j) => (
                  <div
                    key={j}
                    className={`
												flex
												text-center rounded-none w-10 h-10
												${move ? 'bg-blue-500' : 'bg-red-500'}
											`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-[120px]" />

        <div className="flex flex-col items-center justify-center fixed bottom-0 gap-y-1 py-5">
          <div className="flex gap-x-4 h-14 mb-4">
            <Button
              onClick={coop}
              className="w-14 bg-blue-500 focus:bg-blue-400 hover:bg-blue-600"
            />
            <Button
              onClick={defect}
              className="w-14 bg-red-500 focus:bg-red-400 hover:bg-red-600"
            />
          </div>

          <div className="flex gap-x-4">
            <Button
              onClick={step}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Step
            </Button>
            <Button onClick={reset} className="bg-gray-500 hover:bg-gray-600">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
