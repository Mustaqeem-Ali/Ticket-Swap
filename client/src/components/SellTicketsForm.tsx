import { useState } from 'react';
import { PlusCircle, Calendar, MapPin, Tag, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmationPopup from './ConfirmationPopup';
import apiClient from '@/configs/axiosClient';
import {toUpperCaseJSON} from '@/configs/toUpperCaseJSON';

const SellTicketsForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    ticketId: '',
    date: '',
    sellingPrice: '',
    details: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'BUS', label: 'BUS' },
    { value: 'TRAIN', label: 'TRAIN' },
    { value: 'FLIGHT', label: 'FLIGHT' },
    { value: 'MOVIE', label: 'MOVIE' },
    { value: 'CONCERT', label: 'CONCERT' },
    { value: 'EVENT', label: 'EVENT' }
  ];

  const validateForm = () => {
    if (!formData.category || !formData.date || !formData.sellingPrice) {
      return false;
    }

    if (isNaN(Number(formData.sellingPrice)) || Number(formData.sellingPrice) <= 0) {
      return false;
    }

    const details = formData.details as any;
    
    if (['BUS', 'TRAIN', 'FLIGHT'].includes(formData.category)) {
      if (!details.source || !details.destination || !details.seatNumber || !details["Boarding Time"]) {
        return false;
      }
      
    } else {
      if (!details.title || !details.location || !details.seatNumber || !details["time of show"]) {
        return false;
      }
    }


    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(toUpperCaseJSON(formData));
    var t = validateForm();
    console.log('Form validation result:', t);
    if (!t) {
      alert('Please fill in all required fields correctly');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('ticketSwapToken');
    if (!token) {
      localStorage.setItem('pendingSellForm', JSON.stringify(formData));
      navigate('/login');
      return;
    }
    console.log('formData:', formData);
    setIsLoading(true);
    setSuccess(false);

    // Convert price to number before sending
    const submissionData = {
      ...formData,
      sellingPrice: Number(formData.sellingPrice)
    };
    console.log('submissionData:', submissionData.sellingPrice);

    try {
      const response = await apiClient.post('/tickets/', submissionData);
      if (response.status !== 201 && response.status !== 200) {
        console.error('Failed to list ticket');
        setIsLoading(false);
        alert('Failed to list ticket. Please check your details and try again.');
        return;
      }
      setSuccess(true);
      setShowConfirmation(true);
      setFormData({
        category: '',
        ticketId: '',
        date: '',
        sellingPrice: '',
        details: {}
      });
    } catch (error: any) {
      setIsLoading(false);
      alert(
        error?.response?.data?.message ||
          'Failed to list ticket. Please check your details and try again.'
      );
      console.error(error);
      return;
    }finally{
    setIsLoading(false);
  }};

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSuccess(true);
  };

  const isTransportCategory = ['BUS', 'TRAIN', 'FLIGHT'].includes(formData.category);
  
  const updateDetails = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value
      }
    }));
  };

  return (
    <div className="card-flat p-6">
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-semibold text-foreground">Sell Your Tickets</h2>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-[var(--radius)] mb-6">
          ✅ Your ticket has been listed successfully! It will be visible to buyers shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field w-full"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
 <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Tag className="w-4 h-4 inline mr-2" />
            Ticket ID *
          </label>
          <input
            type="text"
            value={formData.ticketId}
            onChange={(e) => setFormData({ ...formData, ticketId: e.target.value })}
            className="input-field w-full"
            placeholder="Enter your ticket ID/number"
            required
          />
        </div>
        {/* Category-specific fields */}
        {formData.category && (
          <div className="space-y-4">
            {/* Common Date and Price fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter selling price"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Transport-specific fields (Train, Flight, Bus) */}
            {isTransportCategory && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Source/Departure *
                    </label>
                    <input
                      type="text"
                      value={(formData.details as any).source || ''}
                      onChange={(e) => updateDetails('source', e.target.value)}
                      className="input-field w-full"
                      placeholder="From station/airport"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Destination *
                    </label>
                    <input
                      type="text"
                      value={(formData.details as any).destination || ''}
                      onChange={(e) => updateDetails('destination', e.target.value)}
                      className="input-field w-full"
                      placeholder="To station/airport"
                      required
                    />
                  </div>
                </div>

                {formData.category === 'TRAIN' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Train Name
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any).trainName || ''}
                          onChange={(e) => updateDetails('trainName', e.target.value)}
                          className="input-field w-full"
                          placeholder="Train Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Coach Number
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any).coach || ''}
                          onChange={(e) => updateDetails('coach', e.target.value)}
                          className="input-field w-full"
                          placeholder="Coach"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Seat Number *
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any).seatNumber || ''}
                          onChange={(e) => updateDetails('seatNumber', e.target.value)}
                          className="input-field w-full"
                          placeholder="Seat Number"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Boarding Time *
                        </label>
                        <input
                          type="time"
                          value={(formData.details as any)["Boarding Time"] || ''}
                          onChange={(e) => updateDetails('Boarding Time', e.target.value)}
                          className="input-field w-full"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.category === 'FLIGHT' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Flight Name
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any)["Flight Name"] || ''}
                          onChange={(e) => updateDetails('Flight Name', e.target.value)}
                          className="input-field w-full"
                          placeholder="Flight Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Flight Number
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any)["Flight Number"] || ''}
                          onChange={(e) => updateDetails('Flight Number', e.target.value)}
                          className="input-field w-full"
                          placeholder="Flight Number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Class
                        </label>
                        <select
                          value={(formData.details as any).Class || ''}
                          onChange={(e) => updateDetails('Class', e.target.value)}
                          className="input-field w-full"
                        >
                          <option value="">Select Class</option>
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                          <option value="First">First</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Seat Number *
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any).seatNumber || ''}
                          onChange={(e) => updateDetails('seatNumber', e.target.value)}
                          className="input-field w-full"
                          placeholder="Seat Number"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Boarding Time *
                        </label>
                        <input
                          type="time"
                          value={(formData.details as any)["Boarding Time"] || ''}
                          onChange={(e) => updateDetails('Boarding Time', e.target.value)}
                          className="input-field w-full"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.category === 'BUS' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bus Type
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any)["Bus Type"] || ''}
                          onChange={(e) => updateDetails('Bus Type', e.target.value)}
                          className="input-field w-full"
                          placeholder="Bus Type (e.g., Super Luxury)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bus Number
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any)["Bus Number"] || ''}
                          onChange={(e) => updateDetails('Bus Number', e.target.value)}
                          className="input-field w-full"
                          placeholder="Service Code or Bus Number, Ex:8149"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Seat Number *
                        </label>
                        <input
                          type="text"
                          value={(formData.details as any).seatNumber || ''}
                          onChange={(e) => updateDetails('seatNumber', e.target.value)}
                          className="input-field w-full"
                          placeholder="Seat Number"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Boarding Time *
                        </label>
                        <input
                          type="time"
                          value={(formData.details as any)["Boarding Time"] || ''}
                          onChange={(e) => updateDetails('Boarding Time', e.target.value)}
                          className="input-field w-full"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Movie-specific fields */}
            {formData.category === 'MOVIE' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    value={(formData.details as any).title || ''}
                    onChange={(e) => updateDetails('title', e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter movie name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={(formData.details as any).location || ''}
                      onChange={(e) => updateDetails('location', e.target.value)}
                      className="input-field w-full"
                      placeholder="Ex: AMB Cinemas, Hyderabad"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Seat Number *
                    </label>
                    <input
                      type="text"
                      value={(formData.details as any).seatNumber || ''}
                      onChange={(e) => updateDetails('seatNumber', e.target.value)}
                      className="input-field w-full"
                      placeholder="Seat Number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Show Time *
                    </label>
                    <input
                      type="time"
                      value={(formData.details as any)["time of show"] || ''}
                      onChange={(e) => updateDetails('time of show', e.target.value)}
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Concert-specific fields */}
            {formData.category === 'CONCERT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Concert Title *
                  </label>
                  <input
                    type="text"
                    value={(formData.details as any).title || ''}
                    onChange={(e) => updateDetails('title', e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter concert name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={(formData.details as any).location || ''}
                      onChange={(e) => updateDetails('location', e.target.value)}
                      className="input-field w-full"
                      placeholder="Ex: LB Stadium, Hyderabad"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Seat Number *
                    </label>
                    <input
                      type="text"
                      value={(formData.details as any).seatNumber || ''}
                      onChange={(e) => updateDetails('seatNumber', e.target.value)}
                      className="input-field w-full"
                      placeholder="Seat Number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Show Time *
                    </label>
                    <input
                      type="time"
                      value={(formData.details as any)["time of show"] || ''}
                      onChange={(e) => updateDetails('time of show', e.target.value)}
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary"
        >
          {isLoading ? 'Listing Ticket...' : 'List Ticket for Sale'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-muted/20 rounded-[var(--radius)]">
        <h4 className="font-medium text-foreground mb-2">Important Notes:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Ensure your ticket details are accurate</li>
          <li>• Upload clear photos of your ticket if required</li>
          <li>• You'll receive payment after successful transfer</li>
          <li>• Ticket transfer will be verified before payment release</li>
        </ul>
      </div>

      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmationClose}
        title="Ticket Listed Successfully!"
        message="Your ticket has been listed and will be visible to buyers shortly. You'll receive payment after successful transfer."
        confirmText="Got it!"
        type="sell"
      />
    </div>
  );
};

export default SellTicketsForm;