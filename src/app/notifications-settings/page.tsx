'use client'

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function NotificationsSettings() {
  const { user } = useUser();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handlePushNotificationsToggle = () => {
    setPushNotifications(!pushNotifications);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#14171F]">
      <div className="w-full max-w-2xl">
        <div className="bg-[#1a1f2e] shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">Notifications Settings</h1>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-md font-semibold text-gray-300">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive updates and important information via email</p>
              </div>
              <button
                onClick={handleEmailNotificationsToggle}
                className={`w-16 h-8 rounded-full ${
                  emailNotifications
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                } relative transition-colors`}
              >
                <span
                  className={`absolute top-1 ${
                    emailNotifications
                      ? 'right-1'
                      : 'left-1'
                  } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-md font-semibold text-gray-300">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive real-time updates and alerts</p>
              </div>
              <button
                onClick={handlePushNotificationsToggle}
                className={`w-16 h-8 rounded-full ${
                  pushNotifications
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                } relative transition-colors`}
              >
                <span
                  className={`absolute top-1 ${
                    pushNotifications
                      ? 'right-1'
                      : 'left-1'
                  } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}