// Placeholder component for student dashboard
export default function StudentDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold">Explore World</h2>
        <p>Enter the 3D world to explore regions and complete challenges.</p>
        <a href="/world" className="text-blue-500 hover:underline">
          Go to World
        </a>
      </div>
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold">My Progress</h2>
        <p>View your completed challenges and achievements.</p>
      </div>
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold">AI Companion</h2>
        <p>Chat with your AI friend for hints and encouragement.</p>
      </div>
    </div>
  );
}
