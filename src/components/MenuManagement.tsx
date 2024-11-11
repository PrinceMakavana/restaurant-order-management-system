import React, { useState, useEffect } from 'react';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { MenuItem } from '../types';
import { PlusCircle, Edit2, Trash2, Save, X, AlertCircle, Utensils, Coffee, IceCream, Beer } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

export const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'starters',
    description: '',
    imageUrl: ''
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'starters':
        return <Utensils className="w-5 h-5" />;
      case 'mains':
        return <Utensils className="w-5 h-5" />;
      case 'desserts':
        return <IceCream className="w-5 h-5" />;
      case 'beverages':
        return <Coffee className="w-5 h-5" />;
      default:
        return <Beer className="w-5 h-5" />;
    }
  };

  useEffect(() => {
    try {
      const menuRef = ref(db, 'menuItems');
      const unsubscribe = onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<MenuItem, 'id'>)
          }));
          setMenuItems(items);
        } else {
          setMenuItems([]);
        }
        setLoading(false);
        setError(null);
      }, (error) => {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up menu listener:', error);
      setError('Failed to connect to the menu service.');
      setLoading(false);
    }
  }, []);

  const handleAddItem = async () => {
    try {
      const menuRef = ref(db, 'menuItems');
      await push(menuRef, newItem);
      setNewItem({
        name: '',
        price: 0,
        category: 'starters',
        description: '',
        imageUrl: ''
      });
      setError(null);
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add menu item. Please try again.');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      const menuRef = ref(db, `menuItems/${editingItem.id}`);
      await update(menuRef, {
        name: editingItem.name,
        price: editingItem.price,
        category: editingItem.category,
        description: editingItem.description,
        imageUrl: editingItem.imageUrl
      });
      setEditingItem(null);
      setError(null);
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update menu item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const menuRef = ref(db, `menuItems/${id}`);
      await remove(menuRef);
      setError(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete menu item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Menu Management</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Add New Item Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value as MenuItem['category'] })}
            className="p-2 border rounded"
          >
            <option value="starters">Starters</option>
            <option value="mains">Mains</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="p-2 border rounded"
          />
          <div className="col-span-2">
            <ImageUpload
              onImageUploaded={(url) => setNewItem({ ...newItem, imageUrl: url })}
              currentImageUrl={newItem.imageUrl}
            />
          </div>
        </div>
        <button
          onClick={handleAddItem}
          className="mt-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!newItem.name || !newItem.price}
        >
          <PlusCircle className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Menu Items List */}
      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
            {editingItem?.id === item.id ? (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  className="p-2 border rounded"
                />
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as MenuItem['category'] })}
                  className="p-2 border rounded"
                >
                  <option value="starters">Starters</option>
                  <option value="mains">Mains</option>
                  <option value="desserts">Desserts</option>
                  <option value="beverages">Beverages</option>
                </select>
                <input
                  type="text"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="p-2 border rounded"
                />
                <div className="col-span-2">
                  <ImageUpload
                    onImageUploaded={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                    currentImageUrl={editingItem.imageUrl}
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={handleUpdateItem}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={!editingItem.name || !editingItem.price}
                  >
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-indigo-600 font-medium">${item.price}</p>
                    <span className="text-sm text-gray-500 capitalize flex items-center gap-1">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};