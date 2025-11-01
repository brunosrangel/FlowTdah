
import React from 'react';
import { Screen } from '../types';
import { HomeIcon, TimerIcon, ChartIcon, StarIcon } from './icons';

interface BottomNavProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
        isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
      }`}
    >
      {icon}
      <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setScreen }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] max-w-lg mx-auto rounded-t-2xl">
      <div className="flex h-full">
        <NavItem
          label="Tarefas"
          icon={<HomeIcon />}
          isActive={currentScreen === 'home'}
          onClick={() => setScreen('home')}
        />
        <NavItem
          label="Foco"
          icon={<TimerIcon />}
          isActive={currentScreen === 'focus_mode'}
          onClick={() => setScreen('focus_mode')}
        />
        <NavItem
          label="Progresso"
          icon={<ChartIcon />}
          isActive={currentScreen === 'stats'}
          onClick={() => setScreen('stats')}
        />
        <NavItem
          label="Premium"
          icon={<StarIcon />}
          isActive={currentScreen === 'premium'}
          onClick={() => setScreen('premium')}
        />
      </div>
    </div>
  );
};

export default BottomNav;
