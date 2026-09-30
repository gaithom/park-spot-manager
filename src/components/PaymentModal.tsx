import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard } from 'lucide-react';

import { useParking } from '@/context/parking';
import { formatMoney } from '@/lib/utils';
import { createPaymentIntent } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  onSuccess,
  onError,
  vehicleType,
  duration,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  vehicleType: string;
  duration: string;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useParking();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent on the server
      const { clientSecret } = await createPaymentIntent(amount);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Failed to process payment';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  /*
    Stripe renders the card field in a cross-origin iframe, so it cannot read
    our CSS variables — the palette has to be passed as literal colours and
    switched with the app theme by hand.
  */
  const isDark = theme === 'dark';
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '14px',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        color: isDark ? '#e9f1ee' : '#132420',
        '::placeholder': {
          color: isDark ? '#8fa39d' : '#67756f',
        },
        iconColor: isDark ? '#4bc08c' : '#156b4a',
      },
      invalid: {
        color: isDark ? '#ec6a6f' : '#c0303a',
        iconColor: isDark ? '#ec6a6f' : '#c0303a',
      },
    },
  };

  const summary = [
    { label: 'Vehicle type', value: vehicleType || '—' },
    { label: 'Duration', value: duration || '—' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[26rem]">
        <DialogHeader>
          <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <DialogTitle>Complete payment</DialogTitle>
          <DialogDescription>
            Card details are handled by Stripe and never touch this server.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-surface-sunken p-4">
          <dl className="space-y-2">
            {summary.map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-sm font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between border-t pt-2.5">
              <dt className="text-sm font-medium text-foreground">Total</dt>
              <dd
                data-numeric
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                KSh {formatMoney(amount)}
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-md border border-input bg-surface px-3 py-3 shadow-xs transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20">
            <CardElement options={cardElementOptions} />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger-subtle px-3 py-2 text-sm text-danger"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!stripe || isProcessing}>
              {isProcessing ? 'Processing…' : `Pay KSh ${formatMoney(amount)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
