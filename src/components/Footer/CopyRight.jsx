import { Typography, Row, Col, Divider } from 'antd'



const {Paragraph} = Typography
const CopyRight = () => {

    const year = new Date().getFullYear()

  return (
    <footer className='w-full flex justify-center items-center py-1 bg-white mt-auto'>
        <Divider className='!border-gray-300 !my-0'>

        <div className='container'>
            <Row className='justify-center'>
                <Col>
                <Paragraph className='text-center' style={{color : 'black'}}>  © {year}. All Rights Reserved</Paragraph>
                </Col>

            </Row>
        </div>
      
        </Divider>
    </footer>
  )
}

export default CopyRight
