// src/types/Order.ts

export type OrderItem = {
  itemName: string;
  itemCode: string;
  quantity: number;
};

export type Order = {
  id: string;                // ショップ受注番号
  createdAt: string;          // 受注日時
  orderNumber: string;
  name: string;               // 注文者名
  postalCode: string;
  address: string;
  phone: string;
  items: OrderItem[]; 

  isSameReceiver: boolean;
  receiverName: string;
  receiverPostalCode: string;
  receiverAddress: string;
  receiverPhone: string;
  deliveryDate: string;
  deliveryTime: string;
};
