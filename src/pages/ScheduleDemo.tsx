import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';

const ScheduleDemo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    country: '',
    projectDescription: '',
    productUpdates: false,
    salesOutreach: false,
    futureEvents: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      country: value
    });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Dark gradient background for header area */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
      
      <Header />
      
      <div className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-[80vh]">
            {/* Full width container for form with extended lines */}
            <div className="w-full">
              <div className="mb-16 max-w-2xl">
                <h1 className="text-8xl font-light text-black leading-tight tracking-tight mb-8">
                  Get Started
                </h1>
                <h2 className="text-2xl font-normal text-black mb-6 leading-relaxed">
                  Interested in solving your problems with 1iQ software?
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      First Name: *
                    </label>
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Last Name: *
                    </label>
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Business Email Address: *
                    </label>
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Phone Number: *
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Job Title: *
                    </label>
                  </div>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Company / Institution: *
                    </label>
                  </div>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Country: *
                    </label>
                  </div>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Tell us about your project; a bit of context will allow us to connect you to the right team faster:
                    </label>
                  </div>
                  <Textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none resize-none min-h-[120px]"
                  />
                </div>

                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="productUpdates"
                      checked={formData.productUpdates}
                      onCheckedChange={(checked) => handleCheckboxChange('productUpdates', checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="productUpdates" className="text-xs font-medium text-gray-600 uppercase tracking-widest leading-relaxed">
                      Opt-in to receive Palantir product updates:
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="salesOutreach"
                      checked={formData.salesOutreach}
                      onCheckedChange={(checked) => handleCheckboxChange('salesOutreach', checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="salesOutreach" className="text-xs font-medium text-gray-600 uppercase tracking-widest leading-relaxed">
                      Opt-in to personalized sales outreach:
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="futureEvents"
                      checked={formData.futureEvents}
                      onCheckedChange={(checked) => handleCheckboxChange('futureEvents', checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="futureEvents" className="text-xs font-medium text-gray-600 uppercase tracking-widest leading-relaxed">
                      Opt-in to receive invites to future events:
                    </label>
                  </div>
                </div>

                <div className="pt-12 max-w-2xl">
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
