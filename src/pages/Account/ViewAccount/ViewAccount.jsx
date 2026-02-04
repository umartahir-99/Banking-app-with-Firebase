import { useNavigate } from "react-router-dom";
import { Typography, Button, Table, Dropdown, Modal, Input } from "antd";
import { useEffect, useState } from "react";
import { ArrowRightOutlined, MoreOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/Auth";
import { collection, deleteDoc, doc, getDocs, getDoc, orderBy, query, where, updateDoc, addDoc } from "firebase/firestore";
import { firestore } from "../../../config/firebase";
import dayjs from "dayjs";
const { Title, Text } = Typography;


const ViewAccount = () => {
  const {user} = useAuth()
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(""); // "deposit" or "withdraw"
  const [transactionAmount, setTransactionAmount] = useState("");


  const navigate = useNavigate();

  const getUsers = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const q = query(
        collection(firestore, "accounts"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const array = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        array.push({ ...data, id: doc.id, key: doc.id });
      });
      setUsers(array);
    } catch (error) {
      console.error("Error fetching users: ", error);
      window.toastify("Failed to fetch accounts. Check console for details.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user?.uid) {
      getUsers();
    }
  }, [user]);

  const handleDelete = async (user) => {
    try{

      await deleteDoc(doc(firestore, "accounts", user.id));
      const filteredUsers = users.filter((item) => item.id !== user.id);
      setUsers(filteredUsers)
      window.toastify("User deleted successfully", "success");
}
catch(error){
  console.error(error)
}
   
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleTransaction = async () => {
    const amt = parseFloat(transactionAmount);
    if (isNaN(amt) || amt <= 0) {
      return window.toastify("Please enter a valid amount", "error");
    }
    const currentBalance = selectedUser.balance !== undefined ? selectedUser.balance : (selectedUser.initialDeposit || 0);
    if (transactionType === "withdraw" && amt > currentBalance) {
      return window.toastify("Insufficient balance", "error");
    }

    try {
      const accountRef = doc(firestore, "accounts", selectedUser.id);
      let newBalance;
      if (transactionType === "deposit") {
        newBalance = currentBalance + amt;
      } else {
        newBalance = currentBalance - amt;
      }
      await updateDoc(accountRef, { balance: newBalance });

      // Add transaction
      await addDoc(collection(firestore, "transactions"), {
        userId: user.uid,
        accountId: selectedUser.id,
        accountNumber: selectedUser.accountNumber,
        accountType: selectedUser.accountType,
        fullName: selectedUser.fullName,
        type: transactionType === "deposit" ? "Deposit" : "Withdraw",
        amount: amt,
        balanceAfter: newBalance,
        time: new Date(),
      });

      window.toastify(`${transactionType === "deposit" ? "Deposit" : "Withdrawal"} successful`, "success");
      setTransactionModalVisible(false);
      setTransactionAmount("");
      
      // Fetch updated account data
      const updatedAccountDoc = await getDoc(accountRef);
      if (updatedAccountDoc.exists()) {
        const updatedData = { ...updatedAccountDoc.data(), id: updatedAccountDoc.id, key: updatedAccountDoc.id };
        setSelectedUser(updatedData);
      }
      
      // Refresh accounts list
      await getUsers();
    } catch (error) {
      console.error("Error processing transaction:", error);
      window.toastify("Transaction failed", "error");
    }
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName" },
    { title: "CNIC", dataIndex: "cnic" },
    { title: "Account Number", dataIndex: "accountNumber" },
    {
      title: "Account Type",
      dataIndex: "accountType",
      render: (text) => <Text className="text-capitalize">{text}</Text>,
    },  
    {title: "Branch Code" , dataIndex: "branchCode"},
    {title: "Initial Deposit" , dataIndex: "initialDeposit"},
     

       {
      title: "Date Created",
      dataIndex: "createdAt",
      render: (text) => (
        <Text className="text-capitalize">
          {dayjs(text).format("dddd, DD-MMM-YY, hh:mm:ss A")}
        </Text>
      ),
    },

    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <Button
          className="!border-0"
          icon={<MoreOutlined />}
          onClick={() => {
            setSelectedUser(record);
            setIsModalOpen(true);
          }}
        />
      ),
    },
  ];
  return (
    <main className="py-5">
      <div className="container">
        <div className="card px-3 py-4 bg-white rounded-lg shadow-lg">
          {/* ✅ Removed mx-auto and max-w-[500px] */}

          <Title level={1} className="text-center">
            Accounts
          </Title>

          <Button
            className="mb-5"
            type="primary"
            size="medium"
            onClick={() => {
              navigate("/account/create-account");
            }}
          >
            Create Account
          </Button>
            <div className="flex items-center gap-4 mb-6">
          <Button shape="circle" icon={<ArrowRightOutlined />} onClick={() => navigate('/transactions')} />
       </div>

          <Table columns={columns} dataSource={users} loading={isLoading} />
        </div>
      </div>
     

     <Modal

  open={isModalOpen}
  onOk={handleOk}
  onCancel={handleCancel}
  footer={null}
  width={650}
  centered
  styles={{ body: { padding: '24px' } }}
>
  <Title level={1}>Account Details</Title>


  {selectedUser && (
    <div style={{ fontSize: '15px' }}>
      <p style={{ marginBottom: '16px' }}>
        <strong>Full Name:</strong> {selectedUser.fullName}
      </p>
      <p style={{ marginBottom: '16px' }}>
        <strong>CNIC:</strong> {selectedUser.cnic}
      </p>
      <p style={{ marginBottom: '16px' }}>
        <strong>Account Number:</strong> {selectedUser.accountNumber}
      </p>
      <p style={{ marginBottom: '16px' }}>
        <strong>Account Type:</strong> {selectedUser.accountType}
      </p>
      <p style={{ marginBottom: '16px' }}>
        <strong>Branch Code:</strong> {selectedUser.branchCode}
      </p>
      <p style={{ marginBottom: '24px' }}>
        <strong>Date Created:</strong> {dayjs(selectedUser.createdAt).format("dddd, DD-MMM-YY, hh:mm:ss A")}
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center',
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0'
      }}>
        
        <Button 
          type="primary" 
          size="large"
          onClick={() => {
            setTransactionType("withdraw");
            setTransactionModalVisible(true);
          }}
        >
          Withdraw
        </Button>
        <Button 
          type="primary" 
          size="large"
          onClick={() => {
            setTransactionType("deposit");
            setTransactionModalVisible(true);
          }}
        >
          Deposit
        </Button>
        <Button 
          danger 
          size="large"
          onClick={() => { handleDelete(selectedUser); handleCancel(); }}
        >
          Delete
        </Button>
      </div>
    </div>
  )}
</Modal>

<Modal
  title={`${transactionType === "deposit" ? "Deposit" : "Withdraw"} Amount`}
  open={transactionModalVisible}
  onCancel={() => setTransactionModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setTransactionModalVisible(false)}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={handleTransaction}>
      {transactionType === "deposit" ? "Deposit" : "Withdraw"}
    </Button>,
  ]}
>
  <Input
    type="number"
    placeholder="Enter amount"
    value={transactionAmount}
    onChange={(e) => setTransactionAmount(e.target.value)}
  />
</Modal>

    </main>
  );
};

export default ViewAccount;
