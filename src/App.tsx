import {useCallback, useEffect, useState} from 'react'

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

  const play = () =>
    setGame((game) => {
      adjustScroll()

      const strategyKey = strategies[game.length % 2]
      const strategy = strategyMap[strategyKey]
      return [...game, strategy(game)]
    })

  async function play5() {
    for (let i = 0; i < 10; i++) {
      await delay(12)
      play()
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
      if (e.key === 'p') play()
      if (e.key === '5') play5()
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

        <div className="max-w-sm mx-auto py-4 mb-[140px]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div className="text-center font-bold">A</div>
            <div className="text-center font-bold">B</div>

            {game.map((move, i) => (
              <div
                key={i}
                className={`
									flex items-center justify-center
									w-7 h-7 text-center rounded-sm
									${move ? 'bg-blue-500' : 'bg-red-500'}
								`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center fixed bottom-0 gap-y-3">
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
              onClick={play}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Play 1
            </Button>
            <Button
              onClick={play5}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Play 5
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
