import Navbar from '@/components/navbar';
// import '../globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      
    </>
  );
}
