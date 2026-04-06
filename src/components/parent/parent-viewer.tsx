// Placeholder component for parent viewer
export default function ParentViewer() {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-semibold">Child&apos;s World</h2>
      <p>Explore your child&apos;s built world and completed challenges.</p>
      <a href="/world" className="text-blue-500 hover:underline">
        View World
      </a>
    </div>
  );
}
