
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LabelGenerator from "@/components/LabelGenerator";
import AppHeader from "@/components/AppHeader";

const Index = () => {
  const [lrNumber, setLrNumber] = useState("");
  const [caseCount, setCaseCount] = useState("");
  const [additionalCount, setAdditionalCount] = useState("");
  const [generated, setGenerated] = useState(false);
  const [totalCasesGenerated, setTotalCasesGenerated] = useState(0);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const navigate = useNavigate();

  const handleGenerateLabels = () => {
    // Basic validation
    if (!lrNumber.trim()) {
      toast.error("Please enter a valid LR Number");
      return;
    }

    const count = parseInt(caseCount);
    if (isNaN(count) || count <= 0 || count > 100) {
      toast.error("Please enter a valid number of cases (1-100)");
      return;
    }

    setTotalCasesGenerated((prev) => prev + count);
    setGenerated(true);
    toast.success(`Generated ${count} labels for LR Number: ${lrNumber}`);
  };

  const handleGenerateMore = () => {
    const count = parseInt(additionalCount || caseCount);
    if (isNaN(count) || count <= 0 || count > 100) {
      toast.error("Please enter a valid number of additional cases (1-100)");
      return;
    }

    setTotalCasesGenerated((prev) => prev + count);
    setShowAdditionalInput(false);
    setAdditionalCount("");
    toast.success(`Generated ${count} more labels for LR Number: ${lrNumber}`);
  };

  const handleReset = () => {
    setLrNumber("");
    setCaseCount("");
    setAdditionalCount("");
    setGenerated(false);
    setTotalCasesGenerated(0);
    setShowAdditionalInput(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-2xl font-bold text-blue-900">YMS Label Generator</CardTitle>
            <CardDescription>Generate sequenced barcode labels for logistics and warehouse operations</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-4">
            {!generated ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lrNumber" className="text-base">LR Number</Label>
                  <Input
                    id="lrNumber"
                    placeholder="Enter LR Number (e.g. IN987098)"
                    value={lrNumber}
                    onChange={(e) => setLrNumber(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseCount" className="text-base">Number of Cases</Label>
                  <Input
                    id="caseCount"
                    type="number"
                    placeholder="Enter the number of cases (max 100)"
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
                        placeholder="Enter number of additional cases"
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
                  lrNumber={lrNumber}
                  caseCount={parseInt(additionalCount || caseCount)}
                  startingCaseNumber={totalCasesGenerated - parseInt(additionalCount || caseCount) + 1}
                />
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-gray-100 pt-4">
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
                  Reset
                </Button>
                <Button 
                  onClick={handleGenerateLabels}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!lrNumber || !caseCount}
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
