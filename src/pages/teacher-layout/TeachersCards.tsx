// import { Table, Tag } from 'antd';
// import { useTeachers } from '@hooks';

// const TeachersTable = ({ search }: { search: string }) => {
//   const { data = [] } = useTeachers({page: 1,
//   limit: 3});

//   const filtered = data.filter((t: any) =>
//     t.first_name.toLowerCase().includes(search.toLowerCase())
//   );

//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'first_name',
//       key: 'first_name',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       key: 'phone',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'is_active',
//       render: (active: boolean) =>
//         active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
//     },
//   ];

//   return <Table columns={columns} dataSource={filtered} rowKey="id" />;
// };

// export default TeachersTable;
