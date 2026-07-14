import {
  Zap, Flame, Sun, Trophy, Shield, Crosshair, Rocket, Wind, Star, Gem, Mountain, Waves,
  Car, Bike, Ship, Plane, RocketIcon, Siren, Radar, Navigation, Compass, LocateFixed,
  Eye, Bolt, Lightbulb, Sparkles, Cloud, Moon, Sunrise, Sunset, Rainbow,
  Leaf, TreePine, Flower2, Cherry, Shell, PawPrint, Bird, Fish, Turtle, Snail, Rabbit,
  Diamond, Crown, Medal, Award, Swords, ShieldCheck, Target, Hash,
  Heart, InfinityIcon, Anchor, Magnet, Key, Lock, Unlock, Globe, Map,
  Activity, Circle, Triangle, Square, Hexagon, Octagon, Pentagon,
  Music, Volume2, Camera, Film, Tv, Watch, Clock, Timer,
  Coffee, Pizza, Cake, Apple, Beer, Wine,
  Laugh, Frown, Meh, Smile, Skull
} from 'lucide-react';

export const LUCIDE_PREFIX = '__lucide__';

export const LUCIDE_ICONS_MAP = {
  Zap, Flame, Sun, Moon, Star, Sparkles, Cloud, Sunrise, Sunset, Rainbow,
  Bolt, Lightbulb, Eye, Trophy, Medal, Award, Crown, Diamond, Gem,
  Shield, ShieldCheck, Crosshair, Target, Swords, Rocket, Siren,
  Car, Bike, Ship, Plane, Compass, Navigation, LocateFixed, Radar,
  Anchor, Magnet, Key, Lock, Unlock, Globe, Map,
  Wind, Mountain, Waves, Leaf, TreePine, Flower2, Cherry, Shell,
  PawPrint, Bird, Fish, Turtle, Snail, Rabbit,
  Heart, Hash, Activity, Circle, Triangle, Square, Hexagon, Octagon, Pentagon,
  Music, Volume2, Camera, Film, Tv, Watch, Clock, Timer,
  Coffee, Pizza, Cake, Apple, Beer, Wine,
  Smile, Laugh, Frown, Meh, Skull,
  RocketIcon,
  InfinityIcon
};

// Also expose as an array for pickers
export const LUCIDE_ICONS_LIST = [
  { name: 'Zap', component: Zap },
  { name: 'Flame', component: Flame },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
  { name: 'Star', component: Star },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Cloud', component: Cloud },
  { name: 'Sunrise', component: Sunrise },
  { name: 'Sunset', component: Sunset },
  { name: 'Rainbow', component: Rainbow },
  { name: 'Bolt', component: Bolt },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Eye', component: Eye },
  { name: 'Trophy', component: Trophy },
  { name: 'Medal', component: Medal },
  { name: 'Award', component: Award },
  { name: 'Crown', component: Crown },
  { name: 'Diamond', component: Diamond },
  { name: 'Gem', component: Gem },
  { name: 'Shield', component: Shield },
  { name: 'ShieldCheck', component: ShieldCheck },
  { name: 'Crosshair', component: Crosshair },
  { name: 'Target', component: Target },
  { name: 'Swords', component: Swords },
  { name: 'Rocket', component: Rocket },
  { name: 'RocketIcon', component: RocketIcon },
  { name: 'Car', component: Car },
  { name: 'Bike', component: Bike },
  { name: 'Ship', component: Ship },
  { name: 'Plane', component: Plane },
  { name: 'Compass', component: Compass },
  { name: 'Navigation', component: Navigation },
  { name: 'LocateFixed', component: LocateFixed },
  { name: 'Radar', component: Radar },
  { name: 'Siren', component: Siren },
  { name: 'Anchor', component: Anchor },
  { name: 'Magnet', component: Magnet },
  { name: 'Key', component: Key },
  { name: 'Lock', component: Lock },
  { name: 'Unlock', component: Unlock },
  { name: 'Globe', component: Globe },
  { name: 'Map', component: Map },
  { name: 'Wind', component: Wind },
  { name: 'Mountain', component: Mountain },
  { name: 'Waves', component: Waves },
  { name: 'Leaf', component: Leaf },
  { name: 'TreePine', component: TreePine },
  { name: 'Flower2', component: Flower2 },
  { name: 'Cherry', component: Cherry },
  { name: 'Shell', component: Shell },
  { name: 'PawPrint', component: PawPrint },
  { name: 'Bird', component: Bird },
  { name: 'Fish', component: Fish },
  { name: 'Turtle', component: Turtle },
  { name: 'Snail', component: Snail },
  { name: 'Rabbit', component: Rabbit },
  { name: 'Heart', component: Heart },
  { name: 'InfinityIcon', component: InfinityIcon },
  { name: 'Hash', component: Hash },
  { name: 'Activity', component: Activity },
  { name: 'Circle', component: Circle },
  { name: 'Triangle', component: Triangle },
  { name: 'Square', component: Square },
  { name: 'Hexagon', component: Hexagon },
  { name: 'Octagon', component: Octagon },
  { name: 'Pentagon', component: Pentagon },
  { name: 'Music', component: Music },
  { name: 'Volume2', component: Volume2 },
  { name: 'Camera', component: Camera },
  { name: 'Film', component: Film },
  { name: 'Tv', component: Tv },
  { name: 'Watch', component: Watch },
  { name: 'Clock', component: Clock },
  { name: 'Timer', component: Timer },
  { name: 'Coffee', component: Coffee },
  { name: 'Pizza', component: Pizza },
  { name: 'Cake', component: Cake },
  { name: 'Apple', component: Apple },
  { name: 'Beer', component: Beer },
  { name: 'Wine', component: Wine },
  { name: 'Smile', component: Smile },
  { name: 'Laugh', component: Laugh },
  { name: 'Frown', component: Frown },
  { name: 'Meh', component: Meh },
  { name: 'Skull', component: Skull },
];

export function isLucideIcon(value) {
  return typeof value === 'string' && value.startsWith(LUCIDE_PREFIX);
}

export function renderIcon(value, className = 'w-10 h-10') {
  if (isLucideIcon(value)) {
    const name = value.replace(LUCIDE_PREFIX, '');
    const IconComp = LUCIDE_ICONS_MAP[name];
    if (IconComp) return <IconComp className={className} />;
  }
  // Default fallback if not a Lucide icon (assume emoji)
  return <span className="text-4xl">{value || '🏎️'}</span>;
}
