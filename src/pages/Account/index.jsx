import { Routes,Route } from "react-router-dom"
import ViewAccount from "./ViewAccount"
import CreateAccount from "./CreateAccount"

const Account = () => {
  return (
    <Routes>
      <Route path="/" element={<ViewAccount/>}/>
      <Route path='/create-account' element={<CreateAccount/>}/>
    </Routes>
  )
}

export default Account
