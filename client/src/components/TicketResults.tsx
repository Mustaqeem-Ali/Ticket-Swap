import { useState } from 'react';
import { ArrowRight, MapPin, Calendar, IndianRupee, Info } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';
import TicketDetailsPopup from './TicketDetailsPopup';
import apiClient from '@/configs/axiosClient';

interface Seller {
  _id:string;
  name: string;
}
interface Ticket {
  _id: string;
  category: string;
  date: string;
  sellingPrice: number;
  seller: Seller;
  ticketId : string,
  details: any;
}

interface TicketResultsProps {
  tickets: Ticket[] | undefined,
  onTicketRemove: (ticketId: number) => void;
}

const TicketResults = ({ tickets, onTicketRemove }: TicketResultsProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleBuyClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowConfirmation(true);

  };

  const handleDetailsClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetails(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedTicket) return;
    
    const response = await apiClient.post('/orders/',{ticketId : selectedTicket._id});
    if (response.status !== 201) {
      console.error('Failed to purchase ticket');
      setShowConfirmation(false);
      return;
    }
  };
  

  const isTransportTicket = (ticket: Ticket) => {
    return ['bus', 'train', 'flight'].includes(ticket.category.toLowerCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tickets found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Tickets</h3>
        
        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-card p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
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
                
                <p className="text-sm text-muted-foreground mt-1">
                  Sold by: {ticket.seller.name}
                </p>
              </div>
              
              <div className="text-right ml-3.5">
                <div className="flex items-center text-2xl font-bold text-accent mb-2">
                  <IndianRupee className="w-6 h-6" />
                  {ticket.sellingPrice}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDetailsClick(ticket)}
                    className="btn-secondary flex items-center gap-1"
                  >
                    <Info className="w-4 h-4" />
                    Details
                  </button>
                  <button 
                    onClick={() => handleBuyClick(ticket)}
                    className="btn-buy"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPurchase}
        title="Confirm Purchase"
        message={selectedTicket ? `Are you sure you want to buy this ticket for ₹${selectedTicket.sellingPrice}?` : ''}
        confirmText="Buy Ticket"
        type="buy"
      />

      <TicketDetailsPopup
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        ticket={selectedTicket}
      />
    </>
  );
};

export default TicketResults;