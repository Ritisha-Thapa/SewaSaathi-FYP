import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Mail, Camera, Save, X, Edit, CheckCircle, Loader2 } from "lucide-react";
import DashboardHeader from "../../components/customer/DashboardHeader";
import Footer from "../../components/customer/Footer";
import Skeleton from "../../components/Skeleton";

const CustomerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
        profile_image: null
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("access");
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = "/login";
                    return;
                }
                throw new Error("Failed to fetch profile");
            }
            const data = await response.json();

            setProfile(data);
            setFormData({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                phone: data.phone || "",
                address: data.address || "",
                city: data.city || "",
                profile_image: null
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage({ type: "error", text: "Failed to load profile data. Please log in again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profile_image: file }));
            setPreviewImage(URL.createObjectURL(file));
            setIsEditing(true); // Automatically enter edit mode when image is chosen
        }
    };

    const handleSave = async () => {
        // Basic validation
        if (!formData.first_name || !formData.last_name) {
            setMessage({ type: "error", text: "First name and last name are required." });
            return;
        }

        setIsSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("access");
            const data = new FormData();
            data.append("first_name", formData.first_name);
            data.append("last_name", formData.last_name);
            data.append("phone", formData.phone);
            data.append("address", formData.address);
            data.append("city", formData.city);
            if (formData.profile_image) {
                data.append("profile_image", formData.profile_image);
            }

            const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: data
            });

            if (!response.ok) throw new Error("Failed to update profile");
            const updatedProfile = await response.json();

            setProfile(updatedProfile);
            setIsEditing(false);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", text: "Failed to update profile. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!profile) return;
        setFormData({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            phone: profile.phone || "",
            address: profile.address || "",
            city: profile.city || "",
            profile_image: null
        });
        setPreviewImage(null);
        setIsEditing(false);
        setMessage(null);
    };
    // avatar fallback using real initials
    const avatarSrc =
        previewImage ||
        (profile?.profile_image
            ? (profile.profile_image.startsWith('http') ? profile.profile_image : `http://127.0.0.1:8000${profile.profile_image}`)
            : `https://ui-avatars.com/api/?name=${profile?.first_name || "U"}+${profile?.last_name || "S"}&background=E5E7EB`);


    return (
        <div className="flex flex-col min-h-screen bg-[#F9F5F0] font-sans">
            <DashboardHeader />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1B3C53]">My Profile</h1>
                    <p className="text-gray-600">Manage your personal information and profile settings.</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 transition-all ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header/Cover Background */}
                    <div className="h-32 bg-gradient-to-r from-[#1B3C53] to-[#2a5a7d]"></div>

                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row md:items-end gap-6">

                            {/*  circular avatar */}
                            <div className="relative group">

                                {isLoading ? (
                                    <Skeleton className="w-32 h-32 rounded-full border-4 border-white shadow-md" />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                                        <img
                                            src={avatarSrc}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                                    <Camera className="w-8 h-8" />
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                </label>

                            </div>

                            <div className="flex-grow">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-48 mb-2" />
                                        <Skeleton className="h-5 w-64" />
                                    </>
                                ) : profile ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {profile.first_name} {profile.last_name}
                                        </h2>
                                        <p className="text-gray-500 font-medium">{profile.email}</p>
                                    </>
                                ) : (
                                    <div className="text-red-500">Failed to load profile. Please refresh.</div>
                                )}
                            </div>

                            {!isLoading && (
                                !isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2.5 bg-[#1B3C53] text-white rounded-xl hover:bg-[#1a3248] transition flex items-center gap-2 font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCancel}
                                            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="px-6 py-2.5 bg-[#1B3C53] text-white rounded-xl hover:bg-[#1a3248] transition flex items-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" /> First Name
                                    </label>
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    ) : (
                                        isEditing ? (
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] outline-none transition"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 border border-transparent">{profile?.first_name}</p>
                                        )
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" /> Last Name
                                    </label>
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    ) : (
                                        isEditing ? (
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] outline-none transition"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 border border-transparent">{profile?.last_name}</p>
                                        )
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" /> Email Address (Read-only)
                                    </label>
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500 border border-gray-200 flex items-center gap-2 cursor-not-allowed">
                                            {profile?.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" /> Phone Number (Read-only)
                                    </label>
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500 border border-gray-200 flex items-center gap-2 cursor-not-allowed">
                                            {profile?.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" /> City
                                    </label>
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-full rounded-xl" />
                                    ) : (
                                        isEditing ? (
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] outline-none transition"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 border border-transparent">{profile?.city}</p>
                                        )
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" /> Address
                                    </label>
                                    {isLoading ? (
                                        <Skeleton className="h-24 w-full rounded-xl" />
                                    ) : (
                                        isEditing ? (
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows="2"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] outline-none transition resize-none"
                                            ></textarea>
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 border border-transparent min-h-[50px]">{profile?.address || "No address provided"}</p>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CustomerProfile;
