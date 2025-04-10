
import React from "react";
import Barcode from "react-barcode";
import { Box, Package, Container, Edit } from "lucide-react";
import { formatLabel } from "@/utils/labelUtils";

interface LabelGeneratorProps {
  prefix: string;
  caseCount: number;
  startingCaseNumber?: number;
  labelType: string;
  suffixLimit?: number;
}

const LabelGenerator: React.FC<LabelGeneratorProps> = ({ 
  prefix, 
  caseCount, 
  startingCaseNumber = 1,
  labelType = "Custom",
  suffixLimit = 4  // Default to 4 digits if not specified
}) => {
  // Generate an array of numbers from startingCaseNumber to startingCaseNumber + caseCount - 1
  const caseNumbers = Array.from(
    { length: caseCount }, 
    (_, i) => startingCaseNumber + i
  );

  const getIcon = () => {
    switch(labelType) {
      case "Crates": return <Box className="h-5 w-5 text-blue-600" />;
      case "Cartons": return <Package className="h-5 w-5 text-green-600" />;
      case "Pallets": return <Container className="h-5 w-5 text-orange-600" />;
      default: return <Edit className="h-5 w-5 text-purple-600" />;
    }
  };

  const getBgColor = () => {
    switch(labelType) {
      case "Crates": return "bg-blue-50 border-blue-200";
      case "Cartons": return "bg-green-50 border-green-200";
      case "Pallets": return "bg-orange-50 border-orange-200";
      default: return "bg-purple-50 border-purple-200";
    }
  };

  const formatCaseNumber = (caseNumber: number): string => {
    // For custom labels, just use simple numeric formatting
    if (labelType === "Custom") {
      return `${prefix}-${caseNumber}`;
    }
    
    // For other label types, use our advanced formatting with suffix limit
    return formatLabel(prefix, caseNumber, suffixLimit);
  };

  return (
    <div className="LabelGenerator">
      <div className={`mb-4 p-3 ${getBgColor()} rounded-md flex items-center gap-2`}>
        {getIcon()}
        <div>
          <p className="text-sm font-medium">
            Generated {caseCount} labels for {labelType}: <strong>{prefix}</strong>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Click "Print Labels" to print or save as PDF
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
        {caseNumbers.map((caseNum) => (
          <div 
            key={caseNum} 
            className={`border ${getBgColor()} p-4 rounded-md print:break-inside-avoid print:mb-4 shadow-sm`}
          >
            <div className="text-center mb-2">
              <p className="font-bold text-lg">{formatCaseNumber(caseNum)}</p>
              <p className="text-sm text-gray-600">
                {labelType} {caseNum - startingCaseNumber + 1} of {caseCount}
              </p>
            </div>
            
            <div className="flex justify-center my-3">
              <Barcode 
                value={formatCaseNumber(caseNum)}
                width={2}
                height={40}
                fontSize={14}
                margin={10}
                displayValue={true}
              />
            </div>
            
            <div className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center">
              <span className="mr-1">Scan for tracking information</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelGenerator;
