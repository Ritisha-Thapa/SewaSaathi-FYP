import React, { useState } from 'react';
import { Camera, CheckCircle, Clock } from 'lucide-react';

const ProviderProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Ram Kumar",
        email: "ram.kumar@example.com",
        phone: "9841234567",
        address: "Koteshwor, Kathmandu",
        bio: "Experienced plumber with 5+ years of experience in residential and commercial plumbing.",
    });

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
               <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto overflow-hidden">
                     {/* Placeholder for real image */}
                     <img src="https://ui-avatars.com/api/?name=Ram+Kumar&background=0D8ABC&color=fff&size=128" alt="Profile" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-[#1B3C53] text-white rounded-full hover:bg-[#1a3248]">
                     <Camera size={16} />
                  </button>
               </div>
               <h3 className="text-xl font-bold mt-4 text-[#1B3C53]">{profile.name}</h3>
               <p className="text-gray-500 text-sm">Plumbing Specialist</p>
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
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                     <input 
                       disabled={!isEditing}
                       value={profile.name}
                       className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input 
                        disabled={!isEditing}
                        value={profile.phone}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500"
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
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                     <input 
                       disabled={!isEditing}
                       value={profile.address}
                       className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                     <textarea 
                       disabled={!isEditing}
                       value={profile.bio}
                       rows="4"
                       className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg disabled:text-gray-500"
                     />
                  </div>

                  {isEditing && (
                     <div className="flex justify-end pt-4">
                        <button className="px-6 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#1a3248]">
                           Save Changes
                        </button>
                     </div>
                  )}
               </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                <h3 className="font-bold text-gray-800 mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center text-blue-700 text-xs font-bold">PDF</div>
                         <div>
                            <p className="text-sm font-medium text-gray-700">Citizenship_Front.pdf</p>
                            <p className="text-xs text-gray-500">Verified on Jan 10, 2024</p>
                         </div>
                      </div>
                      <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">Approved</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center text-blue-700 text-xs font-bold">PDF</div>
                         <div>
                            <p className="text-sm font-medium text-gray-700">Citizenship_Back.pdf</p>
                            <p className="text-xs text-gray-500">Verified on Jan 10, 2024</p>
                         </div>
                      </div>
                      <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">Approved</span>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
