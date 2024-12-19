"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UnprotectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push('/dashboard'); // Redirect the user to the previous page they were on
    } else {
      setIsAuthenticated(true); // Show the unprotected content if not authenticated
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
