
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';

const PartnershipInquiry = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    website: '',
    partnershipType: '',
    industry: '',
    geography: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partnership inquiry submitted:', formData);
    // Handle form submission here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
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
                  Partnership Inquiry
                </h1>
                <h2 className="text-2xl font-normal text-black mb-6 leading-relaxed">
                  Join our partner ecosystem and grow together with 1iQ.
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
                      Phone Number:
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
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
                      Website:
                    </label>
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://"
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Partnership Type: *
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('partnershipType', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select partnership type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reseller">Reseller Partner</SelectItem>
                      <SelectItem value="technology">Technology Integration</SelectItem>
                      <SelectItem value="channel">Channel Partner</SelectItem>
                      <SelectItem value="consulting">Consulting Partner</SelectItem>
                      <SelectItem value="strategic">Strategic Alliance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Industry Focus:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('industry', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select industry..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="oil-gas">Oil and Gas</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Geographic Focus:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('geography', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select region..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="mena">MENA</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Tell us about your partnership vision; describe how you envision working together and what value you can bring:
                    </label>
                  </div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none resize-none min-h-[120px]"
                  />
                </div>

                <div className="pt-12 max-w-2xl">
                  <Button 
                    type="submit" 
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-medium uppercase tracking-wider rounded-none"
                  >
                    Submit Partnership Inquiry
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

export default PartnershipInquiry;
