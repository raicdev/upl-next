import { Toaster } from "sonner";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster richColors position="bottom-right" />
    </>
  );
}
