import { useState } from 'react'
import { Rocket, Users, Trophy, Map, Package } from 'lucide-react'
import MissionHub from './components/MissionHub'
import SquadManager from './components/SquadManager'
import ArtifactInventory from './components/ArtifactInventory'
import GalaxyMap from './components/GalaxyMap'
import PrestigePanel from './components/PrestigePanel'
import { GameProvider } from './context/GameContext'

function App() {
  const [activeTab, setActiveTab] = useState('missions')

  const tabs = [
    { id: 'missions', label: 'Missions', icon: Rocket },
    { id: 'squads', label: 'Squads', icon: Users },
    { id: 'artifacts', label: 'Artifacts', icon: Package },
    { id: 'galaxy', label: 'Galaxy', icon: Map },
    { id: 'prestige', label: 'Prestige', icon: Trophy },
  ]

  return (
    <GameProvider>
      <div className="min-h-screen bg-[#0F1A32] text-[#F5F5F5]">
        <header className="bg-[#1a2744] border-b border-[#6A5ACD]/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-[#00CED1]" />
              <h1 className="text-3xl font-bold text-[#F5F5F5]">Stellar Expeditions</h1>
            </div>
          </div>
        </header>

        <nav className="bg-[#1a2744] border-b border-[#6A5ACD]/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#6A5ACD] text-white border-b-2 border-[#00CED1]'
                        : 'text-[#F5F5F5]/70 hover:text-[#F5F5F5] hover:bg-[#0F1A32]/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'missions' && <MissionHub />}
          {activeTab === 'squads' && <SquadManager />}
          {activeTab === 'artifacts' && <ArtifactInventory />}
          {activeTab === 'galaxy' && <GalaxyMap />}
          {activeTab === 'prestige' && <PrestigePanel />}
        </main>
      </div>
    </GameProvider>
  )
}

export default App;
