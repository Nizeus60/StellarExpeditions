import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GameState, Mission, Squad, Artifact, Zone, PlayerStats } from '../types/game'
import { generateInitialMissions, generateInitialSquads, generateInitialArtifacts, generateInitialZones } from '../utils/gameData'

interface GameContextType {
  gameState: GameState
  startMission: (missionId: string, squadId: string) => void
  completeMission: (missionId: string) => void
  upgradeSquad: (squadId: string) => void
  equipArtifact: (artifactId: string) => void
  unlockZone: (zoneId: string) => void
  performPrestige: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('stellarExpeditions')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      player: {
        credits: 1000,
        reputation: 0,
        fragments: 0,
        energy: 5,
        maxEnergy: 5,
        prestigeCount: 0,
        prestigeMultiplier: 1,
      },
      missions: generateInitialMissions(),
      squads: generateInitialSquads(),
      artifacts: generateInitialArtifacts(),
      zones: generateInitialZones(),
      activeMissions: [],
    }
  })

  useEffect(() => {
    localStorage.setItem('stellarExpeditions', JSON.stringify(gameState))
  }, [gameState])

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now()
        const updatedMissions = [...prev.missions]
        const updatedActiveMissions = [...prev.activeMissions]

        updatedActiveMissions.forEach((mission) => {
          if (mission.startTime && mission.status === 'active') {
            const elapsed = (now - mission.startTime) / 1000
            if (elapsed >= mission.duration) {
              completeMission(mission.id)
            }
          }
        })

        const newEnergy = Math.min(
          prev.player.maxEnergy,
          prev.player.energy + (1 / 3600)
        )

        return {
          ...prev,
          player: {
            ...prev.player,
            energy: newEnergy,
          },
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const startMission = (missionId: string, squadId: string) => {
    setGameState((prev) => {
      if (prev.player.energy < 1) return prev

      const mission = prev.missions.find((m) => m.id === missionId)
      const squad = prev.squads.find((s) => s.id === squadId)

      if (!mission || !squad || !squad.isAvailable) return prev

      const updatedMission = {
        ...mission,
        status: 'active' as const,
        assignedSquad: squadId,
        startTime: Date.now(),
      }

      const updatedSquads = prev.squads.map((s) =>
        s.id === squadId ? { ...s, isAvailable: false } : s
      )

      const updatedMissions = prev.missions.map((m) =>
        m.id === missionId ? updatedMission : m
      )

      return {
        ...prev,
        player: {
          ...prev.player,
          energy: prev.player.energy - 1,
        },
        missions: updatedMissions,
        squads: updatedSquads,
        activeMissions: [...prev.activeMissions, updatedMission],
      }
    })
  }

  const completeMission = (missionId: string) => {
    setGameState((prev) => {
      const mission = prev.activeMissions.find((m) => m.id === missionId)
      if (!mission) return prev

      const artifactBonus = 1 + (prev.artifacts.filter(a => a.equipped).reduce((sum, art) => {
        const bonus = art.effects.find(e => e.type === 'creditBonus')
        return sum + (bonus ? bonus.value / 100 : 0)
      }, 0))

      const rewards = {
        credits: Math.floor(mission.rewards.credits * prev.player.prestigeMultiplier * artifactBonus),
        reputation: Math.floor(mission.rewards.reputation * prev.player.prestigeMultiplier),
        fragments: mission.rewards.fragments,
      }

      const shouldDropArtifact = Math.random() < mission.rewards.artifactChance
      let newArtifact: Artifact | null = null

      if (shouldDropArtifact) {
        const rarityRoll = Math.random()
        let rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' = 'common'

        if (rarityRoll < 0.005) rarity = 'mythic'
        else if (rarityRoll < 0.05) rarity = 'legendary'
        else if (rarityRoll < 0.20) rarity = 'epic'
        else if (rarityRoll < 0.50) rarity = 'rare'

        newArtifact = {
          id: `artifact-${Date.now()}`,
          name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Artifact`,
          rarity,
          description: 'A mysterious artifact found during the mission',
          effects: [
            {
              type: 'creditBonus',
              value: rarity === 'mythic' ? 200 : rarity === 'legendary' ? 80 : rarity === 'epic' ? 40 : rarity === 'rare' ? 20 : 8
            }
          ],
          equipped: false
        }
      }

      const updatedSquads = prev.squads.map((s) =>
        s.id === mission.assignedSquad ? { ...s, isAvailable: true } : s
      )

      const updatedActiveMissions = prev.activeMissions.filter((m) => m.id !== missionId)

      const updatedMissions = prev.missions.map((m) =>
        m.id === missionId ? { ...m, status: 'available' as const, assignedSquad: undefined, startTime: undefined } : m
      )

      return {
        ...prev,
        player: {
          ...prev.player,
          credits: prev.player.credits + rewards.credits,
          reputation: prev.player.reputation + rewards.reputation,
          fragments: prev.player.fragments + rewards.fragments,
        },
        missions: updatedMissions,
        squads: updatedSquads,
        activeMissions: updatedActiveMissions,
        artifacts: newArtifact ? [...prev.artifacts, newArtifact] : prev.artifacts,
      }
    })
  }

  const upgradeSquad = (squadId: string) => {
    setGameState((prev) => {
      const squad = prev.squads.find((s) => s.id === squadId)
      if (!squad) return prev

      const cost = Math.floor(500 * Math.pow(1.15, squad.level))
      if (prev.player.credits < cost) return prev

      const updatedSquads = prev.squads.map((s) =>
        s.id === squadId ? { ...s, level: s.level + 1 } : s
      )

      return {
        ...prev,
        player: {
          ...prev.player,
          credits: prev.player.credits - cost,
        },
        squads: updatedSquads,
      }
    })
  }

  const equipArtifact = (artifactId: string) => {
    setGameState((prev) => {
      const artifact = prev.artifacts.find((a) => a.id === artifactId)
      if (!artifact) return prev

      const equippedCount = prev.artifacts.filter(a => a.equipped && a.rarity === artifact.rarity).length
      const maxSlots = artifact.rarity === 'mythic' ? 3 : artifact.rarity === 'legendary' ? 6 : artifact.rarity === 'epic' ? 12 : Infinity

      if (!artifact.equipped && equippedCount >= maxSlots) return prev

      const updatedArtifacts = prev.artifacts.map((a) =>
        a.id === artifactId ? { ...a, equipped: !a.equipped } : a
      )

      return {
        ...prev,
        artifacts: updatedArtifacts,
      }
    })
  }

  const unlockZone = (zoneId: string) => {
    setGameState((prev) => {
      const zone = prev.zones.find((z) => z.id === zoneId)
      if (!zone || zone.unlocked) return prev

      if (prev.player.reputation < zone.unlockCost) return prev

      const updatedZones = prev.zones.map((z) =>
        z.id === zoneId ? { ...z, unlocked: true } : z
      )

      return {
        ...prev,
        player: {
          ...prev.player,
          reputation: prev.player.reputation - zone.unlockCost,
        },
        zones: updatedZones,
      }
    })
  }

  const performPrestige = () => {
    setGameState((prev) => {
      if (prev.player.reputation < 1000000) return prev

      const newPrestigeCount = prev.player.prestigeCount + 1
      const newMultiplier = 1 + (0.05 * newPrestigeCount) + (0.02 * newPrestigeCount * newPrestigeCount)

      const legendaryAndMythic = prev.artifacts.filter(
        (a) => a.rarity === 'legendary' || a.rarity === 'mythic'
      )

      return {
        player: {
          credits: 1000,
          reputation: 0,
          fragments: 0,
          energy: 5,
          maxEnergy: 5,
          prestigeCount: newPrestigeCount,
          prestigeMultiplier: newMultiplier,
        },
        missions: generateInitialMissions(),
        squads: generateInitialSquads(),
        artifacts: [...legendaryAndMythic, ...generateInitialArtifacts()],
        zones: generateInitialZones(),
        activeMissions: [],
      }
    })
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        startMission,
        completeMission,
        upgradeSquad,
        equipArtifact,
        unlockZone,
        performPrestige,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
