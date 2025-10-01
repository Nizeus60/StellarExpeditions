import React from 'react'
import { Users, TrendingUp, Zap } from 'lucide-react'
import { useGame } from '../context/GameContext'

const SquadManager = () => {
  const { gameState, upgradeSquad } = useGame()

  const getUpgradeCost = (level: number) => {
    return Math.floor(500 * Math.pow(1.15, level))
  }

  const getSquadBonus = (level: number) => {
    if (level <= 10) return level * 2
    if (level <= 25) return 20 + (level - 10) * 3
    return 20 + 45 + (level - 25) * 5
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Squad Management</h2>
        <p className="text-[#F5F5F5]/70">Upgrade your squads to improve mission efficiency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameState.squads.map((squad) => {
          const upgradeCost = getUpgradeCost(squad.level)
          const currentBonus = getSquadBonus(squad.level)
          const nextBonus = getSquadBonus(squad.level + 1)
          const canAfford = gameState.player.credits >= upgradeCost

          return (
            <div
              key={squad.id}
              className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30 hover:border-[#6A5ACD] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[#00CED1]" />
                    <span className="text-sm font-semibold text-[#00CED1] uppercase">
                      {squad.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#F5F5F5]">{squad.name}</h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    squad.isAvailable
                      ? 'bg-[#32CD32]/20 text-[#32CD32]'
                      : 'bg-[#DC143C]/20 text-[#DC143C]'
                  }`}
                >
                  {squad.isAvailable ? 'Available' : 'On Mission'}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-[#0F1A32] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#F5F5F5]/70">Level</span>
                    <span className="text-2xl font-bold text-[#6A5ACD]">{squad.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F5]/70">Efficiency Bonus</span>
                    <span className="text-lg font-bold text-[#00CED1]">+{currentBonus}%</span>
                  </div>
                </div>

                <div className="bg-[#0F1A32]/50 rounded-lg p-4 border border-[#6A5ACD]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#32CD32]" />
                    <span className="text-sm font-semibold text-[#F5F5F5]">Next Level</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#F5F5F5]/70">Bonus</span>
                    <span className="text-[#32CD32] font-semibold">+{nextBonus}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-[#F5F5F5]/70">Cost</span>
                    <span className="text-[#FFD700] font-semibold">{upgradeCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => upgradeSquad(squad.id)}
                disabled={!canAfford || !squad.isAvailable}
                className="w-full px-6 py-3 bg-[#6A5ACD] text-white rounded-lg font-semibold hover:bg-[#6A5ACD]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Upgrade Squad
              </button>

              {!canAfford && squad.isAvailable && (
                <p className="text-center text-sm text-[#DC143C] mt-2">Insufficient credits</p>
              )}
              {!squad.isAvailable && (
                <p className="text-center text-sm text-[#F5F5F5]/50 mt-2">Squad is on mission</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30">
        <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">Squad Upgrade Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#0F1A32] rounded-lg p-4">
            <div className="text-[#00CED1] font-bold mb-2">Levels 1-10</div>
            <div className="text-[#F5F5F5]/70">+2% efficiency per level</div>
          </div>
          <div className="bg-[#0F1A32] rounded-lg p-4">
            <div className="text-[#6A5ACD] font-bold mb-2">Levels 11-25</div>
            <div className="text-[#F5F5F5]/70">+3% efficiency per level</div>
          </div>
          <div className="bg-[#0F1A32] rounded-lg p-4">
            <div className="text-[#FFD700] font-bold mb-2">Levels 26-50</div>
            <div className="text-[#F5F5F5]/70">+5% efficiency per level</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SquadManager
