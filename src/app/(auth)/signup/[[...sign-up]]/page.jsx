'use client';
import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify User Email Code
  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
              if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#14171F]'>
      <div className='w-full max-w-md p-8 space-y-6 bg-[#1E2330] rounded-lg shadow-xl border border-gray-800'>
        <h1 className='text-3xl font-bold text-blue-300 text-center mb-6'>Sign Up</h1>
        
        {!pendingVerification && (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='first_name'
                className='block mb-2 text-sm font-medium text-gray-300'
              >
                First Name
              </label>
              <input
                type='text'
                name='first_name'
                id='first_name'
                onChange={(e) => setFirstName(e.target.value)}
                className='bg-[#14171F] border border-gray-700 text-gray-300 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                required={true}
                placeholder='John'
              />
            </div>
            <div>
              <label
                htmlFor='last_name'
                className='block mb-2 text-sm font-medium text-gray-300'
              >
                Last Name
              </label>
              <input
                type='text'
                name='last_name'
                id='last_name'
                onChange={(e) => setLastName(e.target.value)}
                className='bg-[#14171F] border border-gray-700 text-gray-300 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                required={true}
                placeholder='Doe'
              />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block mb-2 text-sm font-medium text-gray-300'
              >
                Email Address
              </label>
              <input
                type='email'
                name='email'
                id='email'
                onChange={(e) => setEmail(e.target.value)}
                className='bg-[#14171F] border border-gray-700 text-gray-300 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                placeholder='name@company.com'
                required={true}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block mb-2 text-sm font-medium text-gray-300'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                onChange={(e) => setPassword(e.target.value)}
                className='bg-[#14171F] border border-gray-700 text-gray-300 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                required={true}
                placeholder='••••••••'
              />
            </div>
            <button
              type='submit'
              className='w-full text-white bg-blue-500 hover:bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300'
            >
              Create an account
            </button>
            
            <div className='text-center text-gray-400 mt-4'>
              Already have an account?{' '}
              <Link 
                href="/sign-in" 
                className='text-blue-300 hover:text-blue-200 font-medium'
              >
                Log in
              </Link>
            </div>
          </form>
        )}
        
        {pendingVerification && (
          <div>
            <form onSubmit={onPressVerify} className='space-y-4'>
              <div>
                <label
                  htmlFor='verification-code'
                  className='block mb-2 text-sm font-medium text-gray-300'
                >
                  Verification Code
                </label>
                <input
                  id='verification-code'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className='bg-[#14171F] border border-gray-700 text-gray-300 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  placeholder='Enter 6-digit verification code'
                  required
                />
              </div>
              <button
                type='submit'
                className='w-full text-white bg-blue-500 hover:bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300'
              >
                Verify Email
              </button>
              
              <div className='text-center text-gray-400 mt-4'>
                Didn't receive a code?{' '}
                <button 
                  type='button'
                  onClick={() => setPendingVerification(false)}
                  className='text-blue-300 hover:text-blue-200 font-medium'
                >
                  Resend
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;