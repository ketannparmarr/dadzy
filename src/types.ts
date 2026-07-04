export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // in INR
  image: string;
  specs: string[];
  stock: number;
  maxStock: number;
  materials: string[];
  origin: string;
  theme?: 'Business' | 'Travel' | 'Occasion';
}

export interface InventoryDrop {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: 'active' | 'upcoming' | 'archived';
  products: Product[];
}

export interface HniUser {
  fullName: string;
  email: string;
  city: string;
  phone: string;
  tier: 'Heritage' | 'Regal' | 'Imperial';
  conciergeNotes: string;
  joinedAt: string;
  customCommissions: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum TabOption {
  DROPS = 'THE DROPS',
  SALON = 'PRIVATE SALON',
}
