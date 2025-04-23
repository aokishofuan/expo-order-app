export interface OrderItem {
    itemName: string;
    quantity: number;
    itemCode: string; // 商品コードを追加
  }
  
  export interface Order {
    id: string; // ショップ受注番号
    createdAt: string; // 受注日時
    orderNumber: string;
    name: string; // 注文者名
    postalCode: string;
    address: string;
    phone: string;
    items: OrderItem[];
  
    sameAsCustomer: boolean;
    recipientName?: string;
    recipientPostalCode?: string;
    recipientAddress?: string;
    recipientPhone?: string;
    deliveryDate?: string;
    deliveryTime?: string;
  }
  