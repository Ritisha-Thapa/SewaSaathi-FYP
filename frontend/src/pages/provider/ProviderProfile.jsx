import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, Save, Loader2, X } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import NotificationPopup from '../../components/common/NotificationPopup';

const ProviderProfile = () => {
   const [isEditing, setIsEditing] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [previewImage, setPreviewImage] = useState(null);
   const [originalProfile, setOriginalProfile] = useState(null);
   const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

   const [profile, setProfile] = useState({
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
            setProfile(fetchedProfile);
            setOriginalProfile(fetchedProfile);
         }
      } catch (error) {
         console.error("Error fetching profile:", error);
         showNotification('error', 'Failed to Load', 'Could not fetch profile data.');
      } finally {
         setIsLoading(false);
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfile(prev => ({ ...prev, [name]: value }));
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setProfile(prev => ({ ...prev, profile_image: file }));
         setPreviewImage(URL.createObjectURL(file));
         setIsEditing(true);
      }
   };

   const handleCancel = () => {
      setProfile(originalProfile);
      setPreviewImage(null);
      setIsEditing(false);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         const token = localStorage.getItem("access");
         const data = new FormData();
         data.append("first_name", profile.first_name);
         data.append("last_name", profile.last_name);
         data.append("phone", profile.phone);
         data.append("address", profile.address);
         data.append("city", profile.city);
         if (profile.bio) data.append("bio", profile.bio);

         if (profile.profile_image instanceof File) {
            data.append("profile_image", profile.profile_image);
         }

         const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token}` },
            body: data
         });

         if (response.ok) {
            const updatedData = await response.json();
            const newProfile = { ...profile, profile_image: updatedData.profile_image };
            setProfile(newProfile);
            setOriginalProfile(newProfile);
            setIsEditing(false);
            setPreviewImage(null);
            showNotification('success', 'Profile Updated', 'Your changes have been saved successfully.');
         } else {
            showNotification('error', 'Update Failed', 'Failed to save changes. Please check input.');
         }
      } catch (error) {
         console.error("Error saving profile:", error);
         showNotification('error', 'Error', 'Something went wrong. Please try again.');
      } finally {
         setIsSaving(false);
      }
   };

   const showNotification = (type, title, message) => {
      setNotification({ isOpen: true, type, title, message });
   };

   const avatarSrc = previewImage ||
      (profile.profile_image
         ? (typeof profile.profile_image === 'string' && profile.profile_image.startsWith('http')
            ? profile.profile_image
            : `http://127.0.0.1:8000${profile.profile_image}`)
         : `https://ui-avatars.com/api/?name=${profile.first_name || "U"}+${profile.last_name || "S"}&background=E5E7EB`);

   if (isLoading) {
      return (
         <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="w-48 h-8 font-bold text-[#1B3C53]" />
            <Skeleton className="w-full h-24 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-1">
                  <Skeleton className="w-full h-64 rounded-xl" />
               </div>
               <div className="md:col-span-2">
                  <Skeleton className="w-full h-96 rounded-xl" />
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto space-y-6">
         <h2 className="text-2xl font-bold text-[#1B3C53]">My Profile</h2>

         {/* Verification Status */}
         <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
               <h3 className="font-bold text-green-800">Account Verified</h3>
               <p className="text-sm text-green-700">Your documents have been approved. You are eligible to receive jobs.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Col: Photo & Main Info */}
            <div className="md:col-span-1 space-y-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="relative inline-block group">
                     <div className="w-32 h-32 rounded-full border-4 border-gray-100 mx-auto overflow-hidden shadow-sm">
                        <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                     <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                        <Camera className="w-8 h-8" />
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                     </label>
                  </div>
                  <h3 className="text-xl font-bold mt-4 text-[#1B3C53]">{profile.first_name} {profile.last_name}</h3>
                  <p className="text-gray-500 text-sm">{profile.city || 'City not set'}</p>
               </div>
            </div>

            {/* Right Col: Details Form */}
            <div className="md:col-span-2">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-gray-800">Personal Information</h3>
                     <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm text-[#1B3C53] hover:underline"
                     >
                        {isEditing ? 'Cancel' : 'Edit Details'}
                     </button>
                  </div>

                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                           <input
                              disabled={!isEditing}
                              name="first_name"
                              value={profile.first_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-[#1B3C53]"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                           <input
                              disabled={!isEditing}
                              name="last_name"
                              value={profile.last_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-[#1B3C53]"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                           <input
                              disabled={!isEditing}
                              name="phone"
                              value={profile.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-[#1B3C53]"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                           <input
                              disabled
                              value={profile.email}
                              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                           <input
                              disabled={!isEditing}
                              name="address"
                              value={profile.address}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-[#1B3C53]"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                           <input
                              disabled={!isEditing}
                              name="city"
                              value={profile.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-[#1B3C53]"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                           disabled={!isEditing}
                           name="bio"
                           value={profile.bio}
                           onChange={handleInputChange}
                           rows="4"
                           placeholder="Tell customers a bit about yourself..."
                           className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-[#1B3C53]"
                        />
                     </div>

                     {isEditing && (
                        <div className="flex justify-end gap-3 pt-4">
                           <button onClick={handleCancel} className="px-6 py-2 border text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                              Cancel
                           </button>
                           <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-[#1B3C53] text-white font-medium rounded-lg hover:bg-[#1a3248] flex items-center justify-center gap-2 disabled:opacity-75">
                              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Changes
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               {/* Documents Section */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                  <h3 className="font-bold text-gray-800 mb-4">Verification Documents</h3>
                  <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                     Documents verified on registration.
                  </div>
               </div>
            </div>
         </div>

         <NotificationPopup
            isOpen={notification.isOpen}
            onClose={() => setNotification({ ...notification, isOpen: false })}
            type={notification.type}
            title={notification.title}
            message={notification.message}
         />
      </div>
   );
};

export default ProviderProfile;
