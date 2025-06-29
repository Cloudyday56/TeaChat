import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { useState } from 'react';
import { Camera, User, Mail, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile, deleteAccount} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  //compress image
  const compressImage = (imgSrc, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imgSrc;
      
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        
        // Calculate dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

        // Calculate approximate size in bytes
        // Remove the data URL prefix to get just the base64 string
        const base64String = compressedBase64.split(',')[1];
        // base64 represents 6 bits per character, so 4 characters = 3 bytes
        const approximateSizeInBytes = Math.ceil((base64String.length * 3) / 4);
        
        resolve({
          data: compressedBase64,
          size: approximateSizeInBytes
        });
      };
    });
  };

  //image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const compressedImage = await compressImage(reader.result);

      // Check compressed size (1MB limit)
      const MAX_COMPRESSED_SIZE = 1024 * 1024; // 1MB in bytes

      if (compressedImage.size > MAX_COMPRESSED_SIZE) {
        toast.error(`Image is too large. Please use a smaller image.`);
        return;
      }

      // const base64Image = reader.result; //base64 format
      setSelectedImage(compressedImage.data); //set the selected image in state
      await updateProfile({ profilePic: compressedImage.data });
    }
  }

  //delete account confirmation
  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate('/login');
  };


  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload} //run the function when file is selected
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* user information section */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>

            {/* Centered Delete Button */}
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-error btn-md flex items-center gap-2"
              >
                <Trash2 className="size-5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-base-300 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
            <p className="mb-6">Are you sure you want to delete your account?</p>
            <div className="flex justify-end gap-3">
              <button 
                className="btn btn-sm" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-sm btn-error" 
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProfilePage