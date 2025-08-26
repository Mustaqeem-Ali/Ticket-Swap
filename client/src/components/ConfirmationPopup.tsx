import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'buy' | 'sell';
}

const ConfirmationPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm",
  type = 'buy'
}: ConfirmationPopupProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onConfirm();
      setIsAnimating(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-muted-foreground mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-[var(--radius)] font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isAnimating}
            className={`flex-1 btn-${type === 'buy' ? 'buy' : 'accent'} ${isAnimating ? 'confirm-animation' : ''}`}
          >
            {isAnimating ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Confirmed!
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;