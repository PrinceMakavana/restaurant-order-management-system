import { useState, useEffect } from 'react';
import { ref, onValue, DatabaseReference } from 'firebase/database';
import { db } from '../config/firebase';
import { MenuItem } from '../types';

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let menuRef: DatabaseReference;
    try {
      menuRef = ref(db, 'menuItems');
      const unsubscribe = onValue(
        menuRef,
        (snapshot) => {
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
          setError(null);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching menu items:', error);
          setError('Failed to load menu items. Please try again later.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up menu listener:', error);
      setError('Failed to connect to the menu service.');
      setLoading(false);
      return () => {};
    }
  }, []);

  return { menuItems, loading, error };
};