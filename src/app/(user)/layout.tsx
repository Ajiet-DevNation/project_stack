import Navbar from "@/components/Navbar"; // adjust path as needed

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-32">
        {children}
      </main>
      <Navbar />
    </div>
  );
}