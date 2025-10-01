import React from 'react'
import { Trophy, TrendingUp, Star, AlertCircle } from 'lucide-react'
import { useGame } from '../context/GameContext'

const PrestigePanel = () => {
  const { gameState, performPrestige } = useGame()

  const canPrestige = gameState.player.reputation >= 1000000

  const currentMultiplier = gameState.player.prestigeMultiplier
  const nextPrestigeCount = gameState.player.prestigeCount + 1
  const nextMultiplier =
    1 +
    0.05 * nextPrestigeCount +
    0.02 * nextPrestigeCount * nextPrestigeCount

  const prestigeBonus = ((nextMultiplier - currentMultiplier) / currentMultiplier) * 100

  const keptArtifacts = gameState.artifacts.filter(
    (a) => a.rarity === 'legendary' || a.rarity === 'mythic'
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Prestige System</h2>
        <p className="text-[#F5F5F5]/70">
          Reset your progress for permanent bonuses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-[#FFD700]" />
            <div>
              <div className="text-sm text-[#F5F5F5]/70">Prestige Count</div>
              <div className="text-3xl font-bold text-[#F5F5F5]">
                {gameState.player.prestigeCount}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#00CED1]" />
            <div>
              <div className="text-sm text-[#F5F5F5]/70">Current Multiplier</div>
              <div className="text-3xl font-bold text-[#00CED1]">
                {currentMultiplier.toFixed(2)}x
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#32CD32]/30">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-[#32CD32]" />
            <div>
              <div className="text-sm text-[#F5F5F5]/70">Next Multiplier</div>
              <div className="text-3xl font-bold text-[#32CD32]">
                {nextMultiplier.toFixed(2)}x
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#6A5ACD]/20 to-[#00CED1]/20 rounded-xl p-8 border-2 border-[#6A5ACD]">
        <div className="flex items-start gap-4 mb-6">
          <Trophy className="w-12 h-12 text-[#FFD700] flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-[#F5F5F5] mb-2">
              Prestige Available
            </h3>
            <p className="text-[#F5F5F5]/70">
              Reset your progress to gain a permanent {prestigeBonus.toFixed(1)}% multiplier on all
              rewards
            </p>
          </div>
        </div>

        <div className="bg-[#0F1A32] rounded-lg p-6 mb-6">
          <h4 className="text-lg font-bold text-[#F5F5F5] mb-4">Requirements</h4>
          <div className="flex items-center justify-between">
            <span className="text-[#F5F5F5]/70">Reputation Needed</span>
            <span
              className={`text-xl font-bold ${
                canPrestige ? 'text-[#32CD32]' : 'text-[#DC143C]'
              }`}
            >
              {gameState.player.reputation.toLocaleString()} / 1,000,000
            </span>
          </div>
          {!canPrestige && (
            <div className="mt-4 text-center text-sm text-[#DC143C]">
              Need {(1000000 - gameState.player.reputation).toLocaleString()} more reputation
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-[#32CD32]/10 border-2 border-[#32CD32]/30 rounded-lg p-4">
            <h4 className="text-lg font-bold text-[#32CD32] mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" />
              What You Keep
            </h4>
            <ul className="space-y-2 text-[#F5F5F5]/90">
              <li className="flex items-start gap-2">
                <span className="text-[#32CD32]">•</span>
                <span>All Legendary and Mythic artifacts ({keptArtifacts.length})</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#32CD32]">•</span>
                <span>Permanent +{prestigeBonus.toFixed(1)}% multiplier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#32CD32]">•</span>
                <span>All prestige levels and bonuses</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#DC143C]/10 border-2 border-[#DC143C]/30 rounded-lg p-4">
            <h4 className="text-lg font-bold text-[#DC143C] mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              What Gets Reset
            </h4>
            <ul className="space-y-2 text-[#F5F5F5]/90">
              <li className="flex items-start gap-2">
                <span className="text-[#DC143C]">•</span>
                <span>All Credits and Reputation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#DC143C]">•</span>
                <span>Squad levels (back to level 1)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#DC143C]">•</span>
                <span>Unlocked zones (except starter zone)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#DC143C]">•</span>
                <span>Common, Rare, and Epic artifacts</span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={performPrestige}
          disabled={!canPrestige}
          className="w-full px-8 py-4 bg-gradient-to-r from-[#6A5ACD] to-[#00CED1] text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <Trophy className="w-6 h-6" />
          Perform Prestige
        </button>
      </div>

      <div className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30">
        <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">
          Prestige Multiplier Formula
        </h3>
        <div className="bg-[#0F1A32] rounded-lg p-6">
          <div className="text-[#00CED1] font-mono text-lg mb-4">
            Multiplier = 1 + (0.05 × N) + (0.02 × N²)
          </div>
          <div className="text-sm text-[#F5F5F5]/70 mb-4">
            Where N = number of prestiges
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-[#1a2744] rounded p-3">
              <div className="text-[#F5F5F5]/70">1 Prestige</div>
              <div className="text-[#00CED1] font-bold">1.07x</div>
            </div>
            <div className="bg-[#1a2744] rounded p-3">
              <div className="text-[#F5F5F5]/70">3 Prestiges</div>
              <div className="text-[#00CED1] font-bold">1.33x</div>
            </div>
            <div className="bg-[#1a2744] rounded p-3">
              <div className="text-[#F5F5F5]/70">5 Prestiges</div>
              <div className="text-[#00CED1] font-bold">1.75x</div>
            </div>
            <div className="bg-[#1a2744] rounded p-3">
              <div className="text-[#F5F5F5]/70">10 Prestiges</div>
              <div className="text-[#00CED1] font-bold">3.50x</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrestigePanel
