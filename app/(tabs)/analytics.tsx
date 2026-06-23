import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useMemo } from 'react';
import { colors } from '@/constants/theme';

type CategoryTotals = Record<string, number>;

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const { transactions, totals, loading } = useTransactions();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const currency = profile?.currency === 'NGN' ? '₦' : profile?.currency === 'EUR' ? '€' : '$';

  const categoryBreakdown = useMemo(() => {
    const cats: CategoryTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
      });
    const entries = Object.entries(cats)
      .sort(([, a], [, b]) => b - a)
      .map(([name, total], i, arr) => {
        const totalExpenses = arr.reduce((s, [, v]) => s + v, 0);
        return { name, total, pct: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0 };
      });
    return entries;
  }, [transactions]);

  const topCategory = categoryBreakdown[0]?.name ?? '—';

  const dailyAvg = useMemo(() => {
    const days = new Set(transactions.map((t) => t.occurred_at.split('T')[0])).size;
    return days > 0 ? totals.expenses / days : 0;
  }, [transactions, totals.expenses]);

  const legendColors = ['#1D4ED8', '#10B981', '#334155', '#F87171', '#8B5CF6', '#F59E0B'];

  const now = new Date();
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const thisMonth = useMemo(() => {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions
      .filter((t) => new Date(t.occurred_at) >= start && t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);
  }, [transactions]);

  const lastMonth = useMemo(() => {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return transactions
      .filter((t) => {
        const d = new Date(t.occurred_at);
        return d >= start && d <= end && t.type === 'expense';
      })
      .reduce((s, t) => s + Number(t.amount), 0);
  }, [transactions]);

  const monthDiff = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  if (loading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>Analytics</Text>
          <View style={styles.headerActions}>
            <Ionicons name="notifications-outline" size={22} color={theme.primary} />
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color={theme.primary} />
            </View>
          </View>
        </View>

        <View style={styles.periodRow}>
          <Text style={styles.periodLabel}>{monthLabel}</Text>
          <View style={styles.periodButton}>
            <Ionicons name="calendar-outline" size={16} color={theme.primary} />
            <Text style={styles.periodButtonText}>Monthly View</Text>
          </View>
        </View>

        <View style={styles.topCardsRow}>
          <View style={styles.largeCard}>
            <Text style={styles.cardTitle}>Total Spent</Text>
            <View style={styles.cardValueRow}>
              <Text style={styles.cardValue}>
                {currency}{thisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.cardChange, monthDiff <= 0 ? styles.changeGood : styles.changeBad]}>
                {monthDiff <= 0 ? '↓' : '↑'} {Math.abs(monthDiff).toFixed(0)}%
              </Text>
            </View>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.cardTitle}>Top Category</Text>
            <View style={styles.topCategoryTag}>
              <View style={styles.topCategoryIcon}>
                <Ionicons name="cart-outline" size={18} color={theme.primary} />
              </View>
              <Text style={styles.topCategoryText} numberOfLines={1}>
                {topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {categoryBreakdown.length > 0 ? (
            <>
              <View style={styles.donutContainer}>
                <View style={[styles.quarterSegment, styles.segmentBlue, styles.segmentTopRight]} />
                <View style={[styles.quarterSegment, styles.segmentGreen, styles.segmentBottomRight]} />
                <View style={[styles.quarterSegment, styles.segmentGray, styles.segmentBottomLeft]} />
                <View style={[styles.quarterSegment, styles.segmentPink, styles.segmentTopLeft]} />
                <View style={styles.donutCenter}>
                  <Text style={styles.donutCenterLabel}>Avg/Day</Text>
                  <Text style={styles.donutCenterValue}>
                    {currency}{dailyAvg.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </Text>
                </View>
              </View>

              <View style={styles.legendList}>
                {categoryBreakdown.slice(0, 4).map((item, i) => (
                  <View key={item.name} style={styles.legendItem}>
                    <View style={[styles.legendMarker, { backgroundColor: legendColors[i] }]} />
                    <View style={styles.legendTextGroup}>
                      <Text style={styles.legendLabel}>
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.legendValue}>{item.pct.toFixed(0)}%</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>No expense data yet</Text>
          )}
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="arrow-down-circle" size={20} color={theme.iconRed} />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryValue, { color: theme.iconRed }]}>
                {currency}{totals.expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="arrow-up-circle" size={20} color={theme.iconGreen} />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: theme.iconGreen }]}>
                {currency}{totals.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Net Balance</Text>
            <Text style={[styles.balanceValue, { color: totals.balance >= 0 ? theme.iconGreen : theme.iconRed }]}>
              {currency}{totals.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: { flex: 1, paddingTop: 25, backgroundColor: theme.background },
  contentContainer: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  heading: { fontSize: 28, fontWeight: '700', color: theme.text },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: theme.avatarBg,
    alignItems: 'center', justifyContent: 'center',
  },
  periodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  periodLabel: { fontSize: 20, fontWeight: '700', color: theme.text },
  periodButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 16,
    backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border,
  },
  periodButtonText: { color: theme.primary, fontWeight: '600' },
  topCardsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  largeCard: {
    flex: 2, backgroundColor: theme.card, borderRadius: 24, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  smallCard: {
    flex: 1, backgroundColor: theme.card, borderRadius: 24, padding: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 14, fontWeight: '900', color: theme.textSecondary, marginBottom: 12 },
  cardValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardValue: { fontSize: 28, fontWeight: '900', color: theme.primary },
  cardChange: { fontSize: 14, fontWeight: '700' },
  changeGood: { color: theme.iconGreen },
  changeBad: { color: theme.iconRed },
  topCategoryTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 12, paddingHorizontal: 6,
    borderRadius: 18, backgroundColor: theme.avatarBg,
  },
  topCategoryIcon: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: theme.iconBlueBg,
    alignItems: 'center', justifyContent: 'center',
  },
  topCategoryText: { fontSize: 16, fontWeight: '900', color: theme.text },
  chartCard: {
    backgroundColor: theme.card, borderRadius: 24, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 18 },
  donutContainer: { width: 200, height: 200, borderRadius: 100, alignSelf: 'center', marginBottom: 24, position: 'relative' },
  quarterSegment: { position: 'absolute', width: 100, height: 100, borderRadius: 100 },
  segmentTopLeft: { top: 0, left: 0, borderBottomRightRadius: 0 },
  segmentTopRight: { top: 0, right: 0, borderBottomLeftRadius: 0 },
  segmentBottomLeft: { bottom: 0, left: 0, borderTopRightRadius: 0 },
  segmentBottomRight: { bottom: 0, right: 0, borderTopLeftRadius: 0 },
  segmentBlue: { backgroundColor: theme.primary },
  segmentGreen: { backgroundColor: theme.iconGreen },
  segmentGray: { backgroundColor: theme.iconSlate },
  segmentPink: { backgroundColor: theme.iconRed },
  donutCenter: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: theme.background, top: 40, left: 40,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  donutCenterLabel: { fontSize: 12, fontWeight: '600', color: theme.textSecondary, marginBottom: 6 },
  donutCenterValue: { fontSize: 24, fontWeight: '700', color: theme.text },
  legendList: { gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  legendMarker: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  legendTextGroup: { flex: 1 },
  legendLabel: { fontSize: 14, color: theme.text, fontWeight: '600' },
  legendValue: { fontSize: 14, color: theme.text, fontWeight: '700' },
  emptyText: { color: theme.textSecondary, fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  summaryCards: { marginBottom: 20 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1, backgroundColor: theme.card, borderRadius: 20, padding: 16,
    alignItems: 'center', gap: 8,
  },
  summaryLabel: { fontSize: 13, color: theme.textSecondary },
  summaryValue: { fontSize: 18, fontWeight: '700' },
  balanceRow: {
    backgroundColor: theme.card, borderRadius: 20, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  balanceLabel: { fontSize: 15, fontWeight: '600', color: theme.text },
  balanceValue: { fontSize: 18, fontWeight: '700' },
});
