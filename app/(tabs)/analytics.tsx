import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useMemo } from 'react';
import { colors } from '@/constants/theme';

const legend = [
  { label: 'Shopping', color: '#1D4ED8', percentage: '40%' },
  { label: 'Housing', color: '#10B981', percentage: '28%' },
  { label: 'Food & Drink', color: '#334155', percentage: '20%' },
  { label: 'Others', color: '#FBCFE8', percentage: '12%' },
];

const MONTHLY_CURRENT = 3420;
const MONTHLY_PREVIOUS = 3890;

const formatCurrency = (value: number) => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const currentWidth = Math.min((MONTHLY_CURRENT / MONTHLY_PREVIOUS) * 100, 100);
  const previousWidth = 100;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
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
          <Text style={styles.periodLabel}>October 2023</Text>
          <View style={styles.periodButton}>
            <Ionicons name="calendar-outline" size={16} color={theme.primary} style={styles.periodIcon} />
            <Text style={styles.periodButtonText}>Monthly View</Text>
          </View>
        </View>

        <View style={styles.topCardsRow}>
          <View style={styles.largeCard}>
            <Text style={styles.cardTitle}>Total Spent</Text>
            <View style={styles.cardValueRow}>
              <Text style={styles.cardValue}>{formatCurrency(MONTHLY_CURRENT)}</Text>
              <Text style={styles.cardChange}>↓ 12%</Text>
            </View>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.cardTitle}>Top Category</Text>
            <View style={styles.topCategoryTag}>
              <View style={styles.topCategoryIcon}>
                <Ionicons name="cart-outline" size={18} color={theme.primary} />
              </View>
              <Text style={styles.topCategoryText}>Shopping</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.donutContainer}>
            <View style={[styles.quarterSegment, styles.segmentBlue, styles.segmentTopRight]} />
            <View style={[styles.quarterSegment, styles.segmentGreen, styles.segmentBottomRight]} />
            <View style={[styles.quarterSegment, styles.segmentGray, styles.segmentBottomLeft]} />
            <View style={[styles.quarterSegment, styles.segmentPink, styles.segmentTopLeft]} />
            <View style={styles.donutCenter}>
              <Text style={styles.donutCenterLabel}>Avg/Day</Text>
              <Text style={styles.donutCenterValue}>$110</Text>
            </View>
          </View>

          <View style={styles.legendList}>
            {legend.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: item.color }]} />
                <View style={styles.legendTextGroup}>
                  <Text style={styles.legendLabel}>{item.label}</Text>
                </View>
                <Text style={styles.legendValue}>{item.percentage}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.compareCard}>
          <View style={styles.compareHeader}>
            <Text style={styles.sectionTitle}>Monthly Comparison</Text>
            <Text style={styles.compareSubtitle}>Oct vs Sep</Text>
          </View>
          <View style={styles.compareRow}>
            <View>
              <Text style={styles.compareLabel}>October (Current)</Text>
              <Text style={styles.compareAmount}>{formatCurrency(MONTHLY_CURRENT)}</Text>
            </View>
            <View style={styles.compareBarBackground}>
              <View style={[styles.compareBarFill, { width: `${currentWidth}%`, backgroundColor: theme.primary }]} />
            </View>
          </View>
          <View style={styles.compareRow}>
            <View>
              <Text style={styles.compareLabel}>September (Previous)</Text>
              <Text style={styles.compareAmount}>{formatCurrency(MONTHLY_PREVIOUS)}</Text>
            </View>
            <View style={styles.compareBarBackground}>
              <View style={[styles.compareBarFill, { width: `${previousWidth}%`, backgroundColor: theme.iconSlate }]} />
            </View>
          </View>
          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>Good progress!</Text>
            <Text style={styles.insightBody}>
              You spent 12% less this month compared to September. You're on track to save an extra $470.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:25,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  periodLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  periodIcon: {
    marginTop: 2,
  },
  periodButtonText: {
    color: theme.primary,
    fontWeight: '600',
  },
  topCardsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  largeCard: {
    flex: 2,
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  smallCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.textSecondary,
    marginBottom: 12,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.primary,
  },
  cardChange: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.iconGreen,
  },
  topCategoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 18,
    backgroundColor: theme.avatarBg,
  },
  topCategoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.iconBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCategoryText: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.text,
  },
  chartCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 18,
  },
  donutContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  quarterSegment: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  segmentTopLeft: {
    top: 0,
    left: 0,
    borderBottomRightRadius: 0,
  },
  segmentTopRight: {
    top: 0,
    right: 0,
    borderBottomLeftRadius: 0,
  },
  segmentBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopRightRadius: 0,
  },
  segmentBottomRight: {
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 0,
  },
  segmentBlue: {
    backgroundColor: theme.primary,
  },
  segmentGreen: {
    backgroundColor: theme.iconGreen,
  },
  segmentGray: {
    backgroundColor: theme.iconSlate,
  },
  segmentPink: {
    backgroundColor: theme.iconRed,
  },
  donutCenter: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.background,
    top: 40,
    left: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  donutCenterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 6,
  },
  donutCenterValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
  },
  legendList: {
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendTextGroup: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '700',
  },
  compareCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  compareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  compareSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  compareRow: {
    marginBottom: 18,
  },
  compareLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 6,
  },
  compareAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 10,
  },
  compareBarBackground: {
    width: '100%',
    height: 14,
    borderRadius: 10,
    backgroundColor: theme.border,
    overflow: 'hidden',
  },
  compareBarFill: {
    height: 14,
    borderRadius: 10,
  },
  insightBox: {
    backgroundColor: theme.iconGreenBg,
    borderRadius: 18,
    padding: 16,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.iconGreen,
    marginBottom: 8,
  },
  insightBody: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.textSecondary,
  },
});
