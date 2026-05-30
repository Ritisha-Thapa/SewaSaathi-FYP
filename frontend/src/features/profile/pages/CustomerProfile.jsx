import React, { useState, useEffect } from "react";
import { Edit, Save, RotateCcw } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import ChangePasswordModal from "../../authentication/components/pass_change/ChangePasswordModal";

import ProfileHeader from "../components/shared/ProfileHeader";
import ProfileHero from "../components/shared/ProfileHero";
import ProfileCard from "../components/shared/ProfileCard";
import StatusBanner from "../components/shared/StatusBanner";
import CustomerProfileForm from "../components/cust/CustomerProfileForm";

const CustomerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/accounts/profile/`, {
                headers: { "Authorization": `Bearer ${token}` }
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
            setMessage({ type: "error", title: "Error", text: "Failed to load profile data." });
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
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!formData.first_name || !formData.last_name) {
            setMessage({ type: "error", title: "Missing Information", text: "First name and last name are required." });
            return;
        }

        setIsSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("access");
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'profile_image') {
                    if (formData[key]) data.append(key, formData[key]);
                } else {
                    data.append(key, formData[key]);
                }
            });

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/accounts/profile/`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });

            if (!response.ok) throw new Error("Failed to update profile");
            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setIsEditing(false);
            setPreviewImage(null);
            setMessage({ type: "success", title: "Success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: "error", title: "Update Failed", text: "Please try again." });
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

    const avatarSrc = previewImage || (profile?.profile_image
        ? (profile.profile_image.startsWith('http') ? profile.profile_image : `${import.meta.env.VITE_API_BASE_URL}${profile.profile_image}`)
        : `https://ui-avatars.com/api/?name=${profile?.first_name || "U"}+${profile?.last_name || "S"}&background=E5E7EB&color=1B3C53&bold=true`);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <ProfileHeader
                    title="My Profile"
                    subtitle="Manage your personal information and profile settings."
                    onPasswordClick={() => setShowPasswordModal(true)}
                    isLoading={isLoading}
                />

                {message && (
                    <StatusBanner
                        type={message.type}
                        title={message.title}
                        message={message.text}
                    />
                )}

                <ProfileHero
                    avatarSrc={avatarSrc}
                    name={profile ? `${profile.first_name} ${profile.last_name}` : "User Profile"}
                    subtext={profile?.email}
                    onImageChange={handleImageChange}
                    isLoading={isLoading}
                />

                <ProfileCard
                    title="Personal Information"
                    actions={
                        !isLoading && (
                            !isEditing ? (
                                <Button 
                                    onClick={() => setIsEditing(true)}
                                    variant="ghost"
                                    fullWidth={false}
                                    className="!px-2 !py-1 font-bold text-sm"
                                >
                                    <Edit size={16} className="mr-2" /> Edit Details
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={handleCancel}
                                        variant="ghost"
                                        fullWidth={false}
                                        className="!px-2 !py-1 font-bold text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        <RotateCcw size={16} className="mr-2" /> Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        isLoading={isSaving}
                                        variant="ghost"
                                        fullWidth={false}
                                        className="!px-2 !py-1 font-bold text-sm"
                                    >
                                        {!isSaving && <Save size={16} className="mr-2" />} 
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )
                        )
                    }
                >
                    <CustomerProfileForm
                        formData={formData}
                        profile={profile}
                        isEditing={isEditing}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                    />
                </ProfileCard>
            </main>

            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)} />
            <Footer />
        </div>
    );
};

export default CustomerProfile;
