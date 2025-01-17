import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

// Profile Settings Page
export const ProfileSettingsPage = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.emailAddresses[0]?.emailAddress || '');

  const handleSaveProfile = async () => {
    try {
      await user?.update({
        firstName,
        lastName,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Profile Settings</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input 
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input 
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email"
            value={email}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support for assistance.</p>
        </div>
        
        <button 
          onClick={handleSaveProfile}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Account Settings Page
export const AccountSettingsPage = () => {
  const { user } = useUser();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleTwoFactorToggle = () => {
    // In a real app, this would integrate with Clerk's two-factor authentication
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h1>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-md font-semibold text-gray-700">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button 
            onClick={handleTwoFactorToggle}
            className={`w-16 h-8 rounded-full ${
              twoFactorEnabled 
                ? 'bg-green-500' 
                : 'bg-gray-300'
            } relative transition-colors`}
          >
            <span 
              className={`absolute top-1 ${
                twoFactorEnabled 
                  ? 'right-1' 
                  : 'left-1'
              } w-6 h-6 bg-white rounded-full shadow-md transform transition-transform`} 
            />
          </button>
        </div>
        
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="text-md font-semibold text-gray-700">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive updates and important information via email</p>
          </div>
          <button 
            onClick={handleEmailNotificationsToggle}
            className={`w-16 h-8 rounded-full ${
              emailNotifications 
                ? 'bg-green-500' 
                : 'bg-gray-300'
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
        
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Connected Accounts</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
                <span className="text-sm text-gray-700">Facebook</span>
              </div>
              <button className="text-sm text-red-500">Disconnect</button>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 7c2.761 0 5 2.239 5 5 0 2.762-2.239 5-5 5s-5-2.238-5-5c0-2.761 2.239-5 5-5zm0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/>
                </svg>
                <span className="text-sm text-gray-700">Google</span>
              </div>
              <button className="text-sm text-green-500">Connect</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help & Support Page
export const HelpAndSupportPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const supportTopics = [
    { id: 1, title: 'Billing & Subscription', content: 'Get help with account billing, payments, and subscription issues.' },
    { id: 2, title: 'Technical Support', content: 'Troubleshoot technical problems, app performance, and feature questions.' },
    { id: 3, title: 'Account Management', content: 'Assistance with account access, profile settings, and authentication.' },
    { id: 4, title: 'Privacy & Security', content: 'Answers to questions about data protection, account security, and privacy.' }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    // In a real app, this would send the support ticket to your backend
    alert('Support ticket submitted! We will get back to you soon.');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Help & Support</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Support Topics */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Common Support Topics</h2>
          <div className="space-y-3">
            {supportTopics.map((topic) => (
              <div 
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="p-4 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">{topic.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{topic.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Support Ticket Form */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Submit a Support Ticket</h2>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your contact email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {supportTopics.map((topic) => (
                  <option key={topic.id} value={topic.title}>{topic.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue in detail"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Submit Support Ticket
            </button>
          </form>
        </div>
      </div>

      {/* Selected Topic Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{selectedTopic.title}</h2>
            <p className="text-gray-600 mb-4">{selectedTopic.content}</p>
            <button 
              onClick={() => setSelectedTopic(null)}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default { ProfileSettingsPage, AccountSettingsPage, HelpAndSupportPage };