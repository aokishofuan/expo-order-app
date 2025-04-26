import { useEffect, useState } from 'react';
import { Order } from '../types/Order';
import { deleteOrder, subscribeOrders } from '@/lib/orderService';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  // useStateに選択状態を追加
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());


  useEffect(() => {
    const unsubscribe = subscribeOrders((ordersFromFirebase) => {
      // 重複排除（同じIDの注文を1つだけ残す）
      const uniqueOrders = Array.from(
        new Map(ordersFromFirebase.map(order => [order.id, order])).values()
      );
      setOrders(uniqueOrders);
    });
  
    // クリーンアップ（ページを閉じたら監視を止める）
    return () => unsubscribe();
  }, []);
  

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
      '配送時間名', 
      '指定日',   
      '商品コード',
      '商品名',
      '数量',
    ];
  
    const selectedOrders = orders.filter((order) => selectedOrderIds.has(order.id));
  
    const rows: string[][] = selectedOrders.flatMap((order) => {
      const createdAt = new Date(order.createdAt);
      const orderNumber = order.orderNumber; // 保存された orderNumber を使用
  
      return order.items?.map((item) => {
        if (!item) return undefined;
        return [
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
          order.deliveryTime || '',
          order.deliveryDate || '',
          item.itemCode,
          item.itemName,
          item.quantity.toString(),
        ];
      }).filter((row): row is string[] => row !== undefined) ?? [];
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

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrderIds.size === 0) return;
  
    const confirmDelete = window.confirm('選択した注文を削除しますか？');
    if (!confirmDelete) return;
  
    // 削除処理（選択された注文IDを1件ずつFirebaseから削除）
    for (const orderId of selectedOrderIds) {
      await deleteOrder(orderId);
    }
  
    // 削除が終わったら最新のデータを取得し直す
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  
    setOrders(fetchedOrders);
    setSelectedOrderIds(new Set());
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>注文一覧</h2>

      <button onClick={handleExportCSV} style={{ marginBottom: '1rem' }}>
        CSV出力
      </button>

      <button
        onClick={handleDeleteSelectedOrders}
        style={{ marginBottom: '1rem', marginLeft: '1rem' }}
        disabled={selectedOrderIds.size === 0}
      >
        選択した注文を削除
      </button>


      <table border={1} cellPadding={8} style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedOrderIds(new Set(orders.map((order) => order.id)));
                } else {
                  setSelectedOrderIds(new Set());
                }
              }}
              checked={selectedOrderIds.size === orders.length}
            />
          </th>
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
        {orders.map((order) => {
          const createdAt = new Date(order.createdAt);
          const orderNumber = order.orderNumber; // 保存された orderNumber を使用
          const isSelected = selectedOrderIds.has(order.id);

          return (
            <tr key={order.id}>
              <td>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    const newSelected = new Set(selectedOrderIds);
                    if (e.target.checked) {
                      newSelected.add(order.id);
                    } else {
                      newSelected.delete(order.id);
                    }
                    setSelectedOrderIds(newSelected);
                  }}
                />
              </td>
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
