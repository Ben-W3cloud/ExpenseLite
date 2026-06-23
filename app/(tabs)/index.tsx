import { Alert, ScrollView, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCard from '@/components/ExpenseCard';
import { useTheme } from '@/context/ThemeContext';
import { useMemo, useCallback } from 'react';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const { transactions, totals, loading, refresh } = useTransactions();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const currency = profile?.currency === 'NGN' ? '₦' : profile?.currency === 'EUR' ? '€' : '$';
  const displayName = profile?.full_name || 'User';

  const dailyAvg = useMemo(() => {
    const uniqueDays = new Set(transactions.map((t) => t.occurred_at.split('T')[0])).size;
    return uniqueDays > 0 ? totals.expenses / uniqueDays : 0;
  }, [transactions, totals.expenses]);

  const recentTransactions = transactions.slice(0, 4);

  const onRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <View>
              <Text style={styles.greeting}>Hello, {displayName.split(' ')[0]}</Text>
              <Text style={styles.subTitle}>Welcome back</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={() => Alert.alert('Notifications', 'You are all caught up.')}>
            <Ionicons name="notifications-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <View style={styles.iconCircle}>
              <Ionicons name="card-outline" size={18} color="#fff" />
            </View>
          </View>
          <Text style={styles.balanceValue}>
            {currency}{totals.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceMeta}>
            <View style={styles.trendBadge}>
              <Text style={styles.trendBadgeText}>
                {totals.income > 0
                  ? `+${((totals.income - totals.expenses) / totals.income * 100).toFixed(1)}%`
                  : '0%'}
              </Text>
            </View>
            <Text style={styles.balanceNote}>of income saved</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Monthly Spend</Text>
            <Text style={styles.summaryValue}>
              {currency}{totals.expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Daily Avg</Text>
            <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
              {currency}{dailyAvg.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>Spending Trend</Text>
            <Text style={styles.trendLabel}>Last 7 Days</Text>
          </View>
          <View style={styles.trendGraphPlaceholder}>
            <Text style={styles.trendGraphPlaceholderText}>
              {transactions.length > 0 ? `${transactions.length} transactions loaded` : 'Add transactions to see trends'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Link href="/(tabs)/expenses" style={styles.seeAllLink}>
            <Text style={styles.seeAllText}>See All</Text>
          </Link>
        </View>

        <View style={styles.transactionList}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <ExpenseCard
                key={transaction.id}
                category={transaction.category}
                note={transaction.name}
                amount={Number(transaction.amount)}
                type={transaction.type}
                currency={currency}
                date={new Date(transaction.occurred_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={32} color={theme.textSecondary} />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: { flex: 1, paddingTop: 25, backgroundColor: theme.background },
  contentContainer: { padding: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatar: {
    width: 50, height: 50, borderRadius: 18, backgroundColor: theme.avatarBg,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarImg: { width: 50, height: 50, borderRadius: 18 },
  avatarText: { color: theme.primary, fontSize: 25, fontWeight: '900' },
  greeting: { color: theme.text, fontSize: 18, fontWeight: '900' },
  subTitle: { color: theme.textSecondary, fontSize: 13, marginTop: 2 },
  notificationButton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: theme.card,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  balanceCard: {
    backgroundColor: theme.primary, borderRadius: 28, padding: 24, minHeight: 180,
    marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  balanceLabel: { color: '#C7D2FE', fontSize: 14 },
  iconCircle: {
    width: 38, height: 38, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  balanceValue: { color: '#fff', fontSize: 36, fontWeight: '800', lineHeight: 44 },
  balanceMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 10 },
  trendBadge: { backgroundColor: theme.iconGreenBg, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12 },
  trendBadgeText: { color: theme.iconGreen, fontWeight: '700', fontSize: 13 },
  balanceNote: { color: '#DBEAFE', fontSize: 13 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  summaryCard: {
    flex: 1, backgroundColor: theme.card, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: theme.border,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  summaryLabel: { color: theme.textSecondary, fontSize: 13, marginBottom: 8 },
  summaryValue: { fontSize: 22, fontWeight: '700', color: theme.primary },
  summaryValueGreen: { color: theme.iconGreen },
  trendCard: {
    backgroundColor: theme.card, borderRadius: 28, padding: 18, marginBottom: 20,
    borderWidth: 1, borderColor: theme.border,
  },
  trendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  trendTitle: { color: theme.text, fontSize: 16, fontWeight: '700' },
  trendLabel: { color: theme.textSecondary, fontSize: 13 },
  trendGraphPlaceholder: {
    height: 150, borderRadius: 22, backgroundColor: theme.avatarBg,
    alignItems: 'center', justifyContent: 'center',
  },
  trendGraphPlaceholderText: { color: theme.textSecondary, fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: theme.text, fontSize: 16, fontWeight: '700' },
  seeAllLink: { paddingHorizontal: 4, paddingVertical: 2 },
  seeAllText: { color: theme.primary, fontWeight: '700' },
  transactionList: { paddingBottom: 32 },
  emptyCard: {
    alignItems: 'center', paddingVertical: 40, backgroundColor: theme.card,
    borderRadius: 20, borderWidth: 1, borderColor: theme.border,
  },
  emptyText: { color: theme.textSecondary, fontSize: 14, marginTop: 8 },
});
