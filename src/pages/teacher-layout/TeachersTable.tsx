// import { Card, Col, Row } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
// import { useTeachers } from '@hooks';

// const TeachersCards = () => {
//   const { data = [] } = useTeachers();


//   const total = data.length;
//   const active = data.filter((t: any) => t.is_active).length;

//   return (
//     <Row gutter={16}>
//       <Col span={6}>
//         <Card>
//           <UserOutlined style={{ fontSize: 24 }} />
//           <h3>Total Teachers</h3>
//           <p>{total}</p>
//         </Card>
//       </Col>
//       <Col span={6}>
//         <Card>
//           <UserOutlined style={{ fontSize: 24, color: 'green' }} />
//           <h3>Active Teachers</h3>
//           <p>{active}</p>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default TeachersCards;
