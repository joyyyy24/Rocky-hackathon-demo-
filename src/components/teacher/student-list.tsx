import { StudentWithProgress } from "@/lib/teacher-data";
import { StudentRow } from "./student-row";

interface StudentListProps {
  students: StudentWithProgress[];
  onStudentClick: (student: StudentWithProgress) => void;
}

export function StudentList({ students, onStudentClick }: StudentListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Student Progress</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {students.map((studentWithProgress) => (
          <StudentRow
            key={studentWithProgress.student.id}
            studentWithProgress={studentWithProgress}
            onClick={() => onStudentClick(studentWithProgress)}
          />
        ))}
      </div>
    </div>
  );
}
