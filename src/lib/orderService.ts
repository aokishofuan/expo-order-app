// src/lib/orderService.ts

import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '@/types';  // ←追加！(なければ型定義する)

export const saveOrder = async (orderData: Order) => {  // ←anyじゃなくOrder型！
  try {
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    console.log('注文保存完了:', docRef.id);
  } catch (e) {
    console.error('注文保存エラー:', e);
  }
};

export const deleteOrder = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'orders', id));
    console.log('注文削除完了:', id);
  } catch (e) {
    console.error('注文削除エラー:', e);
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    return orders;
  } catch (e) {
    console.error('注文取得エラー:', e);
    return [];
  }
};

export const subscribeOrders = (callback: (orders: Order[]) => void) => {
  return onSnapshot(collection(db, 'orders'), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    callback(orders);
  });
};

