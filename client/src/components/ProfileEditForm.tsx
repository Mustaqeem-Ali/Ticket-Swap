import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '@/configs/axiosClient';
import {toUpperCaseJSON} from '@/configs/toUpperCaseJSON';

interface ProfileEditFormProps {
  userData: {
    name: string;
    email: string;
    upiId: string;
  };
  onClose: () => void;
  onSave: (data: { name: string; email: string; upiId: string }) => void;
}

const ProfileEditForm = ({ userData, onClose, onSave }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // API call to update user profile
    try {
      const formattedData = toUpperCaseJSON(formData);
      setFormData(formattedData);
      
      // Assuming the API endpoint is /users/me for updating user profile
    const response = await apiClient.patch('/users/me', formattedData);
    if (response.status !== 200) {
      console.error('Failed to update profile');
      onSave(formData); 
      setIsLoading(false);
      return;
    }} catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
      return;}
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-[var(--radius)] shadow-xl max-w-md w-full p-6 fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors duration-150"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;