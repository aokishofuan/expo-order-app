import React, { useState } from 'react';
import { Order, OrderItem } from '../types/Order';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onAddOrder: (order: Order) => void;
}

const PRODUCTS = [
  { itemName: '月化粧(4個入)', itemCode: '035604' },
  { itemName: '月化粧(6個入)', itemCode: '035606' },
  { itemName: '月化粧(10個入)', itemCode: '035610' },
  { itemName: '月化粧(16個入)', itemCode: '035616' },
  { itemName: '伊右衛門月化粧(4個入)', itemCode: '009514' },
  { itemName: '伊右衛門月化粧(6個入)', itemCode: '009515' },
  { itemName: '伊右衛門月化粧(10個入)', itemCode: '009516' },
  { itemName: '金の月化粧(10個入)', itemCode: '009056' },
  { itemName: 'ワンピース月化粧(5個入)', itemCode: '009064' },
  { itemName: '月化粧サブレ(6枚入)', itemCode: '036806' },
  { itemName: '月化粧サブレ(10枚入)', itemCode: '036810' },
  { itemName: '月化粧アソートボックス', itemCode: '009640' },
];

const OrderForm: React.FC<Props> = ({ onAddOrder }) => {
  const [name, setName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('指定なし');
  const [isSameReceiver, setIsSameReceiver] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPostalCode, setRecipientPostalCode] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({
    '月化粧(4個入)': '',
    '月化粧(6個入)': '',
    '月化粧(10個入)': '',
    '月化粧(16個入)': '',
    '伊右衛門月化粧(4個入)': '',
    '伊右衛門月化粧(6個入)': '',
    '伊右衛門月化粧(10個入)': '',
    '金の月化粧(10個入)': '',
    'ワンピース月化粧(5個入)': '',
    '月化粧サブレ(6枚入)': '',
    '月化粧サブレ(10枚入)': '',
    '月化粧アソートボックス': '',
  });
  

  const [showConfirm, setShowConfirm] = useState(false);

  const items: OrderItem[] = PRODUCTS.map((product) => {
    const quantityStr = quantities[product.itemName];
    const quantity = parseInt(quantityStr);
    if (!isNaN(quantity) && quantity > 0) {
      return {
        itemName: product.itemName,
        itemCode: product.itemCode,
        quantity,
      };
    }
    return null;
  }).filter((item) => item !== null) as OrderItem[];
  

    const handleConfirm = () => {
      const hasItems = Object.values(quantities).some((q) => q !== '' && parseInt(q) > 0);
      if (!hasItems) {
        alert('商品を1つ以上選択してください');
        return;
      }
      setShowConfirm(true);
    };
    

  const handleSubmit = () => {
    const now = new Date();
    const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
    const storedOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const todaysOrders = storedOrders.filter((order) =>
      order.createdAt.startsWith(now.toISOString().slice(0, 10))
    );
    const orderNumber = `expo${yyyymmdd}-${String(todaysOrders.length + 1).padStart(3, '0')}`;

    const newOrder: Order = {
      id: uuidv4(),
      createdAt: now.toISOString(),
      orderNumber,
      name,
      postalCode,
      address,
      phone,
      deliveryDate,
      deliveryTime,
      isSameReceiver: isSameReceiver,
      receiverName: isSameReceiver ? name : recipientName,
      receiverPostalCode: isSameReceiver ? postalCode : recipientPostalCode,
      receiverAddress: isSameReceiver ? address : recipientAddress,
      receiverPhone: isSameReceiver ? phone : recipientPhone,
      items,
    };

    const updatedOrders = [...storedOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    onAddOrder(newOrder);

    // 入力をリセット
    setName('');
    setPostalCode('');
    setAddress('');
    setPhone('');
    setDeliveryDate('');
    setDeliveryTime('指定なし');
    setIsSameReceiver(true);
    setRecipientName('');
    setRecipientPostalCode('');
    setRecipientAddress('');
    setRecipientPhone('');
    setQuantities({
      '月化粧(4個入)': '',
      '月化粧(6個入)': '',
      '月化粧(10個入)': '',
      '月化粧(16個入)': '',
      '伊右衛門月化粧(4個入)': '',
      '伊右衛門月化粧(6個入)': '',
      '伊右衛門月化粧(10個入)': '',
      '金の月化粧(10個入)': '',
      'ワンピース月化粧(5個入)': '',
      '月化粧サブレ(6枚入)': '',
      '月化粧サブレ(10枚入)': '',
      '月化粧アソートボックス': '',
    });
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div style={{ maxWidth: 500, margin: 'auto' }}>
        <h2>確認画面</h2>
        <p><strong>お名前:</strong> {name}</p>
        <p><strong>郵便番号:</strong> {postalCode}</p>
        <p><strong>住所:</strong> {address}</p>
        <p><strong>電話番号:</strong> {phone}</p>
        <p><strong>お届け日:</strong> {deliveryDate}</p>
        <p><strong>お届け時間:</strong> {deliveryTime}</p>
        <p><strong>お届け先:</strong></p>
        <p>{isSameReceiver ? '注文者と同じ' : (
          <>
            {recipientName}<br />
            {recipientPostalCode}<br />
            {recipientAddress}<br />
            {recipientPhone}
          </>
        )}</p>
        <p><strong>商品内容:</strong></p>
        <ul>
          {items.map((item) => (
            <li key={item.itemCode}>{item.itemName} × {item.quantity}</li>
          ))}
        </ul>

        <button onClick={() => setShowConfirm(false)}>戻る</button>{' '}
        <button onClick={handleSubmit}>注文を確定する</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>ご注文者様情報</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>お名前</label><br />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>郵便番号</label><br />
        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>住所</label><br />
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>電話番号</label><br />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>

      <h2>お届け先</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input type="checkbox"   
          checked={isSameReceiver}
          onChange={(e) => setIsSameReceiver(e.target.checked)} />
          ご注文者様とお届け先が同じ
        </label>
      </div>

      {!isSameReceiver && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label>お届け先お名前</label><br />
            <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>お届け先郵便番号</label><br />
            <input type="text" value={recipientPostalCode} onChange={(e) => setRecipientPostalCode(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>お届け先住所</label><br />
            <input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>お届け先電話番号</label><br />
            <input type="text" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} required />
          </div>
        </>
      )}

      <h2>商品選択</h2>
      {PRODUCTS.map((product) => (
        <div key={product.itemName} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ width: '200px' }}>{product.itemName}</label>
          <input
            type="number"
            min="0"
            value={quantities[product.itemName]}
            onChange={(e) =>
              setQuantities({
                ...quantities,
                [product.itemName]: e.target.value,
              })
            }
            style={{ width: '80px', marginLeft: '1rem' }}
          />

           <span style={{ marginLeft: '0.5rem' }}>個</span>
        </div>
      ))}


      <h2>お届け指定</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>お届け日</label><br />
        <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>お届け時間</label><br />
        <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
          <option value="指定なし">指定なし</option>
          <option value="午前中">午前中</option>
          <option value="14:00〜16:00">14:00〜16:00</option>
          <option value="16:00〜18:00">16:00〜18:00</option>
          <option value="19:00〜21:00">19:00〜21:00</option>
        </select>
      </div>

      <button type="submit">確認画面へ</button>
    </form>
  );
};

export default OrderForm;
