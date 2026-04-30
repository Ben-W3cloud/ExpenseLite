import { View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  category: string;
  size?: number;
};

const categoryMap: Record<string, { icon: string; color: string }> = {
  food: { 
    icon: "restaurant", // or "fastfood"
    color: "#FF8C42" 
  },
  transport: { 
    icon: "directions_car", 
    color: "#3A86FF" 
  },
  bills: { 
    icon: "receipt", 
    color: "#8338EC" 
  },
  shopping: { 
    icon: "shopping_cart", 
    color: "#FF006E" 
  },
  health: { 
    icon: "medical_services", // or "medication"
    color: "#2EC4B6" 
  },
  other: { 
    icon: "medication", 
    color: "#6C757D" 
  },
};
export default function CategoryIcon({ category, size = 24 }: Props) {
  const item = categoryMap[category] || categoryMap["other"];

  return (
    <View
      style={{
        backgroundColor: `${item.color}20`,
        padding: 8,
        borderRadius: 12,
      }}
    >
      <MaterialIcons icon={item.icon} size={size} color={item.color} />
    </View>
  );
}