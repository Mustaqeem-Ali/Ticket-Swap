import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Edit2 } from 'lucide-react';
import ProfileEditForm from './ProfileEditForm';
import apiClient from '@/configs/axiosClient';
import { set } from 'date-fns';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    upiId: 'john@paytm'
  });
  const [ticketsBought, setTicketsBought] = useState<any[]>([]);
  const navigate = useNavigate();
  // Function to fetch user data from backend API
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
    // Function to fetch tickets bought by the user
    const ticketBought = async ()=>{
    const response = await apiClient.get('/orders/my-orders');
    if (response.status === 200) {
      setTicketsBought(response.data.data.orders);
      console.log('Tickets bought fetched successfully:', ticketsBought);
    } else {
      console.error('Failed to fetch tickets');
      return [];
    }
    
  }
  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('ticketSwapToken');
    if (token) {
      setIsLoggedIn(true);
      // TODO: Fetch user data from backend API using token
      fetchUserData();
      ticketBought();
    }
  }, []);
useEffect(() => {
    console.log('Tickets bought updated:', ticketsBought);
  }, [ticketsBought]);
useEffect(() => {
    console.log('User data updated:', userData);
  }, [userData]);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setShowProfileDropdown(!showProfileDropdown);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ticketSwapToken');
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    navigate('/');
  };


  // Filter only active tickets for the dropdown
  const activeTickets = ticketsBought.filter(ticket => ticket.ticketId.isExpired === false);
  
  return (
    <>
      <nav className="bg-card shadow-sm border-b border-border/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">
                Ticket<span className="text-accent">-Swap</span>
              </div>
            </Link>

            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="p-2 rounded-full hover:bg-muted/20 transition-colors duration-200 transform hover:scale-105"
              >
                <User className="w-6 h-6 text-foreground" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && isLoggedIn && (
                <div className="profile-dropdown">
                  <div className="p-6">
                    {/* User Info */}
                    <div className="border-b border-border/30 pb-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{userData.name}</h3>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                          <p className="text-sm text-muted-foreground">UPI: {userData.upiId}</p>
                        </div>
                        <button
                          onClick={() => setShowEditForm(true)}
                          className="p-2 hover:bg-muted/20 rounded-full transition-colors duration-150"
                        >
                          <Edit2 className="w-4 h-4 text-accent" />
                        </button>
                      </div>
                    </div>

                    {/* Active Tickets */}
                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">
                        Active Tickets ({activeTickets.length})
                      </h4>
                      <div className="max-h-40 overflow-y-auto custom-scrollbar">
                        {activeTickets.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            No active tickets
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {activeTickets.map((ticket) => (
                              <div key={ticket.ticketId.id} className="glass-card-elevated p-3 rounded-lg hover:glass-card-hover transition-all duration-200">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-foreground text-sm">
                                       {ticket.ticketId.details.destination || ticket.ticketId.details.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                                        {ticket.ticketId.category}
                                      </span>
                                      <span>{ticket.date}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-foreground">₹{ticket.purchasePrice}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                     {/* Profile & Logout Buttons */}
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        className="w-full btn-accent text-center block"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        View Full Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full btn-secondary text-center"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Edit Modal */}
      {showEditForm && (
        <ProfileEditForm
          userData={userData}
          onClose={() => setShowEditForm(false)}
          onSave={(updatedData) => {
            setUserData(updatedData);
            setShowEditForm(false);
            // TODO: Send updated data to backend API
            // updateUserProfile(updatedData);
          }}
        />
      )}

      {/* Backdrop for dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </>
  );
};

export default Navbar;