import React, { useRef, useState } from "react";
import Navigation from "../../components/Navigation";
import CommonHeader from "../../components/Shared/CommonHeader/CommonHeader";
import { useForm } from "react-hook-form";
import Footer from "../../components/Shared/Footer/Footer";
import { MetalFx } from "metal-fx";

const BuilderForm = () => {
  const heroRef = useRef(null);
  const submitRef = useRef(null);
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    console.log("Builder form data:", data);
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

      formData.append("access_key", "a2b5aed5-b92c-4810-987d-3bd63f3cc3ef");

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
        alert("Thanks: your project inquiry was sent.");
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
        <CommonHeader ref={heroRef} title={"Builder Inquiry"} text={"Tell us about your project and how we can help."} />

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
                <label htmlFor="phone">Phone</label>
                <input
                  {...register("phone", {
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
                <label htmlFor="location">Location</label>
                <input {...register("location")} id="location" type="text" />
              </div>

              <div className="input-group">
                <label htmlFor="website">Website / Portfolio</label>
                <input
                  {...register("website")}
                  id="website"
                  type="text"
                  className={errors.website ? "error" : ""}
                />
                {errors.website && <p className="error-message">{errors.website.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="linkedin">LinkedIn Profile</label>
                <input
                  {...register("linkedin")}
                  id="linkedin"
                  type="text"
                  className={errors.linkedin ? "error" : ""}
                />
                {errors.linkedin && <p className="error-message">{errors.linkedin.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="projectType">
                  Project Type <span className="required">*</span>
                </label>
                <select
                  {...register("projectType", { required: "Project type is required" })}
                  id="projectType"
                  className={errors.projectType ? "error" : ""}
                >
                  <option value="startup">Startup</option>
                  <option value="product-development">Product Development</option>
                  <option value="research">Research</option>
                </select>
                {errors.projectType && <p className="error-message">{errors.projectType.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="projectStage">Project Stage</label>
                <select {...register("projectStage")} id="projectStage">
                  <option value="prototype">Prototype</option>
                  <option value="early-stage">Early Stage</option>
                  <option value="established">Established</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="teamSize">Team Size</label>
                <select {...register("teamSize")} id="teamSize">
                  <option value="2-5">2-5 people</option>
                  <option value="5-10">5-10 people</option>
                  <option value="10-20">10-20 people</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="projectDescription">
                  Project Description <span className="required">*</span>
                </label>
                <textarea
                  {...register("projectDescription", {
                    required: "Project description is required",
                    minLength: { value: 20, message: "Please provide at least 20 characters" },
                  })}
                  id="projectDescription"
                  className={errors.projectDescription ? "error" : ""}
                ></textarea>
                {errors.projectDescription && <p className="error-message">{errors.projectDescription.message}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="techStack">Technology Stack</label>
                <textarea {...register("techStack")} id="techStack"></textarea>
              </div>

              <div className="input-group">
                <label htmlFor="challenges">Current Challenges</label>
                <textarea {...register("challenges")} id="challenges"></textarea>
              </div>

              <div className="input-group">
                <label htmlFor="why1iq">Why 1iQ?</label>
                <textarea {...register("why1iq")} id="why1iq"></textarea>
              </div>

              <div className="input-group flex justify-center mt-8">
                <MetalFx preset="chromatic" strength={0.90} reflectionTargets={[submitRef]}>
                  <button
                    ref={submitRef}
                    type="submit"
                    className="submit-btn"
                  >
                    Submit Inquiry
                  </button>
                </MetalFx>
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

export default BuilderForm;
