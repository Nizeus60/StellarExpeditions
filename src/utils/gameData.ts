import { Mission, Squad, Artifact, Zone } from '../types/game'

export const generateInitialMissions = (): Mission[] => {
  return [
    {
      id: 'mission-1',
      type: 'exploration',
      name: 'Survey Nearby Nebula',
      duration: 120,
      zone: 'Starter Zone',
      danger: 'safe',
      status: 'available',
      rewards: {
        credits: 500,
        reputation: 100,
        fragments: 5,
        artifactChance: 0.3,
      },
      tier: 1,
    },
    {
      id: 'mission-2',
      type: 'combat',
      name: 'Clear Pirate Outpost',
      duration: 180,
      zone: 'Starter Zone',
      danger: 'safe',
      status: 'available',
      rewards: {
        credits: 800,
        reputation: 150,
        fragments: 8,
        artifactChance: 0.35,
      },
      tier: 1,
    },
    {
      id: 'mission-3',
      type: 'mining',
      name: 'Asteroid Field Extraction',
      duration: 240,
      zone: 'Starter Zone',
      danger: 'safe',
      status: 'available',
      rewards: {
        credits: 1200,
        reputation: 80,
        fragments: 12,
        artifactChance: 0.25,
      },
      tier: 1,
    },
    {
      id: 'mission-4',
      type: 'diplomacy',
      name: 'Negotiate Trade Agreement',
      duration: 300,
      zone: 'Starter Zone',
      danger: 'safe',
      status: 'available',
      rewards: {
        credits: 600,
        reputation: 250,
        fragments: 10,
        artifactChance: 0.4,
      },
      tier: 1,
    },
    {
      id: 'mission-5',
      type: 'exploration',
      name: 'Deep Space Reconnaissance',
      duration: 600,
      zone: 'Outer Rim',
      danger: 'risky',
      status: 'available',
      rewards: {
        credits: 2500,
        reputation: 500,
        fragments: 25,
        artifactChance: 0.5,
      },
      tier: 2,
    },
    {
      id: 'mission-6',
      type: 'combat',
      name: 'Eliminate Alien Threat',
      duration: 900,
      zone: 'Outer Rim',
      danger: 'dangerous',
      status: 'available',
      rewards: {
        credits: 4000,
        reputation: 800,
        fragments: 40,
        artifactChance: 0.65,
      },
      tier: 3,
    },
  ]
}

export const generateInitialSquads = (): Squad[] => {
  return [
    {
      id: 'squad-1',
      name: 'Alpha Explorers',
      type: 'explorers',
      level: 1,
      isAvailable: true,
      bonuses: {
        exploration: 25,
      },
    },
    {
      id: 'squad-2',
      name: 'Delta Commandos',
      type: 'commandos',
      level: 1,
      isAvailable: true,
      bonuses: {
        combat: 30,
      },
    },
    {
      id: 'squad-3',
      name: 'Gamma Miners',
      type: 'miners',
      level: 1,
      isAvailable: true,
      bonuses: {
        mining: 35,
      },
    },
  ]
}

export const generateInitialArtifacts = (): Artifact[] => {
  return [
    {
      id: 'artifact-starter-1',
      name: 'Basic Scanner',
      rarity: 'common',
      description: 'A standard issue scanner that provides basic bonuses',
      effects: [
        {
          type: 'creditBonus',
          value: 5,
        },
      ],
      equipped: false,
    },
    {
      id: 'artifact-starter-2',
      name: 'Navigation Computer',
      rarity: 'rare',
      description: 'Reduces mission time and increases efficiency',
      effects: [
        {
          type: 'missionSpeed',
          value: 15,
        },
      ],
      equipped: false,
    },
  ]
}

export const generateInitialZones = (): Zone[] => {
  return [
    {
      id: 'zone-1',
      name: 'Starter Zone',
      danger: 'safe',
      unlocked: true,
      unlockCost: 0,
      description: 'A safe region of space perfect for beginners',
    },
    {
      id: 'zone-2',
      name: 'Outer Rim',
      danger: 'risky',
      unlocked: false,
      unlockCost: 5000,
      description: 'More dangerous but with greater rewards',
    },
    {
      id: 'zone-3',
      name: 'Nebula of Chaos',
      danger: 'dangerous',
      unlocked: false,
      unlockCost: 50000,
      description: 'A treacherous area filled with mysteries',
    },
    {
      id: 'zone-4',
      name: 'The Void',
      danger: 'deadly',
      unlocked: false,
      unlockCost: 500000,
      description: 'Only the most skilled expeditions survive here',
    },
  ]
}

export const getMissionTypeColor = (type: string): string => {
  switch (type) {
    case 'exploration':
      return '#00CED1'
    case 'combat':
      return '#DC143C'
    case 'mining':
      return '#FFD700'
    case 'diplomacy':
      return '#32CD32'
    default:
      return '#6A5ACD'
  }
}

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return '#9CA3AF'
    case 'rare':
      return '#3B82F6'
    case 'epic':
      return '#A855F7'
    case 'legendary':
      return '#F59E0B'
    case 'mythic':
      return '#EF4444'
    default:
      return '#6A5ACD'
  }
}

export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}
