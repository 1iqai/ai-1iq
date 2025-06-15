
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const ScheduleDemo = () => {
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
          <div className="flex min-h-[80vh] gap-32">
            {/* Left side - Large heading */}
            <div className="flex-1 flex items-start pt-16">
              <h1 className="text-8xl font-light text-black leading-tight tracking-tight">
                Get Started
              </h1>
            </div>

            {/* Right side - Form content */}
            <div className="flex-1 pt-16">
              <div className="mb-16">
                <h2 className="text-2xl font-normal text-black mb-6 leading-relaxed">
                  Interested in solving your problems with 1iQ software?
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                    First Name: *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                    Last Name: *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                    Business Email Address: *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                    Phone Number: *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                    Job Title: *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="pt-12">
                  <Button 
                    type="submit" 
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-medium uppercase tracking-wider rounded-none"
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
