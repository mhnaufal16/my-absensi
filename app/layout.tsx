import "./globals.css";

export const metadata = {
  title: "My Absensi",
  description: "Sistem Absensi Kamera & GPS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
