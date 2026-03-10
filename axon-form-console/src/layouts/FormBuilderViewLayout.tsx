import Navbar from '@/components/Navbar';

export default function FormBuilderViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full min-h-full'>
      <Navbar />
      <main className='mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8'>
        {children}
      </main>
    </div>
  );
}
