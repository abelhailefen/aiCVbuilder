// app/dashboard/page.tsx

"use client";  // Add this to mark the file as a client component

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseConfig';  // Correct path
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';  // Use next/navigation instead of next/router

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login'); // Redirect to login if not signed in
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.displayName}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
