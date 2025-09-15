import { Home, User, Trophy, Gift, Settings as SettingsIcon, Bell, HelpCircle } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/rewards', icon: Gift, label: 'Rewards' },
  { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/help', icon: HelpCircle, label: 'Help' },
];

export default navItems;


