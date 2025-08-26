import { X, Calendar, MapPin, IndianRupee, Train, Plane, Bus, Film, Music } from 'lucide-react';

interface TicketDetails {
  category: string;
  date: string;
  sellingPrice: number;
  details: any;
}

interface TicketDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketDetails | null;
}

const TicketDetailsPopup = ({ isOpen, onClose, ticket }: TicketDetailsPopupProps) => {
  if (!isOpen || !ticket) return null;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'train': return <Train className="w-5 h-5" />;
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'bus': return <Bus className="w-5 h-5" />;
      case 'movie': return <Film className="w-5 h-5" />;
      case 'concert': return <Music className="w-5 h-5" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderTransportDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-foreground mb-1">Source</h4>
          <p className="text-muted-foreground">{ticket.details.source}</p>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-1">Destination</h4>
          <p className="text-muted-foreground">{ticket.details.destination}</p>
        </div>
      </div>
      
      {ticket.details.pnrNumber && (
        <div>
          <h4 className="font-medium text-foreground mb-1">PNR Number</h4>
          <p className="text-muted-foreground">{ticket.details.pnrNumber}</p>
        </div>
      )}
      
      {ticket.details["Ticket Number"] && (
        <div>
          <h4 className="font-medium text-foreground mb-1">Ticket Number</h4>
          <p className="text-muted-foreground">{ticket.details["Ticket Number"]}</p>
        </div>
      )}
      
      {ticket.details.trainName && (
        <div>
          <h4 className="font-medium text-foreground mb-1">Train Name</h4>
          <p className="text-muted-foreground">{ticket.details.trainName}</p>
        </div>
      )}
      
      {ticket.details["Flight Name"] && (
        <div>
          <h4 className="font-medium text-foreground mb-1">Flight Name</h4>
          <p className="text-muted-foreground">{ticket.details["Flight Name"]}</p>
        </div>
      )}
      
      {ticket.details["Flight Number"] && (
        <div>
          <h4 className="font-medium text-foreground mb-1">Flight Number</h4>
          <p className="text-muted-foreground">{ticket.details["Flight Number"]}</p>
        </div>
      )}
      
      {ticket.details["Bus Type"] && (
        <div>
          <h4 className="font-medium text-foreground mb-1">Bus Type</h4>
          <p className="text-muted-foreground">{ticket.details["Bus Type"]}</p>
        </div>
      )}
      
      {ticket.details["Bus Number"] && (
        <div>
          <h4 className="font-medium text-foreground mb-1">Bus Number</h4>
          <p className="text-muted-foreground">{ticket.details["Bus Number"]}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {ticket.details.coach && (
          <div>
            <h4 className="font-medium text-foreground mb-1">Coach</h4>
            <p className="text-muted-foreground">{ticket.details.coach}</p>
          </div>
        )}
        
        {ticket.details.Class && (
          <div>
            <h4 className="font-medium text-foreground mb-1">Class</h4>
            <p className="text-muted-foreground">{ticket.details.Class}</p>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-foreground mb-1">Seat Number</h4>
          <p className="text-muted-foreground">{ticket.details.seatNumber}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-foreground mb-1">Boarding Time</h4>
          <p className="text-muted-foreground">{ticket.details["Boarding Time"]}</p>
        </div>
      </div>
    </div>
  );

  const renderEventDetails = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-foreground mb-1">
          {ticket.category.toLowerCase() === 'movie' ? 'Movie Title' : 'Concert Title'}
        </h4>
        <p className="text-muted-foreground">{ticket.details.title}</p>
      </div>
      
      <div>
        <h4 className="font-medium text-foreground mb-1">Location</h4>
        <p className="text-muted-foreground">{ticket.details.location}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-foreground mb-1">Seat Number</h4>
          <p className="text-muted-foreground">{ticket.details.seatNumber}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-foreground mb-1">Show Time</h4>
          <p className="text-muted-foreground">{ticket.details["time of show"]}</p>
        </div>
      </div>
    </div>
  );

  const isTransportCategory = ['train', 'flight', 'bus'].includes(ticket.category.toLowerCase());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-[var(--radius)] max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(ticket.category)}
            <h2 className="text-2xl font-semibold text-foreground">
              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)} Ticket Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(ticket.date)}</span>
            </div>
            <div className="flex items-center text-2xl font-bold text-accent">
              <IndianRupee className="w-6 h-6" />
              {ticket.sellingPrice}
            </div>
          </div>
          
          {isTransportCategory ? renderTransportDetails() : renderEventDetails()}
          
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="w-full btn-primary"
            >
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPopup;