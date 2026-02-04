import { Route, Routes,Navigate } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import Dashboard from './Dashboard'
import ProtectedRoute from '../components/Misc/ProtectedRoute'
import { useAuth } from '../context/Auth'

import ViewTransactions from './Transactions'
import Account from './Account'
const Index = () => {
  const {isAuth} = useAuth()
  return (
    
    <Routes>
       
        <Route path= "/*" element ={<Frontend/>}/>
        <Route path= "/auth/*" element ={<Auth/>}/>
        {/* <Route path= "/auth/*" element ={!isAuth ?<Auth/>:<Navigate to ="/dashboard"/>}/> */}
        <Route path= "/dashboard/*" element ={<ProtectedRoute Component={ Dashboard}/>}/>
                      <Route path="/account/*" element={<ProtectedRoute Component={ Account }/>}/>

              <Route path="/transactions/*" element={<ProtectedRoute Component={ ViewTransactions}/>}/>

    </Routes>
  )
}

export default Index

