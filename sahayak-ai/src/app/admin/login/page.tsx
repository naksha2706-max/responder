'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "system-ui"
    }}>
      Redirecting to admin login...
    </div>
  );
}