"use client";

import MeritReports from "@/components/reports/MeritReports";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MeritReportsPage() {
  const [studentId, setStudentId] = useState<string>("1"); // Default fallback
  const { data: session } = useSession();

  useEffect(() => {
    // Get current user ID from NextAuth session
    if (session?.user?.id) {
      setStudentId(session.user.id);
    }
  }, [session]);

  const handleDownloadReport = () => {
    // In production, this would generate and download a PDF report
    // eslint-disable-next-line no-console
    console.log("Generating merit report...");

    // Example of what would happen in production:
    // const reportData = await fetch('/api/reports/merit-summary');
    // const blob = await reportData.blob();
    // downloadFile(blob, 'merit-report.pdf');

    alert("Merit report download started (demo functionality)");
  };

  const handlePrintReport = () => {
    // In production, this might prepare a print-friendly view
    window.print();
  };

  return (
    <MeritReports
      studentId={studentId}
      onDownloadReport={handleDownloadReport}
      onPrintReport={handlePrintReport}
      targetPoints={50}
    />
  );
}
