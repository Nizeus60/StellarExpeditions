export type MissionType = 'exploration' | 'combat' | 'mining' | 'diplomacy'
export type MissionStatus = 'available' | 'active' | 'completed'
export type SquadType = 'explorers' | 'commandos' | 'miners' | 'diplomats' | 'versatile'
export type ArtifactRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type ZoneDanger = 'safe' | 'risky' | 'dangerous' | 'deadly'

export interface Mission {
  id: string
  type: MissionType
  name: string
  duration: number
  zone: string
  danger: ZoneDanger
  status: MissionStatus
  assignedSquad?: string
  startTime?: number
  rewards: {
    credits: number
    reputation: number
    fragments: number
    artifactChance: number
  }
  tier: number
}

export interface Squad {
  id: string
  name: string
  type: SquadType
  level: number
  isAvailable: boolean
  bonuses: {
    [key in MissionType]?: number
  }
}

export interface Artifact {
  id: string
  name: string
  rarity: ArtifactRarity
  description: string
  effects: {
    type: string
    value: number
  }[]
  equipped: boolean
}

export interface Zone {
  id: string
  name: string
  danger: ZoneDanger
  unlocked: boolean
  unlockCost: number
  description: string
}

export interface PlayerStats {
  credits: number
  reputation: number
  fragments: number
  energy: number
  maxEnergy: number
  prestigeCount: number
  prestigeMultiplier: number
}

export interface GameState {
  player: PlayerStats
  missions: Mission[]
  squads: Squad[]
  artifacts: Artifact[]
  zones: Zone[]
  activeMissions: Mission[]
}
