import React from 'react';
import { Camera } from 'lucide-react';
import Skeleton from '../../../../shared/components/layout/Skeleton';

const ProfileHero = ({
  avatarSrc,
  onImageChange,
  isLoading,
  name,
  subtext,
  showCover = true
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {showCover && (
        <div className="h-32 bg-gradient-to-r from-primary to-primary-hover"></div>
      )}

      <div className={`px-8 pb-8 ${showCover ? '-mt-16' : 'pt-8'}`}>
        <div className="flex flex-col md:flex-row md:items-start gap-4">
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

            {!isLoading && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                <Camera className="w-8 h-8" />
                <input type="file" hidden accept="image/*" onChange={onImageChange} />
              </label>
            )}
          </div>

          <div className="flex-grow mt-4 md:-mt-1">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-48 mb-1" />
                <Skeleton className="h-5 w-64" />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white leading-tight">{name}</h2>
                <p className="text-white font-sm -mt-4">{subtext}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
