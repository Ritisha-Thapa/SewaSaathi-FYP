import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "../../../shared/components/layout/ToastProvider";
import { ChevronDown } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import FileUploadField from "../../../shared/components/ui/FileUploadField";
import Logo from "../../../assets/sewasathi_logo.png";

const categoryOptions = [
  { value: "plumber", label: "Plumbing" },
  { value: "electrician", label: "Electrical Repairing" },
  { value: "cleaner", label: "Cleaning" },
  { value: "painter", label: "Painting" },
  { value: "gardener", label: "Gardening" },
  { value: "carpenter", label: "Carpentry" },
];

const experienceOptions = [
  { value: "0", label: "Less than 1 year" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5", label: "5 years" },
  { value: "6", label: "6 years" },
  { value: "7", label: "7 years" },
  { value: "8", label: "8 years" },
  { value: "9", label: "9 years" },
  { value: "10", label: "10+ years" },
];

const cityOptions = [
  { value: "kathmandu", label: "Kathmandu" },
  { value: "lalitpur", label: "Lalitpur" },
  { value: "bhaktapur", label: "Bhaktapur" },
];

const MAX_FILE_SIZE_MB = 5;

const ProviderSignup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    skills: "",
    experience_years: "",
    citizenship_image: null,
    profile_image: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const clearError = (name) =>
    setErrors((prev) => ({ ...prev, [name]: "" }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numeric = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numeric }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    clearError(name);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const field = type === "citizenship" ? "citizenship_image" : "profile_image";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [field]: `File must be under ${MAX_FILE_SIZE_MB}MB` }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: file }));
    clearError(field);
  };

  const handleFileClear = (type) => {
    const field = type === "citizenship" ? "citizenship_image" : "profile_image";
    setFormData((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    else if (!/^[a-zA-Z\s]+$/.test(formData.first_name)) newErrors.first_name = "Only letters allowed";

    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    else if (!/^[a-zA-Z\s]+$/.test(formData.last_name)) newErrors.last_name = "Only letters allowed";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be exactly 10 digits";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address";

    if (!formData.address.trim()) newErrors.address = "Address is required";
    else if (formData.address.trim().length < 5) newErrors.address = "Address is too short";

    if (!formData.city) newErrors.city = "Please select a city";
    if (!formData.skills) newErrors.skills = "Please select a service category";
    if (!formData.experience_years) newErrors.experience_years = "Please select years of experience";
    if (!formData.citizenship_image) newErrors.citizenship_image = "Citizenship image is required";
    if (!formData.profile_image) newErrors.profile_image = "Profile image is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
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
    form.append("skills", formData.skills);
    form.append("experience_years", formData.experience_years);
    form.append("citizenship_image_front", formData.citizenship_image);
    form.append("citizenship_image_back", formData.citizenship_image);
    form.append("profile_image", formData.profile_image);
    form.append("password", "provider123");
    form.append("role", "provider");

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/accounts/provider-registration/",
        { method: "POST", body: form }
      );

      let data = {};
      let text = "";
      try {
        text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.log("Response is not valid JSON");
      }

      if (response.ok) {
        toast.success(data.message || "Provider registration successful!");
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          skills: "",
          experience_years: "",
          citizenship_image: null,
          profile_image: null,
        });
        setErrors({});
        setIsLoading(false);
        return;
      }

      let fieldErrors = {};
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) fieldErrors[key] = data[key][0];
      });

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        toast.error("Registration failed");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  const selectClass = (hasError) =>
    `appearance-none w-full px-3 py-2 pr-10 border ${
      hasError ? "border-red-300" : "border-gray-300"
    } text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent bg-white`;

  const inputClass = (hasError) =>
    `appearance-none relative block w-full px-3 py-2 border ${
      hasError ? "border-red-300" : "border-gray-300"
    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent`;

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex flex-col items-center">
          <Link to="/" className="flex items-center gap-4 cursor-pointer">
            <img src={Logo} alt="logo" className="h-14 w-auto" />
            <span className="text-2xl font-bold text-[#1B3C53] tracking-tight">SewaSaathi</span>
          </Link>
          <h2 className="text-center text-3xl font-bold text-[#1B3C53] mt-12">
            Become a Service Provider
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Apply to join our network of verified service providers
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={inputClass(errors.first_name)}
                  placeholder="First name"
                />
                {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={inputClass(errors.last_name)}
                  placeholder="Last name"
                />
                {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass(errors.phone)}
                placeholder="10-digit phone number"
                maxLength={10}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass(errors.email)}
                placeholder="Email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={inputClass(errors.address)}
                placeholder="Full address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <div className="relative">
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={selectClass(errors.city)}
                >
                  <option value="">Select City</option>
                  {cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            {/* Service Category */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Service Category *
              </label>
              <div className="relative">
                <select
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className={selectClass(errors.skills)}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
            </div>

            {/* Years of Experience */}
            <div>
              <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience *
              </label>
              <div className="relative">
                <select
                  id="experience_years"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className={selectClass(errors.experience_years)}
                >
                  <option value="">Select experience</option>
                  {experienceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.experience_years && (
                <p className="mt-1 text-sm text-red-600">{errors.experience_years}</p>
              )}
            </div>

            {/* Citizenship Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Citizenship Image *
              </label>
              <FileUploadField
                accept="image/*"
                file={formData.citizenship_image}
                onChange={(e) => handleFileChange(e, "citizenship")}
                onClear={() => handleFileClear("citizenship")}
                error={errors.citizenship_image}
                showPreview
                hint="JPG, PNG up to 5MB"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image *
              </label>
              <FileUploadField
                accept="image/*"
                file={formData.profile_image}
                onChange={(e) => handleFileChange(e, "profile")}
                onClear={() => handleFileClear("profile")}
                error={errors.profile_image}
                showPreview
                hint="JPG, PNG up to 5MB"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              loadingText="Submitting Application..."
            >
              Submit Application
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
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
