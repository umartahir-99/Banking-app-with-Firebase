import { useState,useEffect } from 'react';
import { 
  Table, Button, Typography, Modal, Descriptions 
} from 'antd';
import { 
  ArrowLeftOutlined, SwapOutlined, CloseOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { useAuth } from '../../context/Auth';

const { Title } = Typography;

export default function ViewTransactions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(firestore, "transactions"), 
        where("userId", "==", user.uid),
        orderBy("time", "desc")
      );
      const querySnapshot = await getDocs(q);
      const txs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      window.toastify("Failed to fetch transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Transaction Id', dataIndex: 'id', key: 'id', ellipsis: true },
    { 
        title: 'Time', 
        dataIndex: 'time', 
        key: 'time', 
        render: (ts) => ts ? new Date(ts.seconds * 1000).toLocaleString() : 'N/A' 
    },
    { title: 'Account No#', dataIndex: 'accountNumber', key: 'accountNumber' },
    { title: 'Type', dataIndex: 'accountType', key: 'accountType' },
    { 
        title: 'Amount', 
        dataIndex: 'amount', 
        key: 'amount', 
        render: (val, record) => <span style={{ color: record.type === 'Deposit' ? 'green' : 'red' }}>{val}</span> 
    },
    // { title: 'Balance After', dataIndex: 'balanceAfter', key: 'balanceAfter' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          onClick={() => { setSelectedTransaction(record); setDetailsVisible(true); }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
       <div className="flex items-center gap-4 mb-6">
          <Button shape="circle" icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard')} />
          <Title level={2} style={{ margin: 0 }}><SwapOutlined /> Transactions</Title>
       </div>
 

       <Table 
          columns={columns} 
          dataSource={transactions} 
          rowKey="id" 
          loading={loading} 
          scroll={{ x: true }}
       />

        {/* Transaction Details Modal */}
        <Modal
          title="Transaction Details"
          open={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
          footer={null}
          closeIcon={<CloseOutlined />}
        >
          {selectedTransaction && (
             <Descriptions column={1} bordered size="small" labelStyle={{ fontWeight: 'bold' }}>
                <Descriptions.Item label="Account No#">{selectedTransaction.accountNumber}</Descriptions.Item>
                <Descriptions.Item label="Name">{selectedTransaction.fullName}</Descriptions.Item>
                <Descriptions.Item label="Time">{selectedTransaction.time ? new Date(selectedTransaction.time.seconds * 1000).toLocaleString() : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Type">{selectedTransaction.accountType}</Descriptions.Item>
                <Descriptions.Item label="Transaction Type">{selectedTransaction.type}</Descriptions.Item>
                <Descriptions.Item label="Amount">{selectedTransaction.amount}</Descriptions.Item>
                {/* <Descriptions.Item label="Balance After">{selectedTransaction.balanceAfter}</Descriptions.Item> */}
             </Descriptions>
          )}
       </Modal>
    </div>
  );
}