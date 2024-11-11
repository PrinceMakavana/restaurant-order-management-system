import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Send } from 'lucide-react';
import { MenuItem, OrderItem } from '../types';
import { useMenu } from '../hooks/useMenu';
import { useOrders } from '../context/OrderContext';

export const WaiterView: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { addOrder } = useOrders();
  const { menuItems, loading } = useMenu();

  const addToOrder = (item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (itemId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const submitOrder = () => {
    if (orderItems.length === 0) return;

    const newOrder = {
      id: Date.now().toString(),
      tableNumber: selectedTable,
      items: orderItems,
      status: 'pending' as const,
      timestamp: Date.now(),
      waiter: 'John Doe'
    };

    addOrder(newOrder);
    setOrderItems([]);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <div className="w-2/3 p-6 bg-white overflow-y-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Table Number</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>Table {num}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map(item => (
            <div key={item.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-indigo-600 font-medium">${item.price}</p>
                </div>
                <button
                  onClick={() => addToOrder(item)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <PlusCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3 p-6 bg-gray-50 border-l">
        <h2 className="text-xl font-semibold mb-4">Current Order - Table {selectedTable}</h2>
        <div className="space-y-4">
          {orderItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  ${item.price} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeFromOrder(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => addToOrder(item)}
                  className="text-green-500 hover:text-green-700"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {orderItems.length > 0 && (
          <div className="mt-6">
            <div className="text-xl font-semibold mb-4">
              Total: ${orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </div>
            <button
              onClick={submitOrder}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-5 h-5" />
              Send to Kitchen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};