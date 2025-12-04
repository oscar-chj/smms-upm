"use client";

import AdminMeritUpload from "@/components/admin/AdminMeritUpload";

export default function AdminMeritUploadPage() {
  const handleUploadComplete = () => {
    // In production, this would send data to the backend API
    // eslint-disable-next-line no-console
    console.log("Merit upload completed");

    // Example of what would happen in production:
    // await fetch('/api/admin/merit-upload', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(uploadData)
    // });
  };

  return <AdminMeritUpload onComplete={handleUploadComplete} />;
}
