import Navbar from '@/components/Navbar';
import GetTicketsForm from '@/components/GetTicketsForm';
import SellTicketsForm from '@/components/SellTicketsForm';
import trainIcon from '@/assets/train-icon.png';
import flightIcon from '@/assets/flight-icon.png';
import busIcon from '@/assets/bus-icon.png';
import concertIcon from '@/assets/concert-icon.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 slide-up">
            Ticket<span className="text-accent">-Swap</span>
          </h1>
          <p className="text-2xl mb-12 text-primary-foreground/90 max-w-3xl mx-auto slide-up">
            India's most trusted marketplace for buying and selling train, bus, flight, movie, and event tickets
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center slide-up mb-16">
            <a href="#get-tickets" className="btn-accent text-lg px-8 py-4">
              Find Tickets
            </a>
            <a href="#sell-tickets" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 px-8 py-4 rounded-[var(--radius)] font-medium transition-all duration-200 text-lg">
              Sell Tickets
            </a>
          </div>
          
          {/* Transport Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center fade-in">
              <img src={trainIcon} alt="Train tickets" className="w-16 h-16 mb-2 opacity-90" />
              <span className="text-sm text-primary-foreground/80">Trains</span>
            </div>
            <div className="flex flex-col items-center fade-in">
              <img src={flightIcon} alt="Flight tickets" className="w-16 h-16 mb-2 opacity-90" />
              <span className="text-sm text-primary-foreground/80">Flights</span>
            </div>
            <div className="flex flex-col items-center fade-in">
              <img src={busIcon} alt="Bus tickets" className="w-16 h-16 mb-2 opacity-90" />
              <span className="text-sm text-primary-foreground/80">Buses</span>
            </div>
            <div className="flex flex-col items-center fade-in">
              <img src={concertIcon} alt="Event tickets" className="w-16 h-16 mb-2 opacity-90" />
              <span className="text-sm text-primary-foreground/80">Events</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Get Tickets Section */}
          <section id="get-tickets" className="fade-in">
            <GetTicketsForm />
          </section>

          {/* Sell Tickets Section */}
          <section id="sell-tickets" className="fade-in">
            <SellTicketsForm />
          </section>
        </div>

        {/* How It Works Section */}
        <section className="mt-16 fade-in">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            How Ticket-Swap Works
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">For Buyers</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Search for Tickets</h4>
                    <p className="text-muted-foreground">Browse available tickets by category, route, date, or location. Our smart search helps you find exactly what you need.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Secure Purchase</h4>
                    <p className="text-muted-foreground">Buy tickets with confidence through our secure payment system. Your money is protected until transfer is complete.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Instant Transfer</h4>
                    <p className="text-muted-foreground">Receive your ticket details instantly. No waiting, no hassle - just smooth, verified transfers.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">For Sellers</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">List Your Ticket</h4>
                    <p className="text-muted-foreground">Upload your ticket details in minutes. Add photos, set your price, and reach thousands of potential buyers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Connect with Buyers</h4>
                    <p className="text-muted-foreground">Get notifications when buyers are interested. Our platform handles all communication and negotiations.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Get Paid</h4>
                    <p className="text-muted-foreground">Receive payment directly to your account after successful ticket transfer. Fast, secure, reliable.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16 fade-in">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Why Choose Ticket-Swap?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-flat p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Secure Transactions</h3>
              <p className="text-muted-foreground">All payments are processed securely with buyer protection. Your money is safe until ticket transfer is complete.</p>
            </div>
            
            <div className="card-flat p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Instant Transfers</h3>
              <p className="text-muted-foreground">Quick and verified ticket transfers with real-time updates. No waiting periods, get your tickets immediately.</p>
            </div>
            
            <div className="card-flat p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Trusted Community</h3>
              <p className="text-muted-foreground">Join thousands of verified buyers and sellers. Our rating system ensures quality and trustworthy transactions.</p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mt-20 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-[var(--radius)] p-12 fade-in">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Trusted by Millions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">10M+</div>
              <div className="text-muted-foreground">Tickets Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">500K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
