import { View, Text } from "react-native";

type Props = {
  total: number;
  label?: string;
};

export default function SummaryCard({
  total,
  label = "Total Spending",
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#1E3A8A",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
      }}
    >
      <Text style={{ color: "#C7D2FE", fontSize: 14 }}>{label}</Text>

      <Text
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: "700",
          marginTop: 8,
        }}
      >
        ₦{total.toLocaleString()}
      </Text>
    </View>
  );
}