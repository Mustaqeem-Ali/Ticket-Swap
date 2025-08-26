import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Edit, ArrowLeft, ShoppingBag, Store, Calendar, MapPin, Clock, Trash2, ArrowRight, IndianRupee, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProfileEditForm from '@/components/ProfileEditForm';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import TicketDetailsPopup from '@/components/TicketDetailsPopup';
import trainIcon from '@/assets/train-icon.png';
import flightIcon from '@/assets/flight-icon.png';
import busIcon from '@/assets/bus-icon.png';
import concertIcon from '@/assets/concert-icon.png';
import apiClient from '@/configs/axiosClient';

interface Ticket {
  id: number;
  category: string;
  date: string;
  sellingPrice: number;
  seller?: string;
  details: any;
  status?: 'sold' | 'active' | 'expired';
  purchaseDate?: string;
}

const Profile = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    upiId: 'john@paytm',
    createdAt: '2023-06-15'
  });
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('ticketSwapToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Mock data - in real app, fetch from backend
  const [ticketsBought, setTicketsBought] = useState<any[]>([]);
  const [ticketsListed, setTicketsListed] = useState<any[]>([]);

  const fetchUserData = async () => {
  try {
    const response = await apiClient.get('/users/me');
    if (response.status === 200) {
      setUserData(response.data.data.user);
      console.log('User data fetched successfully:', response.data.data.user);
    } else {
      console.error('Failed to fetch user data. Status:', response.status);
    }
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
  }
};
  const ticketBought = async ()=>{
    const response = await apiClient.get('/orders/my-orders');
    if (response.status === 200) {
      setTicketsBought(response.data.data.orders);
      console.log('Tickets bought fetched successfully:', response);
      console.log('hello this is tickets bought function');
    } else {
      console.error('Failed to fetch tickets');
      return [];
    }
  }
  const ticketListed = async ()=>{
    const response = await apiClient.get('/tickets/my-tickets'); 
    if (response.status === 200) {
      setTicketsListed(response.data.data.tickets);
      console.log('original response:', response);
      console.log('Tickets listed fetched successfully:', ticketsListed);
      console.log('hello this is tickets listed function');
    } else {
      console.log(response.data.message);
      return [];
    }}
 useEffect(() => {
    const token = localStorage.getItem('ticketSwapToken');
    if (token) {
      // Fetch user data and tickets
      const fetchData = async () => {
      await fetchUserData();
      await ticketBought();
      await ticketListed();
    }
      fetchData();
    }
  }, []);

  useEffect(() => {
    console.log('Tickets Bought:', ticketsBought);
  }, [ticketsBought]);
  useEffect(() => {
    console.log('Tickets Listed:', ticketsListed);
  }, [ticketsListed]);

  const getTicketIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'train': return trainIcon;
      case 'flight': return flightIcon;
      case 'bus': return busIcon;
      case 'concert':
      case 'movie': return concertIcon;
      default: return concertIcon;
    }
  };

  const handleDetailsClick = (ticket: Ticket) => {
    setSelectedTicket({...ticket});
    setShowDetails(true);
  };

  const isTransportTicket = (ticket: Ticket) => {
    return ['bus', 'train', 'flight'].includes(ticket.category.toLowerCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const t = date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    console.log('Formatted date:', t);
    return t;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleProfileUpdate = async (updatedData: any) => {
    const response = await apiClient.patch('/users/me', updatedData);
    if (response.status === 200) {
      setUserData(response.data.data.user);
      console.log('Profile updated successfully:', response.data.data.user);
      setShowEditForm(false);
    } else {
      console.error('Failed to update profile');
    }
  };

  const handleDeleteUser = async () => {
    try {
      // API call to delete user
      const response = await apiClient.delete('/users/me');
      
      console.log('User deletion API called successfully');
      
      // Remove token and redirect to home
      localStorage.removeItem('ticketSwapToken');
      navigate('/');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 glass-card hover:glass-card-hover rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details */}
          <div className="lg:col-span-1">
            {/* User Details Card */}
            <div className="glass-card p-6 fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {userData.name}
                </h2>
                <p className="text-muted-foreground mb-1">{userData.email}</p>
                <p className="text-sm text-muted-foreground">
                  UPI: {userData.upiId}
                </p>
              </div>

              <div className="border-t border-border/30 pt-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(userData.createdAt)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowEditForm(true)}
                className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Tickets Bought */}
          <div className="glass-card p-6 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Tickets Bought
              </h3>
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm font-medium">
                {ticketsBought.length}
              </span>
            </div>

            {ticketsBought.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Your ticket bucket is empty
                </p>
                <p className="text-muted-foreground/70 text-sm">
                  Start exploring and buy your first ticket!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ticketsBought.map((order) => (
                  <div key={order._id} className="ticket-card p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        {isTransportTicket(order.ticketId) ? (
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-foreground">
                              {order.ticketId.details.source}
                            </h4>
                            <ArrowRight className="w-5 h-5 text-accent" />
                            <h4 className="text-lg font-bold text-foreground">
                              {order.ticketId.details.destination}
                            </h4>
                          </div>
                        ) : (
                          <h4 className="text-lg font-bold text-foreground mb-2">
                            {order.ticketId.details.title}
                          </h4>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.ticketId.date)}
                          </span>
                          {order.ticketId.details.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {order.ticketId.details.location}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground/70">
                          Purchased on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="flex items-center text-2xl font-bold text-accent mb-2">
                          <IndianRupee className="w-6 h-6" />
                          {order.purchasePrice}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDetailsClick(order.ticketId)}
                            className="btn-secondary flex items-center gap-2"
                          >
                            <Info className="w-4 h-4" />
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tickets Listed */}
          <div className="glass-card p-6 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Tickets Listed
              </h3>
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm font-medium">
                {ticketsListed.length}
              </span>
            </div>

            {ticketsListed.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No tickets listed yet
                </p>
                <p className="text-muted-foreground/70 text-sm">
                  Start selling your unused tickets!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ticketsListed
                  .filter((ticket) => ticket.details) // ignore invalid
                  .map((ticket) => (
                    <div key={ticket.id} className="ticket-card p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(
                                ticket.status!
                              )}`}
                            />
                            <span className="text-sm font-medium capitalize text-foreground">
                              {ticket.status}
                            </span>
                          </div>

                          {isTransportTicket(ticket) ? (
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-foreground">
                                {ticket.details.source}
                              </h4>
                              <ArrowRight className="w-5 h-5 text-accent" />
                              <h4 className="text-lg font-bold text-foreground">
                                {ticket.details.destination}
                              </h4>
                            </div>
                          ) : (
                            <h4 className="text-lg font-bold text-foreground mb-2">
                              {ticket.details.title}
                            </h4>
                          )}

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(ticket.date)}
                            </span>
                            {ticket.details.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {ticket.details.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="flex items-center text-2xl font-bold text-accent mb-2">
                            <IndianRupee className="w-6 h-6" />
                            {ticket.sellingPrice}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDetailsClick(ticket)}
                              className="btn-secondary flex items-center gap-2"
                            >
                              <Info className="w-4 h-4" />
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PROFILE EDIT MODAL */}
      {showEditForm && (
        <ProfileEditForm
          userData={userData}
          onClose={() => setShowEditForm(false)}
          onSave={handleProfileUpdate}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <ConfirmationPopup
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteUser}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your tickets and data will be lost."
          confirmText="Delete Forever"
          type="sell"
        />
      )}

      {/* TICKET DETAILS MODAL */}
      <TicketDetailsPopup
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        ticket={selectedTicket}
      />
    </div>
  );
};


export default Profile;