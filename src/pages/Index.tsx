import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LabelGenerator from "@/components/LabelGenerator";
import AppHeader from "@/components/AppHeader";
import { Box, Package, Container, Edit } from "lucide-react";

const lastGeneratedNumbers = {
  "Crates": 0,
  "Cartons": 0,
  "Pallets": 0,
  "Custom": 0
};

const Index = () => {
  const [prefix, setPrefix] = useState("");
  const [caseCount, setCaseCount] = useState("");
  const [additionalCount, setAdditionalCount] = useState("");
  const [generated, setGenerated] = useState(false);
  const [totalCasesGenerated, setTotalCasesGenerated] = useState(0);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [currentBatchCount, setCurrentBatchCount] = useState(0);
  const [labelType, setLabelType] = useState("Custom");
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state?.type) {
      setLabelType(state.type);
      if (state.prefix) {
        setPrefix(state.prefix);
      }
      
      setTotalCasesGenerated(lastGeneratedNumbers[state.type]);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

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

  const isReadOnlyPrefix = labelType !== "Custom";

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
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
              <>
                {showAdditionalInput && (
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
                )}
                
                <LabelGenerator 
                  prefix={prefix}
                  caseCount={currentBatchCount}
                  startingCaseNumber={totalCasesGenerated - currentBatchCount + 1}
                  labelType={labelType}
                />
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            {generated ? (
              <>
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
                    disabled={showAdditionalInput}
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
              </>
            ) : (
              <>
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
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
