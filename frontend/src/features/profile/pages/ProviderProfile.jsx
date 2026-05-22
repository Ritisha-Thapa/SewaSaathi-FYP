import React, { useState, useEffect } from 'react';
import { Edit, Save, RotateCcw } from 'lucide-react';
import ChangePasswordModal from '../../authentication/components/pass_change/ChangePasswordModal';
import { toast } from '../../../shared/components/layout/ToastProvider';
import Button from '../../../shared/components/ui/Button';
import { useTranslation } from 'react-i18next';

// Refactored Components
import ProfileHeader from "../components/shared/ProfileHeader";
import ProfileHero from "../components/shared/ProfileHero";
import ProfileCard from "../components/shared/ProfileCard";
import StatusBanner from "../components/shared/StatusBanner";
import ProviderProfileForm from "../components/prov/ProviderProfileForm";

const ProviderProfile = () => {
   const { t } = useTranslation();
   const [isEditing, setIsEditing] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [previewImage, setPreviewImage] = useState(null);
   const [originalProfile, setOriginalProfile] = useState(null);
   const [showPasswordModal, setShowPasswordModal] = useState(false);

   const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      bio: "",
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
            headers: { "Authorization": `Bearer ${token}` }
         });
         if (response.ok) {
            const data = await response.json();
            const fetchedProfile = {
               first_name: data.first_name || "",
               last_name: data.last_name || "",
               email: data.email || "",
               phone: data.phone || "",
               address: data.address || "",
               city: data.city || "",
               bio: data.bio || "",
               profile_image: data.profile_image || null
            };
            setFormData(fetchedProfile);
            setOriginalProfile(fetchedProfile);
         }
      } catch (error) {
         console.error("Error fetching profile:", error);
         toast.error(t('profile.load_failed', 'Could not fetch profile data.'));
      } finally {
         setIsLoading(false);
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setFormData(prev => ({ ...prev, profile_image: file }));
         setPreviewImage(URL.createObjectURL(file));
         setIsEditing(true);
      }
   };

   const handleCancel = () => {
      setFormData(originalProfile);
      setPreviewImage(null);
      setIsEditing(false);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         const token = localStorage.getItem("access");
         const data = new FormData();
         Object.keys(formData).forEach(key => {
            if (key === 'profile_image') {
               if (formData[key] instanceof File) data.append(key, formData[key]);
            } else if (formData[key]) {
               data.append(key, formData[key]);
            }
         });

         const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token}` },
            body: data
         });

         if (response.ok) {
            const updatedData = await response.json();
            const newProfile = { ...formData, profile_image: updatedData.profile_image };
            setFormData(newProfile);
            setOriginalProfile(newProfile);
            setIsEditing(false);
            setPreviewImage(null);
            toast.success(t('profile.save_success', 'Profile updated. Your changes have been saved.'));
         } else {
            toast.error(t('profile.save_failed', 'Failed to save changes. Please check your input.'));
         }
      } catch (error) {
         console.error("Error saving profile:", error);
         toast.error(t('profile.save_error', 'Something went wrong. Please try again.'));
      } finally {
         setIsSaving(false);
      }
   };

   const avatarSrc = previewImage || (formData.profile_image
      ? (typeof formData.profile_image === 'string' && formData.profile_image.startsWith('http')
         ? formData.profile_image
         : `http://127.0.0.1:8000${formData.profile_image}`)
      : `https://ui-avatars.com/api/?name=${formData.first_name || "U"}+${formData.last_name || "S"}&background=E5E7EB&color=1B3C53&bold=true`);

   return (
      <div className="max-w-4xl mx-auto space-y-6">
         <ProfileHeader 
            title="My Profile"
            onPasswordClick={() => setShowPasswordModal(true)}
            showPasswordButton={!isLoading}
         />

         {/* Verification Status */}
         {!isLoading && (
            <StatusBanner 
               type="success"
               title="Account Verified"
               message="Your documents have been approved. You are eligible to receive jobs."
            />
         )}

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
               <ProfileCard className="text-center">
                  <div className="relative inline-block group mb-4">
                     <div className="w-32 h-32 rounded-full border-4 border-gray-50 mx-auto overflow-hidden shadow-sm">
                        <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                        <Edit className="w-8 h-8" />
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                     </label>
                  </div>
                  <h3 className="text-xl font-bold text-primary">{formData.first_name} {formData.last_name}</h3>
                  <p className="text-gray-500 text-sm">{formData.city || 'City not set'}</p>
               </ProfileCard>
            </div>

            <div className="md:col-span-2 space-y-6">
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
                              <Edit size={14} className="mr-1" /> Edit
                           </Button>
                        ) : (
                           <div className="flex gap-2">
                              <Button 
                                 onClick={handleCancel}
                                 variant="ghost"
                                 fullWidth={false}
                                 className="!px-2 !py-1 font-bold text-sm text-gray-500 hover:text-gray-700"
                              >
                                 Cancel
                              </Button>
                              <Button 
                                 onClick={handleSave} 
                                 disabled={isSaving}
                                 isLoading={isSaving}
                                 variant="ghost"
                                 fullWidth={false}
                                 className="!px-2 !py-1 font-bold text-sm"
                              >
                                 {isSaving ? "Saving..." : "Save"}
                              </Button>
                           </div>
                        )
                     )
                  }
               >
                  <ProviderProfileForm 
                     formData={formData}
                     isEditing={isEditing}
                     isLoading={isLoading}
                     onInputChange={handleInputChange}
                  />
               </ProfileCard>

               <ProfileCard title="Verification Documents">
                  <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500 text-sm border border-dashed border-gray-300">
                     Documents verified on registration.
                  </div>
               </ProfileCard>
            </div>
         </div>

         <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
         />
      </div>
   );
};

export default ProviderProfile;
