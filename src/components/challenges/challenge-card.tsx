// Placeholder component for challenge display
export default function ChallengeCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{description}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Start Challenge
      </button>
    </div>
  );
}
