import { yupResolver } from "@hookform/resolvers/yup";
import { useGroup, useTeachers } from "@hooks";

import { useQueryClient } from "@tanstack/react-query";
import type { ModalProps } from "@types";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useStudents } from "../../hooks/useStudent";

const schema = yup.object().shape({
	studentId: yup.number().required("Student must be selected"),
	teacherId: yup.number().required("Teacher must be selected"),
});

interface ThisProps extends ModalProps {
	addingTeacher: boolean;
	groupId: number;
}

const AddTeacherorStudentModal = ({
	addingTeacher,
	open,
	toggle,
	groupId,
}: ThisProps) => {
	const { useGroupAddStudent, useGroupAddTeacher } = useGroup({
		page: 1,
		limit: 100,
	});
	let originalData: any[] = [];
	if (addingTeacher) {
		const { data: teachers } = useTeachers();
		originalData = teachers ? teachers.data.data : [];
		console.log(teachers?.data.data,"teachersIN IF!");
		
	} else {
		const { data: students } = useStudents({ page: 1, limit: 100 });
		originalData = students ? students.data.students : [];
	}
	const [selected, setSelected] = useState(null);
	const [isOpen, setOpen] = useState(open);
	const [filteredData, setFilteredData] = useState(originalData);
	const { mutate: addStudent, isPending: isCreatingSt } = useGroupAddStudent();
	const { mutate: addTeacher, isPending: isCreatingTr } = useGroupAddTeacher();
	const queryClient = useQueryClient();
	const { control, handleSubmit, setValue } = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			teacherId: 0,
			studentId: 0,
		},
	});

	const onSubmit = (data: any) => {
		data["status"] = true;
		data["start_date"] = new Date().toISOString();
		data.teacherId = [data.teacherId]

		data.groupId = groupId;
		if (addingTeacher) {
			delete data.studentId;
			addTeacher(data, {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["groups", "add-teacher"],
					});
					setOpen((prev) => !prev);
				},
			});
		} else {
			delete data.teacherId;
			data.studentId = [data.studentId]
			addStudent(data, {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["groups", "add-student"],
					});
					setOpen((prev) => !prev);
				},
			});
		}
	};

	const handleChange = (e: any) => {
		const id = +e.target.value;
		if (!id) {
			setFilteredData(originalData);
		} else {
			if (!originalData) return;
			const filtered = originalData.filter((item: any) => item.id === id);
			setFilteredData(filtered);
		}
	};

	return (
		<Modal
			title={`Add ${addingTeacher ? "Teacher" : "Student"}`}
			centered
			open={isOpen}
			closeIcon
			footer={null}
			width={340}
			onCancel={toggle}
		>
			<Form
				layout="vertical"
				autoComplete="on"
				onFinish={handleSubmit(onSubmit)}
			>
				<Form.Item
					label="Teacher"
					name="teacherId"
					style={addingTeacher ? {} : { display: "none" }}
				>
					<Controller
						name="teacherId"
						control={control}
						render={() => (
							<>
								<Input
									onChange={handleChange}
									placeholder="Search by id..."
									type="number"
								/>
								<div className="mt-5 overflow-auto flex flex-wrap w-[300px] justify-center h-[150px]">
									{filteredData.map((item: any) => (
										<Button
											key={item.id}
											className="mt-0.5 w-[300px]"
											onClick={() => {
												setSelected(item);
												setValue("teacherId", item.id);
											}}
										>
											{`${item.id} - ${item.first_name} ${item.last_name}`}
										</Button>
									))}
								</div>
								<div
									style={
										selected
											? { marginTop: 10, marginLeft: 10 }
											: { display: "none", marginTop: 10, marginLeft: 10 }
									}
								>
									{selected &&
									typeof selected === "object" &&
									"id" in selected &&
									"first_name" in selected &&
									"last_name" in selected ? (
										<p style={{ fontSize: "18px", color: "#1447e6" }}>
											{`${(selected as any).id} - ${
												(selected as any).first_name
											} ${(selected as any).last_name}`}
										</p>
									) : null}
								</div>
							</>
						)}
					/>
				</Form.Item>
				<Form.Item
					label="Student"
					name="studentId"
					style={addingTeacher ? { display: "none" } : {}}
				>
					<Controller
						name="studentId"
						control={control}
						render={() => (
							<>
								<Input
									onChange={handleChange}
									placeholder="Search by id..."
									type="number"
								/>
								<div className="mt-5 overflow-auto flex flex-wrap w-[300px] justify-center h-[150px]">
									{filteredData.map((item: any) => (
										<Button
											key={item.id}
											className="mt-0.5 w-[300px]"
											onClick={() => {
												setSelected(item);
												setValue("studentId", item.id);
											}}
										>
											{`${item.id} - ${item.first_name} ${item.last_name}`}
										</Button>
									))}
								</div>
								<div
									style={
										selected
											? { marginTop: 10, marginLeft: 10 }
											: { display: "none", marginTop: 10, marginLeft: 10 }
									}
								>
									{selected &&
									typeof selected === "object" &&
									"id" in selected &&
									"first_name" in selected &&
									"last_name" in selected ? (
										<p style={{ fontSize: "18px", color: "#1447e6" }}>
											{`${(selected as any).id} - ${
												(selected as any).first_name
											} ${(selected as any).last_name}`}
										</p>
									) : null}
								</div>
							</>
						)}
					/>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={addingTeacher ? isCreatingTr : isCreatingSt}
					>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddTeacherorStudentModal;