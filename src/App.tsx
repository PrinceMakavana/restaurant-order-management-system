import React, { useState } from 'react';
import { OrderProvider } from './context/OrderContext';
import { WaiterView } from './components/WaiterView';
import { KitchenView } from './components/KitchenView';
import { MenuManagement } from './components/MenuManagement';
import { ChefHat, UserCircle, Menu } from 'lucide-react';

function App() {
  const [view, setView] = useState<'waiter' | 'kitchen' | 'menu'>('waiter');

  return (
    <OrderProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Restaurant Order System</h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setView('waiter')}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    view === 'waiter'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Waiter View
                </button>
                <button
                  onClick={() => setView('kitchen')}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    view === 'kitchen'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChefHat className="w-5 h-5 mr-2" />
                  Kitchen View
                </button>
                <button
                  onClick={() => setView('menu')}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    view === 'menu'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Menu className="w-5 h-5 mr-2" />
                  Menu Management
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main>
          {view === 'waiter' && <WaiterView />}
          {view === 'kitchen' && <KitchenView />}
          {view === 'menu' && <MenuManagement />}
        </main>
      </div>
    </OrderProvider>
  );
}

export default App;