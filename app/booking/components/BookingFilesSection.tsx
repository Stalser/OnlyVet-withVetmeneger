"use client";

type BookingFilesSectionProps = {
  files: File[];
  onFileChange: (files: File[]) => void;
};

export function BookingFilesSection({
  files,
  onFileChange,
}: BookingFilesSectionProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onFileChange(Array.from(e.target.files));
  };

  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold">
        Анализы, документы, фото
      </h2>
      <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/80 text-[13px] text-slate-600">
        <p className="mb-2">
          Прикрепите анализы, выписки, УЗИ, рентген, фото и другие файлы,
          которые помогут врачу лучше понять ситуацию.
        </p>
        <label className="inline-flex items-center gap-2 text-[12px] cursor-pointer">
          <span className="px-3 py-1.5 rounded-full bg-white border border-slate-300 shadow-sm">
            Выбрать файлы
          </span>
          <input
            type="file"
            multiple
            onChange={handleInputChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx"
          />
          <span className="text-slate-500">
            (pdf, изображения и др. форматы)
          </span>
        </label>
        {files.length > 0 && (
          <ul className="mt-2 text-[12px] text-slate-600 list-disc pl-4">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
