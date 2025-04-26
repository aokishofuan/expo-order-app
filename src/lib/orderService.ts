// src/lib/orderService.ts
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { onSnapshot } from 'firebase/firestore';

// 注文を保存する
export const saveOrder = async (orderData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), orderData)
    console.log('注文保存完了:', docRef.id)
  } catch (e) {
    console.error('注文保存エラー:', e)
  }
}

// 注文を取得する
export const getOrders = async () => {  // ←ここ名前を変更
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'))
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return orders
  } catch (e) {
    console.error('注文取得エラー:', e)
    return []
  }
}

// 注文のリアルタイム取得
export const subscribeOrders = (callback: (orders: any[]) => void) => {
    const ordersCollection = collection(db, 'orders');
  
    return onSnapshot(ordersCollection, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(orders);
    });
  };
