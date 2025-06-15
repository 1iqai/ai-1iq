
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const ScheduleDemo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 text-gray-600 hover:text-gray-800 p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex min-h-[80vh]">
            {/* Left side - Large heading */}
            <div className="w-1/2 pr-16 flex items-start pt-8">
              <h1 className="text-7xl font-light text-black leading-tight">
                Get Started
              </h1>
            </div>

            {/* Right side - Form content */}
            <div className="w-1/2 pl-16">
              <div className="mb-12">
                <h2 className="text-2xl font-light text-black mb-6">
                  Interested in solving your problems with 1iQ software?
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
                    First Name: *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-base focus:border-black focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
                    Last Name: *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-base focus:border-black focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
                    Business Email Address: *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-base focus:border-black focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
                    Phone Number: *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-base focus:border-black focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
                    Job Title: *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-base focus:border-black focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="pt-8">
                  <Button 
                    type="submit" 
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-medium uppercase tracking-wider"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDemo;
