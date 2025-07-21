import { type Group, type Room } from "@types"
import type { TableProps } from "antd"
// GROUP COLUMNS
export const GroupColumns:TableProps<Group>["columns"] = [
    {
      title: "Group",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (course:{title: string}) => <span>{course.title}</span>,
    },
    {
      title: "Start date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
]

// STUDENT COLUMNS


export const RoomColumns:TableProps<Room>["columns"] = [
  {
  title: "Name",
  dataIndex: "name",
  key: "name",
  },
  {
  title: "branchId",
  dataIndex: "branchId",
  key: "branchId",
  },
  {
  title: "capacity",
  dataIndex: "capacity",
  key: "capacity",
  },
]