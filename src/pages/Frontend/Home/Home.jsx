import { Typography, Table, Card, Row, Col, Empty } from 'antd'

import { useNavigate } from 'react-router-dom'

const {Title, Text} = Typography;

const Home = () => {
 
  

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-gray-50 to-white px-4 py-8 md:px-8 lg:px-12">
      {/* Header / Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Title level={1} className="mx-auto sm:mx-0 text-gray-800 text-2xl sm:text-3xl md:text-4xl">
          Welcome to Umar Bank
        </Title>
      </div>

    </div>
  )
}

export default Home
