
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LabelGenerator from "@/components/LabelGenerator";
import LabelTypeIcon, { getLabelCardColor } from "@/components/LabelTypeIcon";
import LabelGeneratorForm from "@/components/LabelGeneratorForm";
import AdditionalLabelControls from "@/components/AdditionalLabelControls";
import { BARCODE_TYPE_STORAGE_KEY } from "@/components/BarcodeTypeSelector";

// Persistent storage for the last generated numbers for each type
const lastGeneratedNumbers = {
  "Crates": 0,
  "Cartons": 0,
  "Pallets": 0,
  "Custom": 0
};

// Track the last used prefix for custom labels
let lastCustomPrefix = "";

const Index = () => {
  const [prefix, setPrefix] = useState("");
  const [generated, setGenerated] = useState(false);
  const [totalCasesGenerated, setTotalCasesGenerated] = useState(0);
  const [currentBatchCount, setCurrentBatchCount] = useState(0);
  const [labelType, setLabelType] = useState("Custom");
  const [suffixLimit] = useState(4); // Default suffix limit is 4 digits
  const [barcodeType, setBarcodeType] = useState<"1D" | "QR">("1D");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Load saved barcode preference from localStorage on component mount
  useEffect(() => {
    const savedBarcodeType = localStorage.getItem(BARCODE_TYPE_STORAGE_KEY) as "1D" | "QR" | null;
    if (savedBarcodeType) {
      setBarcodeType(savedBarcodeType);
    }
  }, []);

  useEffect(() => {
    const state = location.state;
    if (state?.type) {
      setLabelType(state.type);
      if (state.prefix) {
        setPrefix(state.prefix);
      }
      
      setTotalCasesGenerated(lastGeneratedNumbers[state.type]);

      // If this is a custom label and the prefix has changed, reset the counter
      if (state.type === "Custom") {
        if (lastCustomPrefix !== state.prefix) {
          lastGeneratedNumbers["Custom"] = 0;
          setTotalCasesGenerated(0);
          lastCustomPrefix = state.prefix || "";
        }
      }
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  // When prefix changes for custom labels, reset the counter
  useEffect(() => {
    if (labelType === "Custom" && prefix !== lastCustomPrefix) {
      lastGeneratedNumbers["Custom"] = 0;
      setTotalCasesGenerated(0);
      lastCustomPrefix = prefix;
    }
  }, [prefix, labelType]);

  const handleGenerateLabels = (count: number) => {
    setCurrentBatchCount(count);
    const nextTotal = lastGeneratedNumbers[labelType] + count;
    setTotalCasesGenerated(nextTotal);
    lastGeneratedNumbers[labelType] = nextTotal;
    setGenerated(true);
    toast.success(`Generated ${count} labels for ${labelType}: ${prefix}`);
  };

  const handleGenerateMore = (count: number) => {
    setCurrentBatchCount(count);
    const nextTotal = lastGeneratedNumbers[labelType] + count;
    setTotalCasesGenerated(nextTotal);
    lastGeneratedNumbers[labelType] = nextTotal;
    toast.success(`Generated ${count} more labels for ${labelType}: ${prefix}`);
  };

  const handleReset = () => {
    setPrefix("");
    setGenerated(false);
    setCurrentBatchCount(0);
  };

  const handleChangeType = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Card className={`max-w-3xl mx-auto shadow-lg ${getLabelCardColor(labelType)}`}>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <LabelTypeIcon labelType={labelType} />
              <div>
                <CardTitle className="text-2xl font-bold">
                  {labelType === "Custom" ? "Custom Label Generator" : `${labelType} Label Generator`}
                </CardTitle>
                <CardDescription>
                  Generate sequenced barcode labels for {labelType.toLowerCase()} in logistics and warehouse operations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 pb-4">
            {/* Form and controls section always at the top */}
            <div className="space-y-6 mb-8">
              {!generated ? (
                <LabelGeneratorForm
                  prefix={prefix}
                  setPrefix={setPrefix}
                  labelType={labelType}
                  barcodeType={barcodeType}
                  setBarcodeType={setBarcodeType}
                  onGenerateLabels={handleGenerateLabels}
                  onReset={handleChangeType}
                />
              ) : (
                <AdditionalLabelControls
                  labelType={labelType}
                  barcodeType={barcodeType}
                  setBarcodeType={setBarcodeType}
                  onGenerateMore={handleGenerateMore}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                />
              )}
            </div>
            
            {/* Generated labels section that comes after the controls */}
            {generated && (
              <LabelGenerator 
                prefix={prefix}
                caseCount={currentBatchCount}
                startingCaseNumber={totalCasesGenerated - currentBatchCount + 1}
                labelType={labelType}
                suffixLimit={suffixLimit}
                barcodeType={barcodeType}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
