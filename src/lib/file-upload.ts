import { uploadFile } from "@/lib/app.functions";

// Read a browser File into base64 (without the data: URL prefix).
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Upload a File and return its storage key + name. Throws on >10MB (server also
// enforces). Shared by aircraft documents, AOG attachments and supplier docs.
export async function uploadBrowserFile(file: File): Promise<{ storageKey: string; fileName: string }> {
  if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB).");
  const dataBase64 = await fileToBase64(file);
  const res = await uploadFile({
    data: {
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      dataBase64,
    },
  });
  return { storageKey: res.storageKey, fileName: res.fileName };
}
