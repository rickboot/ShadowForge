import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="flex justify-center gap-6 p-12">
      <div className="h-120 w-240 rounded border border-[color:var(--border)] p-4">
        <div>
          <h1>About</h1>
          <p>Howdy</p>
        </div>
      </div>
    </main>
  );
}
