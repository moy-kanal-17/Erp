import { CheckCircle, GraduationCap, XCircle } from "lucide-react";
import React from "react";
const GroupTeachers = ({ teachers }: any) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200">
			<div className="p-6 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<GraduationCap className="w-5 h-5 text-blue-600" />
						<h3 className="text-lg font-medium text-gray-900">Teachers</h3>
						<span className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md">
							{teachers.length}
						</span>
					</div>
				</div>
			</div>

			<div className="p-6 space-y-4">
				{teachers.map((teacher:any) => (
					<div
						key={teacher.id}
						className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
					>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
								<span className="text-blue-700 font-medium text-lg">
									{teacher.teacher.first_name?.charAt(0)}
								</span>
							</div>
							<div>
								<p className="font-medium text-gray-900">
									{teacher.teacher.first_name} {teacher.last_name}
								</p>
								<p className="text-sm text-gray-500">{teacher.role}</p>
								<p className="text-sm text-gray-400">{teacher.phone}</p>
							</div>
						</div>
						<div className="text-right">
							<span
								className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
									teacher.status
										? "bg-green-50 text-green-700"
										: "bg-red-50 text-red-700"
								}`}
							>
								{teacher.status ? (
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
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default React.memo(GroupTeachers);