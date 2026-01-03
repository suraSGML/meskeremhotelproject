import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Smartphone, Building2, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  bookingType: string;
  onPaymentComplete: (paymentMethod: string, transactionRef: string) => void;
}

const paymentMethods = [
  {
    id: "telebirr",
    name: "Telebirr",
    icon: Smartphone,
    color: "bg-blue-500",
    description: "Pay with Telebirr mobile money",
    requiresPhone: true,
  },
  {
    id: "cbe_birr",
    name: "CBE Birr",
    icon: Smartphone,
    color: "bg-green-600",
    description: "Commercial Bank of Ethiopia mobile banking",
    requiresPhone: true,
  },
  {
    id: "amole",
    name: "Amole",
    icon: Smartphone,
    color: "bg-orange-500",
    description: "Dashen Bank mobile payment",
    requiresPhone: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: Building2,
    color: "bg-primary",
    description: "Transfer from any Ethiopian bank",
    requiresAccount: true,
  },
  {
    id: "cash",
    name: "Pay at Hotel",
    icon: CreditCard,
    color: "bg-muted",
    description: "Pay when you arrive",
    requiresNothing: true,
  },
];

const PaymentDialog = ({ open, onOpenChange, amount, bookingType, onPaymentComplete }: PaymentDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const selectedPayment = paymentMethods.find(m => m.id === selectedMethod);

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedPayment?.requiresPhone && !phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    if (selectedPayment?.requiresAccount && !accountNumber) {
      toast.error("Please enter your account number");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock transaction reference
    const transactionRef = `TXN${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

    setIsProcessing(false);
    setPaymentSuccess(true);

    // Wait a moment to show success state
    setTimeout(() => {
      onPaymentComplete(selectedMethod, transactionRef);
      setPaymentSuccess(false);
      setSelectedMethod("");
      setPhoneNumber("");
      setAccountNumber("");
      onOpenChange(false);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (paymentSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-foreground mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">Your booking has been confirmed</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Complete Payment</DialogTitle>
          <DialogDescription>
            Choose your preferred Ethiopian payment method for {bookingType}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Display */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-3xl font-display font-bold text-primary">{formatCurrency(amount)}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={method.id} className="sr-only" />
                  <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground"
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Phone Number Input */}
          {selectedPayment?.requiresPhone && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09XX XXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Enter the phone number registered with {selectedPayment.name}
              </p>
            </div>
          )}

          {/* Account Number Input */}
          {selectedPayment?.requiresAccount && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="account">Bank Account Number</Label>
              <Input
                id="account"
                type="text"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                We'll send you transfer instructions after booking
              </p>
            </div>
          )}

          {/* Pay at Hotel Notice */}
          {selectedMethod === "cash" && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 animate-fade-in">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> Your booking will be held for 24 hours. Please pay upon arrival at the hotel. 
                A valid ID will be required.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              className="flex-1"
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(amount)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;