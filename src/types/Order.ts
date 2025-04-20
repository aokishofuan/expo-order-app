export interface OrderItem {
    itemName: string;
    quantity: number;
    itemCode: string; // 商品コードを追加
  }
  
  export interface Order {
    id: string; // ショップ受注番号
    createdAt: string; // 受注日時
    name: string; // 注文者名
    postalCode: string;
    address: string;
    phone: string;
  
    sameAsCustomer: boolean;
    recipientName?: string;
    recipientPostalCode?: string;
    recipientAddress?: string;
    recipientPhone?: string;
  
    items: OrderItem[];
  }
  