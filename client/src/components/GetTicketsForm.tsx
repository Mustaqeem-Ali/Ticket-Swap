import { useEffect, useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import TicketResults from './TicketResults';
import apiClient from '@/configs/axiosClient';
import { toUpperCaseJSON } from '@/configs/toUpperCaseJSON';


const GetTicketsForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    ticketId: '',
    date: '',
    sellingPrice: '',
    details: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const categories = [
    { value: 'BUS', label: 'BUS' },
    { value: 'TRAIN', label: 'TRAIN' },
    { value: 'FLIGHT', label: 'FLIGHT' },
    { value: 'MOVIE', label: 'MOVIE' },
    { value: 'CONCERT', label: 'CONCERT' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // API call to search for tickets
    const formattedData = await toUpperCaseJSON(formData);
    console.log('Searching tickets with data:', formattedData);
    const response = await apiClient.get('/tickets/', {
      params: formattedData,
    });
      if (response.status !== 200) {
        console.error('Failed to fetch tickets');
        setIsLoading(false);
        console.log('Error fetching tickets:', response);
        return;
      }
      // Assuming response.data is an array of ticket objects
      console.log('Search results:', response);
      
      setSearchResults(response.data.data.tickets);
      setIsLoading(false);
  };

useEffect(() => {
    console.log('Updated search results:', searchResults);
  }, [searchResults]);
  
  const handleTicketRemove = (ticketId: number) => {
     setSearchResults(prev => prev.filter(ticket => ticket.id !== ticketId));
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
        <Search className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-semibold text-foreground">Find Tickets</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
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

        {/* Transport-specific fields */}
        {isTransportCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Departure Station
              </label>
              <input
                type="text"
                value={(formData.details as any).source || ''}
                onChange={(e) => updateDetails('source', e.target.value )}
                className="input-field w-full"
                placeholder="From"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Destination Station
              </label>
              <input
                type="text"
                value={(formData.details as any).destination || ''}
                onChange={(e) => updateDetails('destination', e.target.value )}
                className="input-field w-full"
                placeholder="To"
                required
              />
            </div>
          </div>
        )}

        {/* Movie-specific fields */}
        {formData.category === 'MOVIE' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Movie Title
            </label>
            <input
              type="text"
              value={(formData.details as any).title || ''}
              onChange={(e) => updateDetails('title', e.target.value )}
              className="input-field w-full"
              placeholder="Enter movie name"
              required
            />
          </div>
        )}

        {/* Concert-specific fields */}
        {formData.category === 'CONCERT' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Concert Title
            </label>
            <input
              type="text"
              value={(formData.details as any).title || ''}
              onChange={(e) => updateDetails('title', e.target.value )}
              className="input-field w-full"
              placeholder="Enter concert name"
              required
            />
          </div>
        )}

        {/* Common fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>
          {!isTransportCategory && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={(formData.details as any).location || ''}
              onChange={(e) => updateDetails('location', e.target.value )}
                className="input-field w-full"
                placeholder="Enter location"
                required
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary"
        >
          {isLoading ? 'Searching...' : 'Search Tickets'}
        </button>
      </form>

      {/* Search Results */}
      {(searchResults.length > 0 || isLoading) && (
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="text-muted-foreground mt-2">Searching for tickets...</p>
            </div>
          ) : (
            <TicketResults 
              tickets={searchResults} 
              onTicketRemove={handleTicketRemove}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GetTicketsForm;