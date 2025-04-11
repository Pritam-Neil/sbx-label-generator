
import React from "react";
import { Box, Package, Container, Edit } from "lucide-react";

interface LabelTypeIconProps {
  labelType: string;
  className?: string;
}

const LabelTypeIcon: React.FC<LabelTypeIconProps> = ({ labelType, className = "h-6 w-6" }) => {
  switch(labelType) {
    case "Crates": return <Box className={className} />;
    case "Cartons": return <Package className={className} />;
    case "Pallets": return <Container className={className} />;
    default: return <Edit className={className} />;
  }
};

export const getLabelCardColor = (labelType: string): string => {
  switch(labelType) {
    case "Crates": return "bg-blue-50 border-blue-100";
    case "Cartons": return "bg-green-50 border-green-100";
    case "Pallets": return "bg-orange-50 border-orange-100";
    default: return "bg-purple-50 border-purple-100";
  }
};

export default LabelTypeIcon;
