import React, { useState } from 'react'
import { Package, Star, Check, X } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { getRarityColor } from '../utils/gameData'

const ArtifactInventory = () => {
  const { gameState, equipArtifact } = useGame()
  const [filter, setFilter] = useState<string>('all')

  const rarityLimits = {
    mythic: 3,
    legendary: 6,
    epic: 12,
    rare: Infinity,
    common: Infinity,
  }

  const getEquippedCount = (rarity: string) => {
    return gameState.artifacts.filter((a) => a.equipped && a.rarity === rarity).length
  }

  const filteredArtifacts =
    filter === 'all'
      ? gameState.artifacts
      : gameState.artifacts.filter((a) => a.rarity === filter)

  const equippedArtifacts = filteredArtifacts.filter((a) => a.equipped)
  const unequippedArtifacts = filteredArtifacts.filter((a) => !a.equipped)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Artifact Collection</h2>
          <p className="text-[#F5F5F5]/70">
            Equip artifacts to gain powerful bonuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-[#00CED1]" />
          <span className="text-2xl font-bold text-[#F5F5F5]">
            {gameState.artifacts.length}
          </span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'mythic', 'legendary', 'epic', 'rare', 'common'].map((rarity) => (
          <button
            key={rarity}
            onClick={() => setFilter(rarity)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
              filter === rarity
                ? 'bg-[#6A5ACD] text-white'
                : 'bg-[#1a2744] text-[#F5F5F5]/70 hover:text-[#F5F5F5]'
            }`}
            style={
              filter === rarity && rarity !== 'all'
                ? { backgroundColor: getRarityColor(rarity) }
                : {}
            }
          >
            {rarity}
          </button>
        ))}
      </div>

      <div className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30">
        <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">Equipment Slots</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(rarityLimits).map(([rarity, limit]) => {
            const equipped = getEquippedCount(rarity)
            const displayLimit = limit === Infinity ? '∞' : limit
            return (
              <div
                key={rarity}
                className="bg-[#0F1A32] rounded-lg p-4 border-2"
                style={{ borderColor: getRarityColor(rarity) + '40' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star
                    className="w-4 h-4"
                    style={{ color: getRarityColor(rarity) }}
                  />
                  <span
                    className="text-sm font-bold capitalize"
                    style={{ color: getRarityColor(rarity) }}
                  >
                    {rarity}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#F5F5F5]">
                  {equipped}/{displayLimit}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {equippedArtifacts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">Equipped Artifacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equippedArtifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="bg-[#1a2744] rounded-xl p-6 border-2 relative"
                style={{ borderColor: getRarityColor(artifact.rarity) }}
              >
                <div className="absolute top-4 right-4">
                  <div className="bg-[#32CD32] rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Star
                    className="w-5 h-5"
                    style={{ color: getRarityColor(artifact.rarity) }}
                  />
                  <span
                    className="text-sm font-bold uppercase"
                    style={{ color: getRarityColor(artifact.rarity) }}
                  >
                    {artifact.rarity}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-[#F5F5F5] mb-2">
                  {artifact.name}
                </h4>
                <p className="text-sm text-[#F5F5F5]/60 mb-4">
                  {artifact.description}
                </p>

                <div className="space-y-2 mb-4">
                  {artifact.effects.map((effect, index) => (
                    <div
                      key={index}
                      className="bg-[#0F1A32] rounded-lg p-3 border border-[#6A5ACD]/20"
                    >
                      <div className="text-sm text-[#F5F5F5]/70 mb-1">
                        {effect.type === 'creditBonus' && 'Credit Bonus'}
                        {effect.type === 'missionSpeed' && 'Mission Speed'}
                      </div>
                      <div className="text-lg font-bold text-[#00CED1]">
                        +{effect.value}%
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => equipArtifact(artifact.id)}
                  className="w-full px-4 py-2 bg-[#DC143C]/20 text-[#DC143C] rounded-lg font-semibold hover:bg-[#DC143C]/30 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Unequip
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {unequippedArtifacts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">
            Available Artifacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unequippedArtifacts.map((artifact) => {
              const equipped = getEquippedCount(artifact.rarity)
              const limit = rarityLimits[artifact.rarity as keyof typeof rarityLimits]
              const canEquip = equipped < limit

              return (
                <div
                  key={artifact.id}
                  className="bg-[#1a2744] rounded-xl p-6 border-2 border-[#6A5ACD]/30 hover:border-[#6A5ACD] transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star
                      className="w-5 h-5"
                      style={{ color: getRarityColor(artifact.rarity) }}
                    />
                    <span
                      className="text-sm font-bold uppercase"
                      style={{ color: getRarityColor(artifact.rarity) }}
                    >
                      {artifact.rarity}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-[#F5F5F5] mb-2">
                    {artifact.name}
                  </h4>
                  <p className="text-sm text-[#F5F5F5]/60 mb-4">
                    {artifact.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {artifact.effects.map((effect, index) => (
                      <div
                        key={index}
                        className="bg-[#0F1A32] rounded-lg p-3 border border-[#6A5ACD]/20"
                      >
                        <div className="text-sm text-[#F5F5F5]/70 mb-1">
                          {effect.type === 'creditBonus' && 'Credit Bonus'}
                          {effect.type === 'missionSpeed' && 'Mission Speed'}
                        </div>
                        <div className="text-lg font-bold text-[#00CED1]">
                          +{effect.value}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => equipArtifact(artifact.id)}
                    disabled={!canEquip}
                    className="w-full px-4 py-2 bg-[#6A5ACD] text-white rounded-lg font-semibold hover:bg-[#6A5ACD]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Equip
                  </button>

                  {!canEquip && (
                    <p className="text-center text-xs text-[#DC143C] mt-2">
                      All {artifact.rarity} slots full
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {filteredArtifacts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-[#F5F5F5]/30 mx-auto mb-4" />
          <p className="text-[#F5F5F5]/50 text-lg">No artifacts found</p>
        </div>
      )}
    </div>
  )
}

export default ArtifactInventory
