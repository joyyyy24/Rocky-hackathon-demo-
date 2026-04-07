import { StudentWithProgress } from "@/lib/teacher-data";
import { StudentProgressionProfile } from "@/lib/student-progression";
import { StudentRow } from "./student-row";

interface StudentListProps {
  students: StudentWithProgress[];
  progressionMap: Record<string, StudentProgressionProfile>;
  onStudentClick: (student: StudentWithProgress) => void;
}

export function StudentList({ students, progressionMap, onStudentClick }: StudentListProps) {
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
            progression={progressionMap[studentWithProgress.student.id]}
            onClick={() => onStudentClick(studentWithProgress)}
          />
        ))}
      </div>
    </div>
  );
}
