import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold">Agnos Frontend Test</h1>
      <div className="flex gap-4">
        <Link
          href="/patient-form"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Patient Form
        </Link>
        <Link
          href="/staff-view"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Go to Staff View
        </Link>
      </div>
    </main>
  );
}
