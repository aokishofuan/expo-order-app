import { useEffect, useState } from 'react';
import { Order } from '../types/Order';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      const parsedOrders: Order[] = JSON.parse(storedOrders);

      // 重複排除（同じIDの注文を1つだけ残す）
      const uniqueOrders = Array.from(
        new Map(parsedOrders.map(order => [order.id, order])).values()
      );

      setOrders(uniqueOrders);
    }
  }, []);

  const formatOrderNumber = (index: number, date: Date) => {
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
    const serial = String(index + 1).padStart(3, '0');
    return `expo${yyyymmdd}-${serial}`;
  };

  const handleExportCSV = () => {
    const headers = [
      'ショップ受注番号',
      '受注日時',
      '注文者名',
      '注文者郵便番号',
      '注文者住所',
      '注文者電話番号',
      '支払方法',
      '配送先名',
      '配送先郵便番号',
      '配送先住所',
      '配送先電話番号',
      '配送方法名',
      '指定日',
      '配送時間名',
      '商品コード',
      '商品名',
      '数量',
    ];

    const rows: string[][] = orders.flatMap((order, index) => {
      const createdAt = new Date(order.createdAt);
      const orderNumber = formatOrderNumber(index, createdAt);

      return order.items.map((item) => [
        orderNumber,
        createdAt.toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        order.name,
        order.postalCode,
        order.address,
        order.phone,
        '前払い',
        order.receiverName,
        order.receiverPostalCode,
        order.receiverAddress,
        order.receiverPhone,
        'ヤマト運輸',
        order.deliveryDate || '',
        order.deliveryTime || '',
        item.itemCode,
        item.itemName,
        item.quantity.toString(),
      ]);
    });

    const csvContent =
      [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>注文一覧</h2>

      <button onClick={handleExportCSV} style={{ marginBottom: '1rem' }}>
        CSV出力
      </button>

      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ショップ受注番号</th>
            <th>お名前</th>
            <th>郵便番号</th>
            <th>住所</th>
            <th>電話番号</th>
            <th>商品内容</th>
            <th>お届け日</th>
            <th>お届け時間</th>
            <th>受付日時</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            const createdAt = new Date(order.createdAt);
            const orderNumber = formatOrderNumber(index, createdAt);

            return (
              <tr key={order.id}>
                <td>{orderNumber}</td>
                <td>{order.name}</td>
                <td>{order.postalCode}</td>
                <td>{order.address}</td>
                <td>{order.phone}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.itemCode}>
                      {item.itemName} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td>{order.deliveryDate || '—'}</td>
                <td>{order.deliveryTime || '—'}</td>
                <td>{createdAt.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
