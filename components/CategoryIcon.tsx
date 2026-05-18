import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  category: string;
  size?: number;
};

export default function CategoryIcon({ category, size = 24 }: Props) {
  const { theme } = useTheme();

  const categoryMap: Record<string, { icon: string; bgColor: string; iconColor: string }> = {
    food: { icon: 'fastfood', bgColor: theme.iconOrangeBg, iconColor: theme.iconOrange },
    transport: { icon: 'directions_car', bgColor: theme.iconBlueBg, iconColor: theme.iconBlue },
    bills: { icon: 'receipt', bgColor: theme.iconPurpleBg, iconColor: theme.iconPurple },
    shopping: { icon: 'shopping_cart', bgColor: theme.iconPinkBg, iconColor: theme.iconPink },
    health: { icon: 'medication', bgColor: theme.iconTealBg, iconColor: theme.iconTeal },
    other: { icon: 'area-chart', bgColor: theme.iconGrayBg, iconColor: theme.iconGray },
  };

  const item = categoryMap[category] || categoryMap['other'];

  return (
    <View
      style={{
        backgroundColor: item.bgColor,
        padding: 8,
        borderRadius: 12,
      }}
    >
      <MaterialIcons name={item.icon as any} size={size} color={item.iconColor} />
    </View>
  );
}