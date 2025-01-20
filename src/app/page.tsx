'use client'

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/landing/LandingPage';

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect to dashboard
  if (isLoaded && userId) {
    router.push('/dashboard');
    return null;
  }

  // Show loading state while auth is being checked
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#14171F]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}