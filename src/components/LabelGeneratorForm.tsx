
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BarcodeTypeSelector from "./BarcodeTypeSelector";

interface LabelGeneratorFormProps {
  prefix: string;
  setPrefix: (prefix: string) => void;
  labelType: string;
  barcodeType: "1D" | "QR";
  setBarcodeType: (type: "1D" | "QR") => void;
  onGenerateLabels: (count: number) => void;
  onReset: () => void;
}

const LabelGeneratorForm: React.FC<LabelGeneratorFormProps> = ({
  prefix,
  setPrefix,
  labelType,
  barcodeType,
  setBarcodeType,
  onGenerateLabels,
  onReset
}) => {
  const [caseCount, setCaseCount] = useState("");
  
  const handleGenerateLabels = () => {
    if (!prefix.trim() && labelType === "Custom") {
      toast.error("Please enter a valid Prefix");
      return;
    }

    const count = parseInt(caseCount);
    if (isNaN(count) || count <= 0 || count > 100) {
      toast.error("Please enter a valid number of cases (1-100)");
      return;
    }

    onGenerateLabels(count);
    setCaseCount("");
  };

  const isReadOnlyPrefix = labelType !== "Custom";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="prefix" className="text-base">Prefix</Label>
        <Input
          id="prefix"
          placeholder="Enter label prefix (e.g. SBX)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="text-lg"
          readOnly={isReadOnlyPrefix}
          disabled={isReadOnlyPrefix}
        />
        {isReadOnlyPrefix && (
          <p className="text-sm text-muted-foreground mt-1">
            Standard prefix for {labelType} is pre-configured
          </p>
        )}
      </div>

      <BarcodeTypeSelector 
        barcodeType={barcodeType} 
        onChange={setBarcodeType} 
      />

      <div className="space-y-2">
        <Label htmlFor="caseCount" className="text-base">Number of {labelType}</Label>
        <Input
          id="caseCount"
          type="number"
          placeholder={`Enter the number of ${labelType.toLowerCase()} (max 100)`}
          value={caseCount}
          onChange={(e) => setCaseCount(e.target.value)}
          min="1"
          max="100"
          className="text-lg"
        />
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onReset}
        >
          Change Type
        </Button>
        <Button 
          onClick={handleGenerateLabels}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={(labelType === "Custom" && !prefix) || !caseCount}
        >
          Generate Labels
        </Button>
      </div>
    </div>
  );
};

export default LabelGeneratorForm;
