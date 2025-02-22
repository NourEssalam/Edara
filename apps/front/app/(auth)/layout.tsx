export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 className="flex w-full items-center justify-center text-2xl pt-4 font-bold">
        Edara
      </h1>
      {children}
    </>
  );
}
