import { Modal, Tag, Typography } from "antd";
const { Title, Text } = Typography;
const LessonInfo = ({ open, toggle, lesson }: any) => {
	return (
		<>
			<Modal
				title={
					<Title level={3} style={{ color: "#000", margin: 0 }}>
						Lesson Details
					</Title>
				}
				open={open}
				onCancel={toggle}
				footer={null}
				style={{ top: "20px" }}
				width={400}
			>
				<div
					style={{
						padding: "20px",
						background: "#fafafa",
						borderRadius: "8px",
					}}
				>
					<Text
						strong
						style={{ display: "block", marginBottom: "10px", color: "#333" }}
					>
						{lesson.title}
					</Text>
					<Text
						type="secondary"
						style={{ display: "block", marginBottom: "15px" }}
					>
						{lesson.notes}
					</Text>
					<div style={{ marginBottom: "15px" }}>
						<Text strong style={{ marginRight: "10px" }}>
							Date:
						</Text>
						<Text>{new Date(lesson.date).toLocaleDateString()}</Text>
					</div>
					<div style={{ marginBottom: "15px" }}>
						<Text strong style={{ marginRight: "10px" }}>
							Status:
						</Text>
						<Tag color={lesson.status === "yangi" ? "blue" : "red"}>
							{lesson.status}
						</Tag>
					</div>
					<div style={{ marginBottom: "15px" }}>
						<Text strong style={{ marginRight: "10px" }}>
							Group:
						</Text>
						<Text>{lesson.group.name}</Text>
					</div>
					<div>
						<Text strong style={{ marginRight: "10px" }}>
							Room:
						</Text>
						<Text>{lesson.room.name}</Text>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default LessonInfo;