import { Card, Button, Row, Col, Typography } from "antd";
import {EyeOutlined,PlusOutlined, TransactionOutlined,} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../config/firebase";
import { useAuth } from "../../context/Auth";



const { Title } = Typography;

const Dashboard = () => {
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const getAccounts = async () => {
      if (!user?.uid) {
        setTotalAccounts(0);
        setTotalTransactions(0);
        return;
      }

      try {
        // Get user's accounts only
        const accountsQuery = query(
          collection(firestore, "accounts"),
          where("uid", "==", user.uid)
        );
        const accountsSnapshot = await getDocs(accountsQuery);
        setTotalAccounts(accountsSnapshot.size);

        // Get user's transactions only
        const transactionsQuery = query(
          collection(firestore, "transactions"),
          where("userId", "==", user.uid)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        setTotalTransactions(transactionsSnapshot.size);
      } catch (error) {
        console.error("Error fetching accounts: ", error);
        window.toastify("Failed to fetch dashboard data", "error");
      }
    };
    getAccounts();
  }, [user]);


  return (
    <>
  

      <div className="dashboard-container mt-10">
        <Row gutter={[20, 32]} justify="center" className="cards-row">
          {/* Accounts Card */}
          <Col xs={24} sm={20} md={12} lg={10} xl={8}>
            <Card
              bordered={false}
              className={`
        dashboard-card accounts-card
        rounded-2xl overflow-hidden shadow-lg
        hover:shadow-2xl hover:-translate-y-2
        transition-all duration-500 ease-out
        animate-scaleIn
      `}
              headStyle={{
                background: "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)",
                color: "white",
                borderRadius: "10px 10px 0 0",
                textAlign: "center",
              }}
              title="Accounts"
            >
              <div className="p-8 pt-10 pb-12 flex flex-col items-center gap-8">
                {/* Total display */}
                <div className="text-center">
                  <div className="text-gray-600 text-base font-medium">
                    Total Accounts
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                    {totalAccounts}
                  </div>
                  
                </div>

                {/* Buttons horizontal */}
                <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    size="large"
                    className={`
              flex-1 max-w-[240px] h-12 text-base font-medium
              bg-gradient-to-r from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              shadow-md hover:shadow-lg hover:scale-[1.03]
              transition-all duration-300
            `}
                    onClick={() =>{
                      navigate("/account")
                    }}
                  >
                    View Accounts
                  </Button>

                  <Button
                    icon={<PlusOutlined />}
                    size="large"
                    className={`
              flex-1 max-w-[240px] h-12 text-base font-medium
              border border-blue-600 text-blue-600
              hover:bg-blue-600 hover:text-white hover:border-transparent
              shadow-md hover:shadow-lg hover:scale-[1.03]
              transition-all duration-300
            `}
                    onClick={() => {
                      navigate("/account/create-account")
                    }}
                  >
                    Add New Account
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          {/* Transactions Card */}
          <Col xs={24} sm={20} md={12} lg={10} xl={8}>
            <Card
              bordered={false}
              className={`
        dashboard-card transactions-card
        rounded-2xl overflow-hidden shadow-lg
        hover:shadow-2xl hover:-translate-y-2
        transition-all duration-500 ease-out
        animate-scaleIn
      `}
              headStyle={{
                background: "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)",
                color: "white",
                borderRadius: "10px 10px 0 0",
                textAlign: "center",
              }}
              title="Transactions"
            >
              <div className="p-8 pt-10 pb-12 flex flex-col items-center gap-8">
                {/* Total display */}
                <div className="text-center">
                  <div className="text-gray-600 text-base font-medium">
                    Total Transactions
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mt-1">
                    {totalTransactions}
                  </div>
                  {/* Replace with real data later */}
                </div>

                {/* Single button centered */}
                <Button
                  type="primary"
                  icon={<TransactionOutlined />}
                  size="large"
                  className={`
            min-w-[240px] h-12 text-base font-medium px-8
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            shadow-md hover:shadow-lg hover:scale-[1.03]
            transition-all duration-300
          `}
                  onClick={() => {
                    navigate("/transactions")
                  }}
                >
                  View Transactions
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

    </>
  );
};

export default Dashboard;
