import { Routes,Route } from "react-router-dom"
import Dashboard from "../Dashboard"
import Account from "../Account"
import Home from "./Home/Home"

const Frontend = () => {
  return (
    <Routes>

      <Route path="/"element={<Home/>}/>
      <Route path="/dashboard/*" element = {<Dashboard/>}/>
            <Route path='/account/*' element={<Account/>}/> 


      
    </Routes>
  )
}

export default Frontend
