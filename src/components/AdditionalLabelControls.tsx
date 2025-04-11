
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BarcodeTypeSelector from "./BarcodeTypeSelector";
import { toast } from "sonner";

interface AdditionalLabelControlsProps {
  labelType: string;
  barcodeType: "1D" | "QR";
  setBarcodeType: (type: "1D" | "QR") => void;
  onGenerateMore: (count: number) => void;
  onPrint: () => void;
  onReset: () => void;
}

const AdditionalLabelControls: React.FC<AdditionalLabelControlsProps> = ({
  labelType,
  barcodeType,
  setBarcodeType,
  onGenerateMore,
  onPrint,
  onReset
}) => {
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [additionalCount, setAdditionalCount] = useState("");

  const handleGenerateMore = () => {
    const count = parseInt(additionalCount);
    if (isNaN(count) || count <= 0 || count > 100) {
      toast.error("Please enter a valid number of additional cases (1-100)");
      return;
    }

    onGenerateMore(count);
    setShowAdditionalInput(false);
    setAdditionalCount("");
  };

  return (
    <div className="flex flex-col space-y-4">
      {showAdditionalInput ? (
        <div className="mb-6 space-y-2 p-4 bg-green-50 border border-green-100 rounded-md">
          <Label htmlFor="additionalCount" className="text-base">How many more labels do you need?</Label>
          <div className="flex space-x-2">
            <Input
              id="additionalCount"
              type="number"
              placeholder="Enter number of additional items"
              value={additionalCount}
              onChange={(e) => setAdditionalCount(e.target.value)}
              min="1"
              max="100"
              className="text-lg"
              autoFocus
            />
            <Button 
              onClick={handleGenerateMore}
              className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
              disabled={!additionalCount}
            >
              Generate
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowAdditionalInput(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onReset}
          >
            Generate New Labels
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowAdditionalInput(true)}
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              Generate More
            </Button>
            <Button 
              onClick={onPrint}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Print Labels
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mt-2">
        <Label className="text-base">Barcode Type:</Label>
        <BarcodeTypeSelector 
          barcodeType={barcodeType}
          onChange={setBarcodeType}
        />
      </div>
    </div>
  );
};

export default AdditionalLabelControls;
