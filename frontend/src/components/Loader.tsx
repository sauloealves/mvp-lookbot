import { useLoading } from "@/contexts/LoadingContext";

export default function Loader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800 border-solid" />
    </div>
  );
}