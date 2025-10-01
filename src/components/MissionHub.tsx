import React, { useState, useEffect } from 'react'
import { Clock, Coins, Trophy, Zap, Play, CheckCircle } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { getMissionTypeColor, formatTime } from '../utils/gameData'

const MissionHub = () => {
  const { gameState, startMission } = useGame()
  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [selectedSquad, setSelectedSquad] = useState<string | null>(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const handleStartMission = () => {
    if (selectedMission && selectedSquad) {
      startMission(selectedMission, selectedSquad)
      setSelectedMission(null)
      setSelectedSquad(null)
    }
  }

  const availableMissions = gameState.missions.filter((m) => m.status === 'available')
  const activeMissions = gameState.activeMissions

  const getMissionProgress = (mission: any) => {
    if (!mission.startTime) return 0
    const elapsed = (Date.now() - mission.startTime) / 1000
    return Math.min((elapsed / mission.duration) * 100, 100)
  }

  const getRemainingTime = (mission: any) => {
    if (!mission.startTime) return mission.duration
    const elapsed = (Date.now() - mission.startTime) / 1000
    return Math.max(mission.duration - elapsed, 0)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Mission Control</h2>
          <p className="text-[#F5F5F5]/70">Deploy squads to complete missions and earn rewards</p>
        </div>
        <div className="flex items-center gap-6 bg-[#1a2744] px-6 py-4 rounded-lg border border-[#6A5ACD]/30">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#FFD700]" />
            <span className="font-bold text-lg">{gameState.player.credits.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00CED1]" />
            <span className="font-bold text-lg">{gameState.player.reputation.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#32CD32]" />
            <span className="font-bold text-lg">{Math.floor(gameState.player.energy)}/{gameState.player.maxEnergy}</span>
          </div>
        </div>
      </div>

      {activeMissions.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">Active Missions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMissions.map((mission) => {
              const progress = getMissionProgress(mission)
              const remaining = getRemainingTime(mission)
              const squad = gameState.squads.find((s) => s.id === mission.assignedSquad)

              return (
                <div
                  key={mission.id}
                  className="bg-[#1a2744] rounded-lg p-6 border-2 border-[#6A5ACD]/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getMissionTypeColor(mission.type) }}
                        />
                        <span className="text-sm font-semibold text-[#00CED1] uppercase">
                          {mission.type}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-[#F5F5F5]">{mission.name}</h4>
                      <p className="text-sm text-[#F5F5F5]/60 mt-1">{mission.zone}</p>
                    </div>
                    <Clock className="w-5 h-5 text-[#00CED1]" />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#F5F5F5]/70">Progress</span>
                      <span className="text-[#00CED1] font-semibold">
                        {progress >= 100 ? 'Complete!' : formatTime(remaining)}
                      </span>
                    </div>
                    <div className="w-full bg-[#0F1A32] rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6A5ACD] to-[#00CED1] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#F5F5F5]/70">Squad: {squad?.name}</span>
                    {progress >= 100 && (
                      <CheckCircle className="w-5 h-5 text-[#32CD32]" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">Available Missions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMissions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => setSelectedMission(mission.id)}
              className={`bg-[#1a2744] rounded-lg p-6 border-2 transition-all cursor-pointer hover:border-[#6A5ACD] ${
                selectedMission === mission.id
                  ? 'border-[#6A5ACD] shadow-lg shadow-[#6A5ACD]/30'
                  : 'border-[#6A5ACD]/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getMissionTypeColor(mission.type) }}
                />
                <span className="text-sm font-semibold text-[#00CED1] uppercase">
                  {mission.type}
                </span>
              </div>

              <h4 className="text-lg font-bold text-[#F5F5F5] mb-2">{mission.name}</h4>
              <p className="text-sm text-[#F5F5F5]/60 mb-4">{mission.zone}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#F5F5F5]/70">Duration</span>
                  <span className="text-[#F5F5F5] font-semibold">{formatTime(mission.duration)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#F5F5F5]/70">Credits</span>
                  <span className="text-[#FFD700] font-semibold">{mission.rewards.credits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#F5F5F5]/70">Reputation</span>
                  <span className="text-[#00CED1] font-semibold">{mission.rewards.reputation}</span>
                </div>
              </div>

              <div className="text-xs text-[#F5F5F5]/50">
                Artifact drop: {(mission.rewards.artifactChance * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2744] rounded-xl p-8 max-w-2xl w-full border-2 border-[#6A5ACD]">
            <h3 className="text-2xl font-bold text-[#F5F5F5] mb-6">Select Squad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {gameState.squads
                .filter((squad) => squad.isAvailable)
                .map((squad) => (
                  <div
                    key={squad.id}
                    onClick={() => setSelectedSquad(squad.id)}
                    className={`bg-[#0F1A32] rounded-lg p-4 border-2 transition-all cursor-pointer ${
                      selectedSquad === squad.id
                        ? 'border-[#00CED1] shadow-lg'
                        : 'border-[#6A5ACD]/30 hover:border-[#6A5ACD]'
                    }`}
                  >
                    <h4 className="text-lg font-bold text-[#F5F5F5] mb-2">{squad.name}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#F5F5F5]/70">Level {squad.level}</span>
                      <span className="text-[#00CED1] font-semibold capitalize">{squad.type}</span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedMission(null)
                  setSelectedSquad(null)
                }}
                className="flex-1 px-6 py-3 bg-[#0F1A32] text-[#F5F5F5] rounded-lg font-semibold hover:bg-[#0F1A32]/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartMission}
                disabled={!selectedSquad || gameState.player.energy < 1}
                className="flex-1 px-6 py-3 bg-[#6A5ACD] text-white rounded-lg font-semibold hover:bg-[#6A5ACD]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Launch Mission (1 Energy)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MissionHub
