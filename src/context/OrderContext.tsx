import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Order } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create WebSocket connection
const ws = new WebSocket('wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self');

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ORDER') {
        setOrders(prev => [...prev, data.order]);
      } else if (data.type === 'UPDATE_STATUS') {
        setOrders(prev =>
          prev.map(order =>
            order.id === data.orderId ? { ...order, status: data.status } : order
          )
        );
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const addOrder = useCallback((order: Order) => {
    ws.send(JSON.stringify({ type: 'NEW_ORDER', order }));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    ws.send(JSON.stringify({ type: 'UPDATE_STATUS', orderId, status }));
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};