
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label"; 
import { Barcode, QrCode } from "lucide-react";
import { toast } from "sonner";

// Local Storage Key for Barcode Type Preference
export const BARCODE_TYPE_STORAGE_KEY = "preferred_barcode_type";

interface BarcodeTypeSelectorProps {
  barcodeType: "1D" | "QR";
  onChange: (value: "1D" | "QR") => void;
}

const BarcodeTypeSelector: React.FC<BarcodeTypeSelectorProps> = ({ 
  barcodeType, 
  onChange 
}) => {
  // Handle barcode type change with local storage update
  const handleBarcodeTypeChange = (value: "1D" | "QR") => {
    onChange(value);
    localStorage.setItem(BARCODE_TYPE_STORAGE_KEY, value);
    toast.success(`Barcode preference saved: ${value} barcode`);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="barcodeType" className="text-base">Barcode Type</Label>
      <RadioGroup 
        value={barcodeType} 
        onValueChange={handleBarcodeTypeChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1D" id="1d-barcode" />
          <div className="flex items-center gap-2">
            <Barcode className="h-4 w-4" />
            <Label htmlFor="1d-barcode">1D Barcode</Label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="QR" id="qr-code" />
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <Label htmlFor="qr-code">QR Code</Label>
          </div>
        </div>
      </RadioGroup>
      <p className="text-xs text-muted-foreground">Your barcode preference will be saved automatically</p>
    </div>
  );
};

export default BarcodeTypeSelector;
