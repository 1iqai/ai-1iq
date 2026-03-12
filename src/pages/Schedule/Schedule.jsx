import React, { useRef, useState } from "react";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import "./Schedule.scss";
import { useForm } from "react-hook-form";
import Footer from "../../components/Shared/Footer/Footer";
import PortalButton from "../../components/Shared/PortalButton/PortalButton";

const Schedule = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const [result, setResult] = useState("");
  const heroRef = useRef(null);

  const onSubmit = async (data) => {
    // This function will only be called if the form is valid
    console.log("Form submitted successfully:", data);
    // give quick feedback to user
    setResult("Sending....");

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

      // Append your access key for Web3Forms
      formData.append("access_key", "aff2eb3e-c155-4a3d-987e-bf059301f9b3");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.success) {
        setResult("Form Submitted Successfully");
        // reset form values after successful submission
        try {
          reset();
        } catch (e) {
          console.warn("Reset failed:", e);
        }
        alert("Form submitted! Check the console for the data.");
      } else {
        console.error("Web3Forms error:", responseData);
        setResult("Error submitting form");
      }
    } catch (err) {
      console.error(err);
      setResult("Error sending form");
    }
  };

  return (
    <>
      <div className="app relative w-full overflow-x-hidden">
        <Navigation heroRef={heroRef} />
        <CommonHeader
          ref={heroRef}
          title={"Get Started"}
          text={"Interested in solving your problems with 1iQ software?"}
        ></CommonHeader>

        <div className="content-grid">
          <div className="wrapper">
            {/* `noValidate` prevents default browser validation */}
            <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-6">
                <div className="input-group flex-1">
                  <label htmlFor="firstName">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    {...register("firstName", { required: "First name is required" })}
                    type="text"
                    id="firstName"
                    className={errors.firstName ? "error" : ""} // Optional: for styling
                  />
                  {/* 2. Conditionally render the error message */}
                  {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
                </div>
                <div className="input-group flex-1">
                  <label htmlFor="lastName">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    {...register("lastName", { required: "Last name is required" })}
                    type="text"
                    id="lastName"
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">
                  Business Email <span className="required">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  id="email"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="phoneNumber">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  type="text"
                  id="phoneNumber"
                  className={errors.phoneNumber ? "error" : ""}
                />
                {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="jobTitle">
                  Job Title <span className="required">*</span>
                </label>
                <input
                  {...register("jobTitle", {
                    required: "Job title is required",
                    minLength: { value: 2, message: "Job title must be at least 2 characters" },
                  })}
                  type="text"
                  id="jobTitle"
                  className={errors.jobTitle ? "error" : ""}
                />
                {errors.jobTitle && <p className="error-message">{errors.jobTitle.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="company">
                  Company / Institution <span className="required">*</span>
                </label>
                <input
                  {...register("company", { required: "Company name is required" })}
                  type="text"
                  id="company"
                  className={errors.company ? "error" : ""}
                />
                {errors.company && <p className="error-message">{errors.company.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="country">Country</label>
                <select {...register("country")}>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="australia">Australia</option>
                  <option value="japan">Japan</option>
                  <option value="france">France</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="description">
                  Tell us about your project; a bit of context will allow us to connect you to the right team faster:{" "}
                  <span className="required">*</span>
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

              <div className="input-group checkbox-group">
                <input {...register("sales")} type="checkbox" id="sales" value="sales" />
                <label htmlFor="sales">Opt-in to receive product updates</label>
              </div>

              <div className="input-group checkbox-group">
                <input {...register("productUpdate")} type="checkbox" id="product-update" value="product-update" />
                <label htmlFor="product-update">Opt-in to receive sales outreach</label>
              </div>

              <div className="input-group checkbox-group">
                <input {...register("futureEvents")} type="checkbox" id="future-events" value="future-events" />
                <label htmlFor="future-events">Opt-in to receive invites to future events</label>
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
            </form>
          </div>
        </div>

        <Footer></Footer>
      </div>
    </>
  );
};

export default Schedule;
