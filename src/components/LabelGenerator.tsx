
import React from "react";
import Barcode from "react-barcode";

interface LabelGeneratorProps {
  lrNumber: string;
  caseCount: number;
}

const LabelGenerator: React.FC<LabelGeneratorProps> = ({ lrNumber, caseCount }) => {
  // Generate an array of numbers from 1 to caseCount
  const caseNumbers = Array.from({ length: caseCount }, (_, i) => i + 1);

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
        <p className="text-sm text-blue-700">
          Generated {caseCount} labels for LR Number: <strong>{lrNumber}</strong>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Click "Print Labels" to print or save as PDF
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
        {caseNumbers.map((caseNum) => (
          <div 
            key={caseNum} 
            className="border border-gray-200 p-4 rounded-md print:break-inside-avoid print:mb-4"
          >
            <div className="text-center mb-2">
              <p className="font-bold text-lg">{lrNumber}-{caseNum}</p>
              <p className="text-sm text-gray-600">Case {caseNum} of {caseCount}</p>
            </div>
            
            <div className="flex justify-center my-3">
              <Barcode 
                value={`${lrNumber}-${caseNum}`}
                width={2}
                height={40}
                fontSize={14}
                margin={10}
                displayValue={true}
              />
            </div>
            
            <div className="text-xs text-gray-500 text-center mt-2">
              Scan for tracking information
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelGenerator;
