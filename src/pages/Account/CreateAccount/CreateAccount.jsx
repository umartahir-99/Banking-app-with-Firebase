import { Typography, Form, Input, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../context/Auth";
import { addDoc,collection, setDoc,doc } from "firebase/firestore";
import { firestore } from "../../../config/firebase";

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;

const CreateAccount = () => {
  const initialState = {
  fullName: "",
  cnic: "",
  accountNumber: "",
  branchCode: "",
  initialDeposit: "",
  accountType: "",  
  };

  const { user } = useAuth();

  const [state, setState] = useState(initialState);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async() => {
    let { fullName, cnic, accountNumber, branchCode, initialDeposit, accountType    } = state;
    fullName = fullName.trim();
    if(!/^[a-zA-Z\s]+$/.test(fullName)){return window.toastify("Name must be in alphabets", "error")}
    if(cnic.length !== 13){return window.toastify("Please enter valid CNIC", "error")}
    if(accountNumber.length !== 9){return window.toastify("Please enter valid account number", "error")}
    if(branchCode.length !== 2){return window.toastify("Please enter valid branch code", "error")}
    if(initialDeposit < 500){return window.toastify("Please enter valid initial deposit", "error")}
    if(accountType.length < 3){return window.toastify("Please enter valid account type", "error")}
    

    const initialDepositNumber = Number(initialDeposit);
    if (Number.isNaN(initialDepositNumber) || initialDepositNumber <= 0) {
      return window.toastify("Please enter valid initial deposit", "error");
    }

    const userData = { 
      fullName, 
      cnic, 
      accountNumber, 
      branchCode, 
      initialDeposit: initialDepositNumber, 
      accountType,
      balance: initialDepositNumber,
    };
    userData.uid = user.uid;
    userData.id =   window.getRandomId();
    userData.status = "active";
    userData.isCompleted = false;
    userData.createdAt = new Date().getTime();
   

      setIsProcessing(true);

    try {
  await setDoc(doc(firestore, "accounts", userData.id), userData);

  // Store initial deposit as the first transaction for this account
  await addDoc(collection(firestore, "transactions"), {
    userId: user.uid,
    accountId: userData.id,
    accountNumber: userData.accountNumber,
    accountType: userData.accountType,
    fullName: userData.fullName,
    type: "Deposit",
    amount: initialDepositNumber,
    balanceAfter: initialDepositNumber,
    time: new Date(),
  });

  window.toastify("A new account has been successfully created", "success");
  navigate("/account");
} catch (e) {
console.error("Error adding document: ", e);
  window.toastify("Account not created", "error");

}finally{

  setIsProcessing(false);
}
     
  };

  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <main className="auth flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="flex flex-col gap-6 w-full max-w-[900px]">
        {/* Back to Dashboard Container - Positioned Above */}
        <div className="card p-4 bg-white rounded-lg shadow-lg flex justify-start animate-fadeIn">
          <Button 
            className="!py-4 !px-6" 
            type="primary"  
            onClick={() => { navigate("/dashboard/") }}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Create Account Container */}
        <div className="card p-8 bg-white rounded-lg shadow-lg animate-slideUp">
          <Title level={1} className="text-center mb-8">
            Create Account
          </Title>

          <Form layout="vertical">
            {/* Grid System: 2 columns, 3 inputs each */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <Item label="Full Name" required>
                <Input
                  type="text"
                  size="large"
                  placeholder="Enter full name"
                  name="fullName"
                  onChange={handleChange}
                />
              </Item>
          
              <Item label="CNIC" required>
                <Input
                  name="cnic"
                  placeholder="Enter CNIC (13 digits)"
                  onChange={handleChange}
                  size="large"
                />
              </Item>

              <Item label="Account Number" required>
                <Input
                  name="accountNumber"
                  placeholder="Enter Account Number (9 digits)"
                  onChange={handleChange}
                  size="large"
                />
              </Item>

              {/* Right Column */}
              <Item label="Branch Code" required    >
                <Input
                  name="branchCode"
                  placeholder="Enter Branch Code (2 digits)"
                  onChange={handleChange}
                  size="large"
                />
              </Item>

              <Item label="Initial Deposit" required  >
                <Input
                  name="initialDeposit"
                  placeholder="Enter Initial Deposit (Minimum 500 PKR)"
                  onChange={handleChange}
                  size="large"
                />
              </Item>

              <Item label="Account Type" required>
                <Select
                  size="large"
                  placeholder="Enter account type"
                  onChange={(accountType) => {
                    setState((s) => ({ ...s, accountType }));
                  }}
                >
                  <Option value="Saving">Saving</Option>
                  <Option value="Current">Current</Option>
                </Select>
              </Item>
            </div>

            {/* Centered Create Account Button */}
            <div className="flex justify-center mt-8">
              <Button
                type="primary"
                size="large"
                htmlType="submit"  
                loading={isProcessing}
                onClick={handleSubmit}
                className="!px-12"
              >
                Create Account
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default CreateAccount;
