import { View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  category: string;
  size?: number;
};

const categoryMap: Record<string, { icon: any; color: string }> = {
  food: { icon: "fast-food", color: "#FF8C42" },
  transport: { icon: "car", color: "#3A86FF" },
  bills: { icon: "receipt", color: "#8338EC" },
  shopping: { icon: "cart", color: "#FF006E" },
  health: { icon: "medkit", color: "#2EC4B6" },
  other: { icon: "ellipsis-horizontal", color: "#6C757D" },
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
      <MaterialIcons name={item.icon} size={size} color={item.color} />
    </View>
  );
}