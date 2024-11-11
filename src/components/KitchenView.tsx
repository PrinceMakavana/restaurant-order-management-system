import React from 'react';
import { CheckCircle, Clock, Coffee } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export const KitchenView: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();

  const getPendingOrders = () => orders.filter(order => order.status === 'pending');
  const getPreparingOrders = () => orders.filter(order => order.status === 'preparing');
  const getReadyOrders = () => orders.filter(order => order.status === 'ready');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-red-500';
      case 'preparing': return 'text-yellow-500';
      case 'ready': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const renderOrderCard = (order: any) => (
    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">Table {order.tableNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
          {order.status === 'pending' && <Clock className="w-5 h-5" />}
          {order.status === 'preparing' && <Coffee className="w-5 h-5" />}
          {order.status === 'ready' && <CheckCircle className="w-5 h-5" />}
          <span className="capitalize">{order.status}</span>
        </div>
      </div>

      <div className="space-y-2">
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        {order.status === 'pending' && (
          <button
            onClick={() => updateOrderStatus(order.id, 'preparing')}
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Start Preparing
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => updateOrderStatus(order.id, 'ready')}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Mark as Ready
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Kitchen Orders</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-red-500 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Pending Orders
          </h2>
          {getPendingOrders().map(renderOrderCard)}
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
            <Coffee className="w-5 h-5" /> Preparing
          </h2>
          {getPreparingOrders().map(renderOrderCard)}
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-green-500 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Ready to Serve
          </h2>
          {getReadyOrders().map(renderOrderCard)}
        </div>
      </div>
    </div>
  );
};