import React, { useState } from 'react';
import { CreateProfileRequest, ServiceCategory } from '../../types';

interface ProfileFormProps {
  initialData?: CreateProfileRequest;
  onSubmit: (data: CreateProfileRequest) => void;
  loading: boolean;
  isEdit?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  loading,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<CreateProfileRequest>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    qualifications: initialData?.qualifications || '',
    workingHours: initialData?.workingHours || '',
    category: initialData?.category || ServiceCategory.Other,
    location: initialData?.location || '',
  });

  const [errors, setErrors] = useState<Partial<CreateProfileRequest>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof CreateProfileRequest]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProfileRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.qualifications.trim()) {
      newErrors.qualifications = 'Qualifications are required';
    }

    if (!formData.workingHours.trim()) {
      newErrors.workingHours = 'Working hours are required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Update Profile' : 'Create Profile'}</h3>

      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <div className="error-text">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <div className="error-text">{errors.phone}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Service Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {Object.values(ServiceCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="City or area where you provide services"
          value={formData.location}
          onChange={handleChange}
          className={errors.location ? 'error' : ''}
        />
        {errors.location && <div className="error-text">{errors.location}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="workingHours">Working Hours *</label>
        <input
          type="text"
          id="workingHours"
          name="workingHours"
          placeholder="e.g., Mon-Fri 9AM-6PM, Weekends by appointment"
          value={formData.workingHours}
          onChange={handleChange}
          className={errors.workingHours ? 'error' : ''}
        />
        {errors.workingHours && <div className="error-text">{errors.workingHours}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="qualifications">Qualifications & Experience *</label>
        <textarea
          id="qualifications"
          name="qualifications"
          rows={4}
          placeholder="Describe your experience, certifications, and qualifications..."
          value={formData.qualifications}
          onChange={handleChange}
          className={errors.qualifications ? 'error' : ''}
        />
        {errors.qualifications && <div className="error-text">{errors.qualifications}</div>}
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
      </button>
    </form>
  );
};

export default ProfileForm;