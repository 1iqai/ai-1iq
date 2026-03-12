import React, { useRef, useState } from "react";
import "./ContactUs.scss";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import { useForm } from "react-hook-form";
import Footer from "../../components/Shared/Footer/Footer";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";

const ContactUs = () => {
  const heroRef = useRef(null);
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    console.log("Contact form data:", data);
    setStatus("Sending...");

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, String(value));
        }
      });

      formData.append("access_key", "6d1a807a-d50b-4157-a797-bc78554ce667");

      const resp = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const json = await resp.json();
      console.log(json);
      if (json.success) {
        setStatus("Submitted successfully");
        try {
          reset();
        } catch (e) {
          console.warn("reset failed", e);
        }
        alert("Thanks — your message was sent.");
      } else {
        console.error("web3forms error", json);
        setStatus("Error submitting form");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error sending form");
    }
  };

  return (
    <>
      <div className="app relative w-full overflow-x-hidden">
        <Navigation heroRef={heroRef} />
        <CommonHeader
          ref={heroRef}
          title={"Contact Sales"}
          text={"Ready to transform your business? Let's discuss pricing and implementation."}
        ></CommonHeader>

        <div className="content-grid">
          <div className="wrapper">
            <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-6">
                <div className="input-group flex-1">
                  <label htmlFor="firstName">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    {...register("firstName", { required: "First name is required" })}
                    id="firstName"
                    type="text"
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
                </div>

                <div className="input-group flex-1">
                  <label htmlFor="lastName">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    {...register("lastName", { required: "Last name is required" })}
                    id="lastName"
                    type="text"
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  id="email"
                  type="email"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="phone">
                  Phone <span className="required">*</span>
                </label>
                <input
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  id="phone"
                  type="text"
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="company">
                  Company <span className="required">*</span>
                </label>
                <input
                  {...register("company", { required: "Company is required" })}
                  id="company"
                  type="text"
                  className={errors.company ? "error" : ""}
                />
                {errors.company && <p className="error-message">{errors.company.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="companySize">Company Size</label>
                <select {...register("companySize")} id="companySize">
                  <option value="1-10">1-10 employees</option>
                  <option value="10-50">10-50 employees</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="budget">Budget Range</label>
                <select {...register("budget")} id="budget">
                  <option value="<10000">less than $10,000</option>
                  <option value="10000-50000">$10,000 - $50,000</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="timeline">Timeline</label>
                <select {...register("timeline")} id="timeline">
                  <option value="immediate">Immediate</option>
                  <option value="1-3">1 - 3 months</option>
                  <option value="3-6">3 - 6 months</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="description">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 20, message: "Please provide at least 20 characters" },
                  })}
                  id="description"
                  className={errors.description ? "error" : ""}
                ></textarea>
                {errors.description && <p className="error-message">{errors.description.message}</p>}
              </div>

              <div className="input-group">
                <PortalButton
                  type="submit"
                  label="Submit Request"
                  showDivider={false}
                  className="mt-8"
                  buttonClassName="w-full justify-center"
                />
              </div>

              {status && <p className="form-status">{status}</p>}
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;
