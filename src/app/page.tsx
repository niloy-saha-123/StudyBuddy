'use client'

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        router.push('/sign-in');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, userId, router]);

  // Show loading state while auth is being checked
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#14171F]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Return null as we're handling navigation in useEffect
  return null;
}