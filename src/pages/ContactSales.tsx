
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';

const ContactSales = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
    companySize: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sales inquiry submitted:', formData);
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
                  Contact Sales
                </h1>
                <h2 className="text-2xl font-normal text-black mb-6 leading-relaxed">
                  Ready to transform your business? Let's discuss pricing and implementation.
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
                      Job Title:
                    </label>
                  </div>
                  <input
                    type="text"
                    name="jobTitle"
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
                      Company Size:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('companySize', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select size..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Budget Range:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('budget', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select budget range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<10k">Less than $10,000</SelectItem>
                      <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k+">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Timeline:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('timeline', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select timeline..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="1-3months">1-3 months</SelectItem>
                      <SelectItem value="3-6months">3-6 months</SelectItem>
                      <SelectItem value="6+months">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      How can we help you? Tell us about your specific requirements and goals:
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
                    Contact Sales Team
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

export default ContactSales;
