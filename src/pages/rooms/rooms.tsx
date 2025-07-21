import { useEffect, useState } from "react";
import { roomService } from "../../service/rooms.service";
import { Table } from "antd";
import type { Room } from "@types";
import { RoomColumns } from "../../components/table-columns";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);

  const fetchRooms = async (page = 1, limit = 3) => {
    try {
      setLoading(true);
      const response = await roomService.getRooms({ page, limit });
      setRooms(response.rooms);
      setTotal(response.total); 
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(page, limit);
  }, [page, limit]);

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  return (
    <div>
      <Table<Room>
        columns={RoomColumns}
        dataSource={rooms}
        loading={loading}
        rowKey={(row) => row.id!}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["3", "5", "10"],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Rooms;
