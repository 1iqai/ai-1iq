import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const BuildersApplication = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    projectType: '',
    projectStage: '',
    teamSize: '',
    fundingNeeds: '',
    timeline: '',
    projectDescription: '',
    techStack: '',
    challenges: '',
    why1iq: ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Builder application submitted:', formData);
    toast({
      title: "Application Submitted",
      description: "Thank you for your application. We'll review it and get back to you soon.",
    });
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
                  Builders & Innovators
                </h1>
                <h2 className="text-2xl font-normal text-black mb-6 leading-relaxed">
                  Join our community of builders transforming construction through innovative technology and operational intelligence.
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Information */}
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
                      Email Address: *
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
                      Location:
                    </label>
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      LinkedIn Profile:
                    </label>
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Website / Portfolio:
                    </label>
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                </div>

                {/* Project Information */}
                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Project Type: *
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('projectType', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select project type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup / New Company</SelectItem>
                      <SelectItem value="product">Product Development</SelectItem>
                      <SelectItem value="research">Research Project</SelectItem>
                      <SelectItem value="consulting">Consulting / Services</SelectItem>
                      <SelectItem value="nonprofit">Non-profit Initiative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Project Stage:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('projectStage', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select project stage..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea / Concept</SelectItem>
                      <SelectItem value="prototype">Prototype / MVP</SelectItem>
                      <SelectItem value="early">Early Stage</SelectItem>
                      <SelectItem value="growth">Growth Stage</SelectItem>
                      <SelectItem value="established">Established</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Team Size:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('teamSize', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select team size..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo Founder</SelectItem>
                      <SelectItem value="2-5">2-5 people</SelectItem>
                      <SelectItem value="6-15">6-15 people</SelectItem>
                      <SelectItem value="16-50">16-50 people</SelectItem>
                      <SelectItem value="50+">50+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Funding Needs:
                    </label>
                  </div>
                  <Select onValueChange={(value) => handleSelectChange('fundingNeeds', value)}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none">
                      <SelectValue placeholder="Select funding needs..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No funding needed</SelectItem>
                      <SelectItem value="<50k">Less than $50,000</SelectItem>
                      <SelectItem value="50k-250k">$50,000 - $250,000</SelectItem>
                      <SelectItem value="250k-1m">$250,000 - $1M</SelectItem>
                      <SelectItem value="1m+">$1M+</SelectItem>
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
                      <SelectItem value="3months">Next 3 months</SelectItem>
                      <SelectItem value="6months">Next 6 months</SelectItem>
                      <SelectItem value="1year">Next year</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Detailed Information */}
                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Project Description: *
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Tell us about your project, product, or idea. What problem are you solving?
                    </p>
                  </div>
                  <Textarea
                    name="projectDescription"
                    required
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none resize-none min-h-[120px]"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Technology Stack:
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      What technologies, tools, or platforms are you using or planning to use?
                    </p>
                  </div>
                  <Textarea
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none resize-none min-h-[80px]"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Current Challenges:
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      What are the biggest challenges or obstacles you're facing?
                    </p>
                  </div>
                  <Textarea
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none resize-none min-h-[100px]"
                  />
                </div>

                <div className="w-full">
                  <div className="max-w-2xl">
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">
                      Why 1iQ?
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      How does your project align with 1iQ's mission? What kind of support are you looking for?
                    </p>
                  </div>
                  <Textarea
                    name="why1iq"
                    value={formData.why1iq}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-gray-400 bg-transparent px-0 py-4 text-base focus:border-black focus:outline-none focus:ring-0 rounded-none resize-none min-h-[120px]"
                  />
                </div>

                <div className="pt-12 max-w-2xl">
                  <Button 
                    type="submit" 
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-medium uppercase tracking-wider rounded-none"
                  >
                    Submit Application
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

export default BuildersApplication;