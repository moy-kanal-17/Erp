import { CheckCircle, Mail, Phone, User, XCircle } from "lucide-react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddTeacherorStudentModal from "./single-modal";
const GroupStudent = ({ students, id }: any) => {
	const [open, setOpen] = useState(false);
	const [addingTeacher, setAddingTeacher] = useState(true)
	// console.log(students)
	const toggle = () => {
		setOpen(!open);
	};
	return (
		<>
			{open && (
				<AddTeacherorStudentModal
					open={open}
					toggle={toggle}
					addingTeacher={addingTeacher}
					groupId={+id!}
				/>
			)}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<User className="w-5 h-5 text-green-600" />
							<h3 className="text-lg font-medium text-gray-900">Students</h3>
							<span className="bg-green-50 text-green-700 text-sm px-2 py-1 rounded-md">
								{students.filter((s:any) => s.is_active).length}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
								onClick={() => {
									setOpen(true);
									setAddingTeacher(true);
								}}
							>
								<FaPlus className="w-4 h-4" />
								Add Teacher
							</button>
							<button
								type="button"
								className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700 cursor-pointer"
								onClick={() => {
									setOpen(true);
									setAddingTeacher(false);
								}}
							>
								<FaPlus className="w-4 h-4" />
								Add Student
							</button>
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Students
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Phone
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Mail
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Birth date
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{students.map((student:any) => (
								<tr key={student.student.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
												<span className="text-green-700 font-medium">
													{student.student.first_name?.charAt(0)}
												</span>
											</div>
											<div>
												<p className="font-medium text-gray-900">
													{student.student.first_name} {student.last_name}
												</p>
												<p className="text-sm text-gray-500 capitalize">
													{student.student.gender}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-1 text-sm text-gray-900">
											<Phone className="w-4 h-4 text-gray-400" />
											{student.student.phone}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-1 text-sm text-gray-900">
											<Mail className="w-4 h-4 text-gray-400" />
											{student.student.email}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
												student.status
													? "bg-green-50 text-green-700"
													: "bg-red-50 text-red-700"
											}`}
										>
											{student.status ? (
												<>
													<CheckCircle className="w-3 h-3 mr-1" />
													Active
												</>
											) : (
												<>
													<XCircle className="w-3 h-3 mr-1" />
													Disactive
												</>
											)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{new Date(student.student.date_of_birth).toLocaleDateString(
											"uz-UZ"
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default React.memo(GroupStudent);