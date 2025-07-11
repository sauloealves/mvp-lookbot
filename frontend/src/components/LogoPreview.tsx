import { useEffect, useState } from 'react';
export default function LogoPreview({ file }: { file: File | null }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  if (!file) return null;
  return <img src={preview!} alt="Logo Preview" className="h-32 mt-4 rounded" />;
}