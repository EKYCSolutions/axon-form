export default function FormBuilderViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='w-full h-full px-32 pt-4'>{children}</div>;
}
