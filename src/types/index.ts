// src/types/index.ts

export type Item = {
    name: string;
    quantity: number;
  };
  
  export type Order = {
    id: string;
    createdAt: string;
    orderNumber: string;
    name: string;
    postalCode: string;
    address: string;
    phone: string;
    deliveryDate: string;
    deliveryTime: string;
    isSameReceiver: boolean;
    receiverName: string;
    receiverPostalCode: string;
    receiverAddress: string;
    receiverPhone: string;
    items: Item[];
  };
  