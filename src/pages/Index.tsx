
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import LabelGenerator from "@/components/LabelGenerator";
import { formatLabel, generateSuffix } from "@/utils/labelUtils";
import { Box, Package, Container, Edit, Barcode, QrCode } from "lucide-react";

// Local Storage Key for Barcode Type Preference
const BARCODE_TYPE_STORAGE_KEY = "preferred_barcode_type";

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
  const [caseCount, setCaseCount] = useState("");
  const [additionalCount, setAdditionalCount] = useState("");
  const [generated, setGenerated] = useState(false);
  const [totalCasesGenerated, setTotalCasesGenerated] = useState(0);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [currentBatchCount, setCurrentBatchCount] = useState(0);
  const [labelType, setLabelType] = useState("Custom");
  const [suffixLimit, setSuffixLimit] = useState(4); // Default suffix limit is 4 digits
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

  // Save barcode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(BARCODE_TYPE_STORAGE_KEY, barcodeType);
  }, [barcodeType]);

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

  const getIcon = () => {
    switch(labelType) {
      case "Crates": return <Box className="h-6 w-6" />;
      case "Cartons": return <Package className="h-6 w-6" />;
      case "Pallets": return <Container className="h-6 w-6" />;
      default: return <Edit className="h-6 w-6" />;
    }
  };

  const getCardColor = () => {
    switch(labelType) {
      case "Crates": return "bg-blue-50 border-blue-100";
      case "Cartons": return "bg-green-50 border-green-100";
      case "Pallets": return "bg-orange-50 border-orange-100";
      default: return "bg-purple-50 border-purple-100";
    }
  };

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

    setCurrentBatchCount(count);
    const nextTotal = lastGeneratedNumbers[labelType] + count;
    setTotalCasesGenerated(nextTotal);
    lastGeneratedNumbers[labelType] = nextTotal;
    setGenerated(true);
    toast.success(`Generated ${count} labels for ${labelType}: ${prefix}`);
  };

  const handleGenerateMore = () => {
    const count = parseInt(additionalCount);
    if (isNaN(count) || count <= 0 || count > 100) {
      toast.error("Please enter a valid number of additional cases (1-100)");
      return;
    }

    setCurrentBatchCount(count);
    const nextTotal = lastGeneratedNumbers[labelType] + count;
    setTotalCasesGenerated(nextTotal);
    lastGeneratedNumbers[labelType] = nextTotal;
    setShowAdditionalInput(false);
    setAdditionalCount("");
    toast.success(`Generated ${count} more labels for ${labelType}: ${prefix}`);
  };

  const handleReset = () => {
    setPrefix("");
    setCaseCount("");
    setAdditionalCount("");
    setGenerated(false);
    setCurrentBatchCount(0);
    setShowAdditionalInput(false);
  };

  // Handle barcode type change with local storage update
  const handleBarcodeTypeChange = (value: "1D" | "QR") => {
    setBarcodeType(value);
    toast.success(`Barcode preference saved: ${value} barcode`);
  };

  const isReadOnlyPrefix = labelType !== "Custom";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Card className={`max-w-3xl mx-auto shadow-lg ${getCardColor()}`}>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              {getIcon()}
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
            {/* Form and buttons section that always stays at the top */}
            <div className="space-y-6 mb-8">
              {!generated ? (
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
                </div>
              ) : (
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
                        onClick={handleReset}
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
                          onClick={() => window.print()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Print Labels
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-2">
                    <Label className="text-base">Barcode Type:</Label>
                    <RadioGroup 
                      value={barcodeType} 
                      onValueChange={handleBarcodeTypeChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1D" id="1d-barcode-gen" />
                        <div className="flex items-center gap-2">
                          <Barcode className="h-4 w-4" />
                          <Label htmlFor="1d-barcode-gen">1D Barcode</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="QR" id="qr-code-gen" />
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          <Label htmlFor="qr-code-gen">QR Code</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
            
            {/* Generated labels section that comes after the buttons */}
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

          {!generated && (
            <CardFooter className="flex justify-between border-t pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
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
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
