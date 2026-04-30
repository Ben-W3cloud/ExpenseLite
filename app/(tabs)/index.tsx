import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCard from '@/components/ExpenseCard';

const transactions = [
  { category: 'Coffee', note: 'Starbucks', amount: 12.45, date: 'Oct 24' },
  { category: 'Transport', note: 'Gas', amount: 54.0, date: 'Oct 23' },
  { category: 'Groceries', note: 'Whole Foods', amount: 124.8, date: 'Oct 22' },
  { category: 'Entertainment', note: 'Netflix', amount: 15.99, date: 'Oct 20' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>B</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Hello, Ben</Text>
              <Text style={styles.subTitle}>Welcome back</Text>
            </View>
          </View>
          <View style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color="#1D4ED8" />
          </View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <View style={styles.iconCircle}>
              <Ionicons name="card-outline" size={18} color="#fff" />
            </View>
          </View>

          <Text style={styles.balanceValue}>$12,450.80</Text>

          <View style={styles.balanceMeta}>
            <View style={styles.trendBadge}>
              <Text style={styles.trendBadgeText}>+2.4%</Text>
            </View>
            <Text style={styles.balanceNote}>from last month</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Monthly Spend</Text>
            <Text style={styles.summaryValue}>$3,240.00</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Daily Avg</Text>
            <Text style={[styles.summaryValue, styles.summaryValueGreen]}>$108.00</Text>
          </View>
        </View>

        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>Spending Trend</Text>
            <Text style={styles.trendLabel}>Last 7 Days</Text>
          </View>
          <View style={styles.trendGraphPlaceholder} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Link href="/(tabs)/list" style={styles.seeAllLink}>
            <Text style={styles.seeAllText}>See All</Text>
          </Link>
        </View>

        <View style={styles.transactionList}>
          {transactions.map((transaction) => (
            <ExpenseCard
              key={`${transaction.note}-${transaction.date}`}
              category={transaction.category}
              note={transaction.note}
              amount={transaction.amount}
              date={transaction.date}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#1D4ED8',
    fontSize: 18,
    fontWeight: '700',
  },
  greeting: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  subTitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  balanceCard: {
    backgroundColor: '#1D4ED8',
    borderRadius: 28,
    padding: 24,
    minHeight: 180,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  balanceLabel: {
    color: '#C7D2FE',
    fontSize: 14,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
  },
  balanceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  trendBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  trendBadgeText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 13,
  },
  balanceNote: {
    color: '#DBEAFE',
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  summaryLabel: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  summaryValueGreen: {
    color: '#047857',
  },
  trendCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  trendTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  trendLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  trendGraphPlaceholder: {
    height: 150,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  seeAllLink: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  seeAllText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  transactionList: {
    paddingBottom: 32,
  },
});

