import ProtectedPage from "./dashboard/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <ProtectedPage />
      </main>
    </div>
  );
}
