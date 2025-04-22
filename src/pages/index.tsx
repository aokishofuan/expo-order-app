// src/pages/index.tsx
import React from 'react';
import OrderForm from '../components/OrderForm';
import { Order } from '../types/Order';

const HomePage: React.FC = () => {

  const handleAddOrder = (newOrder: Order) => {
    const storedOrders = localStorage.getItem('orders');
    const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];

    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    console.log('新しい注文を保存しました:', newOrder);
  };

  return (
    <div>
      <h1>宅急便 受付画面</h1>
      <OrderForm onAddOrder={handleAddOrder} />
    </div>
  );
};

export default HomePage;
