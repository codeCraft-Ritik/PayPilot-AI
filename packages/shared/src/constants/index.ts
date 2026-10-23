import { ProductCategory } from '../types/product.js';

export const APP_METADATA = {
  name: 'PayPilot AI',
  tagline: 'Your AI Shopping Copilot',
  brandStatement: 'Discover smarter. Compare better. Pay confidently.',
  disclaimer:
    'PayPilot AI is an independent hackathon prototype built for the PayPal AI Hackathon. PayPal is a trademark of PayPal, Inc.',
  version: '1.0.0',
};

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'audio',
    label: 'Audio & Acoustics',
    description: 'ANC headphones, high-fidelity wireless earbuds, and podcasting microphones.',
    icon: 'Headphones',
  },
  {
    id: 'peripherals',
    label: 'Keyboards & Mice',
    description: 'Precision mechanical keyboards, ergonomic vertical mice, and productivity gear.',
    icon: 'Keyboard',
  },
  {
    id: 'workstation',
    label: 'Monitors & Desks',
    description: 'Color-accurate 4K displays, thunderbolt docks, and motorized standing desks.',
    icon: 'Monitor',
  },
  {
    id: 'smart-home',
    label: 'Smart Living',
    description: 'Connected ambient lighting, voice assistants, and energy monitoring plugs.',
    icon: 'Home',
  },
  {
    id: 'wearables',
    label: 'Smartwatches & Fitness',
    description: 'Biometric tracking, sleep monitors, and sapphire-glass connected timepieces.',
    icon: 'Watch',
  },
  {
    id: 'coffee-living',
    label: 'Specialty Coffee & Living',
    description: 'PID espresso machines, precision burr grinders, and temperature-controlled mugs.',
    icon: 'Coffee',
  },
  {
    id: 'cameras',
    label: 'Content & Cameras',
    description: '4K webcam streamers, mirrorless lenses, and studio lighting keylights.',
    icon: 'Camera',
  },
];

export const SAMPLE_QUERIES = [
  {
    title: 'Focus Headset under $150',
    prompt: 'Find active noise-cancelling wireless headphones under $150 with good mic quality for Zoom calls and comfortable ear cushions.',
    category: 'audio' as ProductCategory,
    budget: 150,
  },
  {
    title: 'Coding Keyboard under $120',
    prompt: 'I want a mechanical keyboard under $120 with hot-swappable tactile switches, wireless multi-device Bluetooth, and Mac layout support.',
    category: 'peripherals' as ProductCategory,
    budget: 120,
  },
  {
    title: 'Developer 4K Monitor under $450',
    prompt: 'Looking for a color-accurate 27-inch 4K monitor with USB-C 65W charging for my laptop under $450.',
    category: 'workstation' as ProductCategory,
    budget: 450,
  },
  {
    title: 'Compact Espresso Machine under $300',
    prompt: 'Show me an espresso machine under $300 that heats up fast, has a steam wand for latte art, and fits on a small apartment counter.',
    category: 'coffee-living' as ProductCategory,
    budget: 300,
  },
];
