import Sidebar from "../../components/ui/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-gray-200 min-h-[100vh]">
      <Sidebar />
      {children}
    </main>
  );
}
