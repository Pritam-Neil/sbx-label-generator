
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Box, Package, Container, Edit, Settings as SettingsIcon, ArrowLeft } from "lucide-react";

// Local Storage Key for Label Type Preferences
const LABEL_TYPES_STORAGE_KEY = "visible_label_types";

// Default label types configuration
const defaultLabelTypes = {
  "Crates": true,
  "Cartons": true,
  "Pallets": true,
  "Custom": true
};

const Settings = () => {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>(defaultLabelTypes);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(LABEL_TYPES_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setSelectedTypes(parsed);
      } catch (error) {
        console.error("Error parsing saved label type preferences", error);
        // Use defaults if there's an error
        setSelectedTypes(defaultLabelTypes);
      }
    }
  }, []);

  const handleCheckboxChange = (type: string, checked: boolean) => {
    const updatedPreferences = { ...selectedTypes, [type]: checked };
    
    // Make sure at least one option is selected
    const hasSelection = Object.values(updatedPreferences).some(val => val === true);
    
    if (!hasSelection) {
      toast.error("Please select at least one label type");
      return;
    }
    
    setSelectedTypes(updatedPreferences);
  };

  const handleSave = () => {
    localStorage.setItem(LABEL_TYPES_STORAGE_KEY, JSON.stringify(selectedTypes));
    toast.success("Settings saved successfully");
    navigate("/");
  };

  const labelOptions = [
    {
      id: "Crates",
      label: "Crates",
      description: "Standard crates with sequential barcoded labels",
      icon: Box,
      color: "text-blue-500",
    },
    {
      id: "Cartons",
      label: "Cartons",
      description: "Shipping cartons with sequential barcoded labels",
      icon: Package, 
      color: "text-green-500",
    },
    {
      id: "Pallets",
      label: "Pallets",
      description: "Palletized goods with sequential barcoded labels",
      icon: Container,
      color: "text-orange-500",
    },
    {
      id: "Custom",
      label: "Custom",
      description: "Custom labels with your own prefix",
      icon: Edit,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold flex items-center">
              <SettingsIcon className="mr-2 h-7 w-7" /> Settings
            </h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Label Type Visibility</CardTitle>
              <CardDescription>
                Select which label types you want to see on the main page.
                At least one type must be selected.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {labelOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md">
                  <Checkbox
                    id={`checkbox-${option.id}`}
                    checked={selectedTypes[option.id] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(option.id, !!checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <option.icon className={`h-5 w-5 ${option.color}`} />
                      <label
                        htmlFor={`checkbox-${option.id}`}
                        className="font-medium cursor-pointer text-base"
                      >
                        {option.label}
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2 border-t pt-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
