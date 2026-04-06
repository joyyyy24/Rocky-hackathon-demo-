// Placeholder component for teacher dashboard
export default function TeacherDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold">Assign Challenges</h2>
        <p>Create and assign building challenges to students.</p>
      </div>
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold">Student Progress</h2>
        <p>View progress reports for all students.</p>
      </div>
    </div>
  );
}
