import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

const PrivacyPolicyPage: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col h-full w-full ${isDark ? "bg-gray-900" : "bg-white"} shadow-sm overflow-y-auto overscroll-contain`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f7fafc' }}>
      {/* Header */}
      <div className={`flex justify-center items-center px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Privacy Policy
        </h1>
      </div>

      <motion.div 
        className="p-4 sm:p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Last Updated: November 21, 2025
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300">
            1iQ (“we”, “our”, or “us”)
          </p>
        </div>

        {/* Section 1: Introduction */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This Privacy Policy explains how 1iQ collects, uses, stores, and protects information when you use:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-4">
            <li>The Web Application (used by project managers and admins)</li>
            <li>The Mobile Application (used by team leads, foremen, and laborers)</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            By using our applications, you agree to the practices described in this Privacy Policy.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Information We Collect</h2>
          
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-6 mb-2">a. Personal Information</h3>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-6">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Role (Admin, Project Manager, Team Lead, Foreman, Laborer)</li>
            <li>Profile image (optional)</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-6 mb-2">b. Project & Task Data</h3>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-6">
            <li>Projects you create, manage, or are assigned to</li>
            <li>Tasks created, assigned, started, or completed</li>
            <li>Comments and issues raised</li>
            <li>Task completion notes and approvals/rejections</li>
            <li>Monthly productivity details</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-6 mb-2">c. Usage & Activity Data</h3>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-6">
            <li>Login timestamps</li>
            <li>Device information (mobile model, OS version, browser type)</li>
            <li>IP address</li>
            <li>In-app actions and navigation</li>
            <li>Task start and completion timestamps</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-6 mb-2">d. AI-Generated Data</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            AI insights or summaries may process:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>Task descriptions</li>
            <li>Issue details</li>
            <li>Project updates</li>
            <li>Productivity reports</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            The AI does not train on your specific data unless explicitly stated.
          </p>
        </section>

        {/* Section 3: How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use the collected information to:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-4">
            <li>Create and manage user accounts</li>
            <li>Allow admins and project managers to create projects and tasks</li>
            <li>Allow workers to view, start, complete, and report issues on tasks</li>
            <li>Allow team leads/foremen to review and approve task completions</li>
            <li>Calculate work productivity and generate reports</li>
            <li>Generate AI summaries or insights</li>
            <li>Improve app performance, features, and security</li>
            <li>Send updates, alerts, or task notifications</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            We do not sell or rent your personal information.
          </p>
        </section>

        {/* Section 4: Who Can See Your Data */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Who Can See Your Data (Role-Based Access)</h2>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li><strong>Admin:</strong> All data</li>
            <li><strong>Project Manager:</strong> Projects they manage, tasks, productivity, issues</li>
            <li><strong>Team Lead/Foreman:</strong> Team tasks, performance, approvals, issues</li>
            <li><strong>Laborer:</strong> Only their assigned tasks and raised issues</li>
          </ul>
        </section>

        {/* Section 5: How We Share Your Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. How We Share Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We may share your information with:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mb-4">
            <li>Cloud hosting (AWS, Firebase, MongoDB Atlas)</li>
            <li>Analytics tools</li>
            <li>Authentication services</li>
            <li>Error monitoring services</li>
            <li>Legal authorities when required</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            We do not share data for advertising.
          </p>
        </section>

        {/* Section 6: AI Features and Data Handling */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. AI Features and Data Handling</h2>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>AI may process task and productivity data</li>
            <li>Data is not used to train public AI models</li>
            <li>AI outputs are for project insights only</li>
          </ul>
        </section>

        {/* Section 7: Data Storage & Security */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Data Storage & Security</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We implement:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>Encrypted transmission (HTTPS/SSL)</li>
            <li>Secure databases</li>
            <li>Password hashing</li>
            <li>System monitoring</li>
            <li>Role-based access control</li>
          </ul>
        </section>

        {/* Section 8: Data Retention */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Data Retention</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Data is kept only as long as required for:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside mt-2 mb-4">
            <li>Service delivery</li>
            <li>Legal compliance</li>
            <li>Dispute resolution</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            You may request deletion.
          </p>
        </section>

        {/* Section 9: Your Rights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">9. Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You may request:
          </p>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>Access</li>
            <li>Correction</li>
            <li>Deletion</li>
            <li>Restriction</li>
            <li>Download</li>
            <li>Withdrawal of consent</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            Contact us at: <a href="mailto:privacy@1iq.ai" className="text-blue-600 hover:underline">privacy@1iq.ai</a>
          </p>
        </section>

        {/* Section 10: Children’s Privacy */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">10. Children’s Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We do not collect data from individuals under 18.
          </p>
        </section>

        {/* Section 11: International Data Transfers */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">11. International Data Transfers</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your data may be processed on servers outside your country with protection applied.
          </p>
        </section>

        {/* Section 12: Changes to This Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">12. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update this policy and notify users for major changes.
          </p>
        </section>

        {/* Section 13: Contact Us */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">13. Contact Us</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Email: <a href="mailto:info@1iq.ai" className="text-blue-600 hover:underline">info@1iq.ai</a></p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;