
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";

const ALLOWED_STAFF_UIDS = [
  "0JkaCHIwxpgicZyqPyF6765TWC03",
];

export default function AuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      if (!user) {
        setAuthorized(false);
        setChecking(false);
        router.replace("/login");
        return;
      }

      if (ALLOWED_STAFF_UIDS.includes(user.uid)) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      setAuthorized(false);
      setChecking(false);

      try {
        await signOut(auth);
      } catch (error) {
        console.error("Unauthorized sign-out failed:", error);
      }

      if (active) {
        router.replace("/login");
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          Verifying staff access...
        </p>
      </main>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
