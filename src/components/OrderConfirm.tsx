type OrderItem = {
    code: string;
    name: string;
    quantity: number;
  };
  
  type OrderData = {
    name: string;
    postalCode: string;
    address: string;
    phone: string;
    deliveryDate: string;
    deliveryTime: string;
    items: OrderItem[];
  };
  
  type OrderConfirmProps = {
    orderData: OrderData;
    onBack: () => void;
    onSubmit: () => void;
  };
  
  export const OrderConfirm: React.FC<OrderConfirmProps> = ({ orderData, onBack, onSubmit }) => {
    const { name, postalCode, address, phone, deliveryDate, deliveryTime, items } = orderData;
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">ご注文内容確認</h2>
  
        <div className="mb-4">
          <p><strong>お名前：</strong>{name}</p>
          <p><strong>郵便番号：</strong>{postalCode}</p>
          <p><strong>住所：</strong>{address}</p>
          <p><strong>電話番号：</strong>{phone}</p>
          <p><strong>お届け日：</strong>{deliveryDate}</p>
          <p><strong>お届け時間：</strong>{deliveryTime}</p>
        </div>
  
        <div className="mb-4">
          <h3 className="font-bold">商品内容</h3>
          <ul className="list-disc ml-6">
            {items.map((item, index) => (
              <li key={index}>
                {item.name}（{item.quantity}個）
              </li>
            ))}
          </ul>
        </div>
  
        <div className="flex justify-between mt-6">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onBack}>
            戻る
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onSubmit}>
            登録する
          </button>
        </div>
      </div>
    );
  };
  