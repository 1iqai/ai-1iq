import React, { useRef, useState } from "react";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import Navigation from "../../components/Navigation";
import { useForm } from "react-hook-form";
import Footer from "../../components/Shared/Footer/Footer";

const PartnershipInquiry = () => {
  const heroRef = useRef(null);
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    console.log("Partnership inquiry data:", data);
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

      formData.append("access_key", "0a2c2dab-c985-4829-a843-5bdb78dcadd3");

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
        alert("Thanks — your partnership inquiry was sent.");
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
          title={"Partnership Inquiry"}
          text={"Join our partner ecosystem and grow together with 1iQ."}
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
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$/,
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
                <label htmlFor="website">Website</label>
                <input
                  {...register("website", {
                    pattern: {
                      value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
                      message: "Please enter a valid website URL",
                    },
                  })}
                  id="website"
                  type="text"
                  className={errors.website ? "error" : ""}
                />
                {errors.website && <p className="error-message">{errors.website.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="partnershipType">Partnership Type</label>
                <select {...register("partnershipType")} id="partnershipType">
                  <option value="reseller">Reseller Partner</option>
                  <option value="channel">Channel Partner</option>
                  <option value="consulting">Consulting Partner</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="industryFocus">Industry Focus</label>
                <select {...register("industryFocus")} id="industryFocus">
                  <option value="healthcare">Healthcare</option>
                  <option value="technology">Technology</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="geographicFocus">Geographic Focus</label>
                <select {...register("geographicFocus")} id="geographicFocus">
                  <option value="north-america">North America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="africa">Africa</option>
                  <option value="mena">MENA</option>
                  <option value="global">Global</option>
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
                <input type="submit" value="Submit" className="submit-btn mt-8" />
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

export default PartnershipInquiry;
