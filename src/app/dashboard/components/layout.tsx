import { Sidebar } from "@/app/dashboard/components/sidebar";
import { Header } from "@/app/dashboard/components/header";
import { validateUserAction } from "../../actions/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateUserAction();
  return (
    <div className="relative min-h-screen">
      {session && (
        <Header
          user={{ name: session.name ?? "", email: session.email ?? "" }}
        />
      )}
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background/95 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
