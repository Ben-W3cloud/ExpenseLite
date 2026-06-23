import { View, Text } from "react-native";
import CategoryIcon from "./CategoryIcon";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  amount: number;
  category: string;
  note?: string;
  date: string;
  type?: 'expense' | 'income';
  currency?: string;
};

export default function ExpenseCard({
  amount,
  category,
  note,
  date,
  type = 'expense',
  currency = '$',
}: Props) {
  const { theme } = useTheme();
  const isIncome = type === 'income';

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: theme.card,
        borderRadius: 16,
        marginBottom: 7,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
      }}
    >
      {/* Left */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <CategoryIcon category={category} />

        <View>
          <Text style={{ fontWeight: "600", fontSize: 15, color: theme.text }}>
            {note || category}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>{date}</Text>
        </View>
      </View>

      {/* Right */}
      <Text style={{ fontWeight: "700", fontSize: 16, color: isIncome ? theme.iconGreen : theme.text }}>
        {isIncome ? '+' : '-'}{currency}{amount.toLocaleString()}
      </Text>
    </View>
  );
}
