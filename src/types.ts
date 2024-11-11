export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'beverages';
  description: string;
  imageUrl?: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  timestamp: number;
  waiter: string;
}