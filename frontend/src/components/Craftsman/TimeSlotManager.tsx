import React, { useState, useEffect } from 'react';
import { TimeSlot, CreateTimeSlotRequest } from '../../types';
import { timeSlotService } from '../../services/api';

const TimeSlotManager: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<CreateTimeSlotRequest>({
    startTime: '',
    endTime: '',
    description: '',
  });

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      const slots = await timeSlotService.getMyTimeSlots();
      setTimeSlots(slots);
    } catch (error) {
      setError('Failed to load time slots');
      console.error('Failed to load time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.startTime || !formData.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    if (startTime <= new Date()) {
      setError('Start time must be in the future');
      return;
    }

    setSubmitting(true);

    try {
      await timeSlotService.createTimeSlot(formData);
      await loadTimeSlots();
      setShowForm(false);
      setFormData({
        startTime: '',
        endTime: '',
        description: '',
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create time slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (timeSlotId: number) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) {
      return;
    }

    try {
      await timeSlotService.deleteTimeSlot(timeSlotId);
      await loadTimeSlots();
    } catch (error) {
      setError('Failed to delete time slot');
      console.error('Failed to delete time slot:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDefaultDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Default to 1 hour from now
    now.setMinutes(0); // Round to nearest hour
    return now.toISOString().slice(0, 16); // Format for datetime-local input
  };

  const getDefaultEndDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2); // Default to 2 hours from now (1 hour duration)
    now.setMinutes(0);
    return now.toISOString().slice(0, 16);
  };

  const groupTimeSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: { [key: string]: TimeSlot[] } = {};

    slots.forEach(slot => {
      const date = new Date(slot.startTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

    // Sort dates
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) =>
      new Date(a).getTime() - new Date(b).getTime()
    );

    return sortedEntries;
  };

  if (loading) {
    return <div className="loading">Loading time slots...</div>;
  }

  return (
    <div className="time-slot-manager">
      <div className="manager-header">
        <h2>Time Slot Management</h2>
        <button
          className="add-slot-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Time Slot'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="time-slot-form" onSubmit={handleSubmit}>
          <h3>Create New Time Slot</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime || getDefaultDateTime()}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime || getDefaultEndDateTime()}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Available for home repairs, Emergency calls, etc."
              rows={2}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Time Slot'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="time-slots-list">
        {timeSlots.length === 0 ? (
          <div className="no-slots">
            <p>No time slots created yet.</p>
            <p>Add time slots to allow clients to book appointments with you.</p>
          </div>
        ) : (
          <>
            <h3>Your Available Time Slots</h3>
            {groupTimeSlotsByDate(timeSlots).map(([date, slots]) => (
              <div key={date} className="date-group">
                <h4 className="date-header">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h4>
                <div className="slots-grid">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`time-slot-card ${!slot.isAvailable ? 'booked' : ''}`}
                    >
                      <div className="slot-time">
                        {new Date(slot.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} - {new Date(slot.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>

                      {slot.description && (
                        <div className="slot-description">{slot.description}</div>
                      )}

                      <div className="slot-status">
                        {slot.isAvailable ? (
                          <span className="status-available">Available</span>
                        ) : (
                          <span className="status-booked">Booked</span>
                        )}
                      </div>

                      {slot.isAvailable && (
                        <button
                          className="delete-slot-button"
                          onClick={() => handleDelete(slot.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TimeSlotManager;