
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Package, Container, Edit, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Local Storage Key for Label Type Preferences
const LABEL_TYPES_STORAGE_KEY = "visible_label_types";

// Default label types configuration
const defaultLabelTypes = {
  "Crates": true,
  "Cartons": true,
  "Pallets": true,
  "Custom": true
};

const Selection = () => {
  const navigate = useNavigate();
  const [visibleTypes, setVisibleTypes] = useState<Record<string, boolean>>(defaultLabelTypes);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(LABEL_TYPES_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setVisibleTypes(parsed);
      } catch (error) {
        console.error("Error parsing saved label type preferences", error);
        // Use defaults if there's an error
        setVisibleTypes(defaultLabelTypes);
      }
    }
  }, []);

  const handleSelectionClick = (type: string, prefix: string) => {
    navigate("/generate", { state: { type, prefix } });
  };

  const options = [
    {
      type: "Crates",
      prefix: "Stackbox",
      description: "Standard crates with sequential barcoded labels",
      icon: Box,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      iconBg: "bg-blue-50",
    },
    {
      type: "Cartons",
      prefix: "SBX",
      description: "Shipping cartons with sequential barcoded labels",
      icon: Package,
      color: "bg-green-100 text-green-700 border-green-200",
      iconBg: "bg-green-50",
    },
    {
      type: "Pallets",
      prefix: "SBPallet",
      description: "Palletized goods with sequential barcoded labels",
      icon: Container,
      color: "bg-orange-100 text-orange-700 border-orange-200",
      iconBg: "bg-orange-50",
    },
    {
      type: "Custom",
      prefix: "",
      description: "Custom labels with your own prefix",
      icon: Edit,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      iconBg: "bg-purple-50",
    },
  ];

  // Filter options based on visibility preferences
  const filteredOptions = options.filter(option => visibleTypes[option.type] !== false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Label Generator System</h1>
              <p className="text-lg text-gray-600">Choose the type of labels you want to generate</p>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/settings")}
              className="rounded-full"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filteredOptions.map((option) => (
              <Card 
                key={option.type}
                className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${option.color} border-2`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-lg ${option.iconBg} mr-3`}>
                      <option.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">{option.type}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {option.type !== "Custom" && (
                    <p className="text-sm font-semibold">
                      Prefix: <span className="font-mono bg-white/80 rounded px-2 py-1 text-sm">{option.prefix}</span>
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleSelectionClick(option.type, option.prefix)}
                    variant={option.type === "Custom" ? "default" : "outline"}
                  >
                    Select {option.type}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;
