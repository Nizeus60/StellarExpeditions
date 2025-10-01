import React from 'react'
import { Map, Lock, CheckCircle, AlertTriangle } from 'lucide-react'
import { useGame } from '../context/GameContext'

const GalaxyMap = () => {
  const { gameState, unlockZone } = useGame()

  const getDangerIcon = (danger: string) => {
    switch (danger) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-[#32CD32]" />
      case 'risky':
        return <AlertTriangle className="w-5 h-5 text-[#FFD700]" />
      case 'dangerous':
        return <AlertTriangle className="w-5 h-5 text-[#FF8C00]" />
      case 'deadly':
        return <AlertTriangle className="w-5 h-5 text-[#DC143C]" />
      default:
        return null
    }
  }

  const getDangerColor = (danger: string) => {
    switch (danger) {
      case 'safe':
        return '#32CD32'
      case 'risky':
        return '#FFD700'
      case 'dangerous':
        return '#FF8C00'
      case 'deadly':
        return '#DC143C'
      default:
        return '#6A5ACD'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Galaxy Map</h2>
        <p className="text-[#F5F5F5]/70">
          Explore different zones and unlock new territories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gameState.zones.map((zone) => {
          const canUnlock =
            !zone.unlocked && gameState.player.reputation >= zone.unlockCost
          const missionsInZone = gameState.missions.filter(
            (m) => m.zone === zone.name
          ).length

          return (
            <div
              key={zone.id}
              className={`bg-[#1a2744] rounded-xl p-6 border-2 relative overflow-hidden ${
                zone.unlocked
                  ? 'border-[#6A5ACD]'
                  : 'border-[#6A5ACD]/30 opacity-75'
              }`}
            >
              {!zone.unlocked && (
                <div className="absolute top-4 right-4">
                  <div className="bg-[#DC143C] rounded-full p-2">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              {zone.unlocked && (
                <div className="absolute top-4 right-4">
                  <div className="bg-[#32CD32] rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <Map className="w-6 h-6 text-[#00CED1]" />
                <div>
                  <h3 className="text-2xl font-bold text-[#F5F5F5]">
                    {zone.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getDangerIcon(zone.danger)}
                    <span
                      className="text-sm font-semibold uppercase"
                      style={{ color: getDangerColor(zone.danger) }}
                    >
                      {zone.danger}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#F5F5F5]/70 mb-6">{zone.description}</p>

              <div className="space-y-3">
                <div className="bg-[#0F1A32] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F5]/70">Available Missions</span>
                    <span className="text-xl font-bold text-[#00CED1]">
                      {missionsInZone}
                    </span>
                  </div>
                </div>

                {!zone.unlocked && (
                  <div className="bg-[#0F1A32]/50 rounded-lg p-4 border border-[#6A5ACD]/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#F5F5F5]/70">Unlock Cost</span>
                      <span className="text-xl font-bold text-[#FFD700]">
                        {zone.unlockCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-[#F5F5F5]/50">
                      Reputation required
                    </div>
                  </div>
                )}
              </div>

              {!zone.unlocked && (
                <button
                  onClick={() => unlockZone(zone.id)}
                  disabled={!canUnlock}
                  className="w-full mt-4 px-6 py-3 bg-[#6A5ACD] text-white rounded-lg font-semibold hover:bg-[#6A5ACD]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Unlock Zone
                </button>
              )}

              {!zone.unlocked && !canUnlock && (
                <p className="text-center text-sm text-[#DC143C] mt-2">
                  Need {(zone.unlockCost - gameState.player.reputation).toLocaleString()} more reputation
                </p>
              )}

              {zone.unlocked && (
                <div className="mt-4 px-6 py-3 bg-[#32CD32]/20 text-[#32CD32] rounded-lg font-semibold text-center">
                  Zone Unlocked
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30">
        <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">
          Danger Level Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0F1A32] rounded-lg p-4 border-2 border-[#32CD32]/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#32CD32]" />
              <span className="font-bold text-[#32CD32]">Safe</span>
            </div>
            <p className="text-sm text-[#F5F5F5]/70">
              Ideal for beginners and testing new squads
            </p>
          </div>

          <div className="bg-[#0F1A32] rounded-lg p-4 border-2 border-[#FFD700]/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#FFD700]" />
              <span className="font-bold text-[#FFD700]">Risky</span>
            </div>
            <p className="text-sm text-[#F5F5F5]/70">
              Moderate challenge with better rewards
            </p>
          </div>

          <div className="bg-[#0F1A32] rounded-lg p-4 border-2 border-[#FF8C00]/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#FF8C00]" />
              <span className="font-bold text-[#FF8C00]">Dangerous</span>
            </div>
            <p className="text-sm text-[#F5F5F5]/70">
              High difficulty, significant rewards
            </p>
          </div>

          <div className="bg-[#0F1A32] rounded-lg p-4 border-2 border-[#DC143C]/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#DC143C]" />
              <span className="font-bold text-[#DC143C]">Deadly</span>
            </div>
            <p className="text-sm text-[#F5F5F5]/70">
              Maximum challenge, legendary rewards
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalaxyMap
