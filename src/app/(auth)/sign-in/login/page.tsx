'use client'

import { SignIn } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignInPage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#14171F]">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white rounded-lg",
          }
        }}
        redirectUrl="/dashboard"
        path="/sign-in"
        signUpUrl="/signup"
      />
    </div>
  );
};

export default SignInPage;