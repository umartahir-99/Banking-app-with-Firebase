import { Routes, Route } from "react-router-dom";
import ViewTransactions from "./ViewTransactions";


const Transactions = () => {
  return (
    <Routes>
      <Route path="/" element={<ViewTransactions />} />

    </Routes>
  );
};

export default Transactions;
