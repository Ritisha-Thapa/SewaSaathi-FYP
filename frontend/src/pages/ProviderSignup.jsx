import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";



const skillsOptions = [
  "plumber",
  "electrician",
  "cleaner",
  "painter",
  "gardener"
];



const ProviderSignup = () => {

  // STATES
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",

    skills: [],
    experience_years: "",
    citizenship_number: "",
    citizenship_image: null,
    profile_image: null,
  });

  const [errors, setErrors] = useState({});
  const [previewCitizenship, setPreviewCitizenship] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");


  // Auto-hide success message

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000); // hides after 5s
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  // INPUT CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  // SKILLS CHECKBOX

  const handleSkillChange = (skill) => {
    setFormData((prev) => {
      const updated = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];

      return {
        ...prev,
        skills: updated,
      };
    });
  };


  // FILE HANDLING

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];

    if (type === "citizenship") {
      setFormData((prev) => ({
        ...prev,
        citizenship_image: file,
      }));
      setPreviewCitizenship(URL.createObjectURL(file));
    }

    if (type === "profile") {
      setFormData((prev) => ({
        ...prev,
        profile_image: file,
      }));
      setPreviewProfile(URL.createObjectURL(file));
    }
  };


  // SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "Required";
    if (!formData.last_name.trim()) newErrors.last_name = "Required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.city.trim()) newErrors.city = "Required";

    if (formData.skills.length === 0) newErrors.skills = "Select at least one";
    if (!formData.experience_years) newErrors.experience_years = "Required";
    if (!formData.citizenship_number.trim()) newErrors.citizenship_number = "Required";
    if (!formData.citizenship_image) newErrors.citizenship_image = "Required";
    if (!formData.profile_image) newErrors.profile_image = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const form = new FormData();

    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("phone", formData.phone);
    form.append("email", formData.email);
    form.append("address", formData.address);
    form.append("city", formData.city);


    formData.skills.forEach((skill) => form.append("skills", skill));
    form.append("experience_years", formData.experience_years);
    form.append("citizenship_number", formData.citizenship_number);
    form.append("citizenship_image_front", formData.citizenship_image);
    form.append("citizenship_image_back", formData.citizenship_image);
    form.append("profile_image", formData.profile_image);

    form.append("password", "provider123");
    form.append("role", "provider");

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/provider-registration/", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

if (response.ok) {
  // Set the success message from backend
  setSuccessMessage(data.message || "Provider registration successful!");
  // Optionally, clear form after success
  setFormData({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    skills: [],
    experience_years: "",
    citizenship_number: "",
    citizenship_image: null,
    profile_image: null,
    city: ""
  });
  setPreviewCitizenship(null);
  setPreviewProfile(null);
  setErrors({});
  return; // exit
}


    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };



  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex justify-start">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-[#1B3C53] hover:text-[#1a3248] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#1B3C53]">
            Become a Service Provider
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Apply to join our network of verified service providers
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.first_name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
                  placeholder="First name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.last_name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
                  placeholder="Last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
                placeholder="Phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
                placeholder="Address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
            <div>
  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
    City *
  </label>
  <select
    id="city"
    name="city"
    required
    value={formData.city}
    onChange={handleChange}
    className={`appearance-none relative block w-full px-3 py-2 border ${
      errors.city ? "border-red-300" : "border-gray-300"
    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
  >
    <option value="">Select City</option>
    <option value="kathmandu">Kathmandu</option>
    <option value="lalitpur">Lalitpur</option>
    <option value="bhaktapur">Bhaktapur</option>
  </select>

  {errors.city && (
    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
  )}
</div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skillsOptions.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillChange(skill)}
                      className="w-4 h-4 text-[#1B3C53] border-gray-300 rounded focus:ring-[#1B3C53]"
                    />
                    <span className="text-sm text-gray-700 capitalize">{skill}</span>
                  </label>
                ))}
              </div>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
              )}
            </div>

            <div>
              <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience *
              </label>
              <input
                id="experience_years"
                name="experience_years"
                type="number"
                min="0"
                required
                value={formData.experience_years}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.experience_years ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
                placeholder="Years of experience"
              />
              {errors.experience_years && (
                <p className="mt-1 text-sm text-red-600">{errors.experience_years}</p>
              )}
            </div>

            <div>
              <label htmlFor="citizenship_number" className="block text-sm font-medium text-gray-700 mb-1">
                Citizenship Number *
              </label>
              <input
                id="citizenship_number"
                name="citizenship_number"
                type="text"
                required
                value={formData.citizenship_number}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.citizenship_number ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`}
                placeholder="Citizenship number"
              />
              {errors.citizenship_number && (
                <p className="mt-1 text-sm text-red-600">{errors.citizenship_number}</p>
              )}
            </div>

            <div>
              <label htmlFor="citizenship_image" className="block text-sm font-medium text-gray-700 mb-1">
                Citizenship Image *
              </label>
              <input
                id="citizenship_image"
                name="citizenship_image"
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e, 'citizenship')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:t  ext-sm file:font-semibold file:bg-[#1B3C53] file:text-white hover:file:bg-[#1a3248] cursor-pointer"
              />
              {previewCitizenship && (
                <div className="mt-2">
                  <img src={previewCitizenship} alt="Citizenship preview" className="max-w-xs h-32 object-cover rounded-lg border border-gray-300" />
                </div>
              )}
              {errors.citizenship_image && (
                <p className="mt-1 text-sm text-red-600">{errors.citizenship_image}</p>
              )}
            </div>

            <div>
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image *
              </label>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileChange(e, 'profile')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1B3C53] file:text-white hover:file:bg-[#1a3248] cursor-pointer"
              />
              {previewProfile && (
                <div className="mt-2">
                  <img src={previewProfile} alt="Profile preview" className="max-w-xs h-32 object-cover rounded-lg border border-gray-300" />
                </div>
              )}
              {errors.profile_image && (
                <p className="mt-1 text-sm text-red-600">{errors.profile_image}</p>
              )}
            </div>
          </div>

          <div>
            {successMessage && (
  <div className="mb-4 text-green-700 bg-green-100 px-4 py-2 rounded-lg border border-green-200 text-center">
    {successMessage}
  </div>
)}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3C53] transition"
            >
              Submit Application
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#1B3C53] hover:text-[#1a3248]">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderSignup;

