import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SectionList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCard from '@/components/ExpenseCard';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { colors } from '@/constants/theme';
import type { Transaction } from '@/services/transactionService';

type GroupedTransaction = {
  date: string;
  label: string;
  total: number;
  data: Transaction[];
};

const getRelativeDateLabel = (txDateStr: string, maxDate: Date): string => {
  const txDate = new Date(txDateStr);
  txDate.setHours(0, 0, 0, 0);
  const refDate = new Date(maxDate);
  refDate.setHours(0, 0, 0, 0);
  const diffDays = (refDate.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'YESTERDAY';
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${txDate.getDate()} ${months[txDate.getMonth()]}`;
};

const groupByDate = (transactions: Transaction[]): GroupedTransaction[] => {
  if (transactions.length === 0) return [];
  const maxDate = new Date(Math.max(...transactions.map((t) => new Date(t.occurred_at).getTime())));
  const grouped = new Map<string, Transaction[]>();
  transactions.forEach((tx) => {
    const key = new Date(tx.occurred_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(tx);
  });
  return Array.from(grouped.entries())
    .map(([dateKey, txs]) => {
      const total = txs.reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);
      return { date: dateKey, label: getRelativeDateLabel(dateKey, maxDate), total, data: txs };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getCategories = (transactions: Transaction[]): string[] => {
  const unique = new Set(transactions.map((t) => t.category));
  return ['all', ...Array.from(unique).sort()];
};

export default function ExpensesScreen() {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const { transactions, loading, update, remove, refresh } = useTransactions();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currency = profile?.currency === 'NGN' ? '₦' : profile?.currency === 'EUR' ? '€' : '$';

  const categories = useMemo(() => getCategories(transactions), [transactions]);

  const filtered = useMemo(() => {
    let result = transactions;
    if (selectedCategory !== 'all') result = result.filter((t) => t.category === selectedCategory);
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, selectedCategory, searchText]);

  const groupedData = useMemo(() => groupByDate(filtered), [filtered]);

  const handleLongPress = (tx: Transaction) => {
    Alert.alert(tx.name, `${tx.type === 'income' ? '+' : '-'}${currency}${Number(tx.amount).toLocaleString()}`, [
      { text: 'Edit', onPress: () => handleEdit(tx) },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(tx) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleEdit = (tx: Transaction) => {
    const toggleType = tx.type === 'expense' ? 'income' : 'expense';
    Alert.alert(
      'Edit Transaction',
      `"${tx.name}" — ${currency}${Number(tx.amount).toLocaleString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Switch to ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`,
          onPress: async () => {
            try {
              await update(tx.id, { type: toggleType });
            } catch {
              Alert.alert('Error', 'Could not update transaction.');
            }
          },
        },
      ],
    );
  };

  const handleDelete = (tx: Transaction) => {
    Alert.alert('Delete?', `Remove "${tx.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(tx.id);
          } catch {
            Alert.alert('Error', 'Could not delete transaction.');
          }
        },
      },
    ]);
  };

  const renderSectionHeader = ({ section }: { section: GroupedTransaction }) => {
    const totalColor = section.total >= 0 ? theme.iconGreen : theme.iconRed;
    const sign = section.total >= 0 ? '+' : '-';
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{section.label}</Text>
        <Text style={[styles.sectionTotal, { color: totalColor }]}>
          {sign}{currency}{Math.abs(section.total).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity onPress={refresh}>
          <Ionicons name="refresh-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loading && transactions.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor={theme.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterChipsContainer}
            contentContainerStyle={styles.filterChipsContent}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {groupedData.length > 0 ? (
            <SectionList
              sections={groupedData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.9}>
                  <ExpenseCard
                    category={item.category}
                    note={item.name}
                    amount={Number(item.amount)}
                    type={item.type}
                    currency={currency}
                    date={new Date(item.occurred_at).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit', hour12: true,
                    })}
                  />
                </TouchableOpacity>
              )}
              renderSectionHeader={renderSectionHeader}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt" size={64} color={theme.border} />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: { paddingTop: 25, flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: theme.text },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: theme.textSecondary, fontSize: 14 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.card,
    borderRadius: 16, borderWidth: 1, borderColor: theme.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: theme.text },
  filterChipsContainer: { marginBottom: 20 },
  filterChipsContent: { paddingHorizontal: 20, gap: 10 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24,
    backgroundColor: theme.iconSlateBg, borderWidth: 1, borderColor: theme.border,
  },
  filterChipSelected: { backgroundColor: theme.primary, borderColor: theme.primary },
  filterChipText: { fontSize: 14, fontWeight: '600', color: theme.textSecondary },
  filterChipTextSelected: { color: theme.buttonText },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 20, marginBottom: 12,
  },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTotal: { fontSize: 16, fontWeight: '700' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: theme.text, marginTop: 16 },
  emptyStateSubtext: { fontSize: 14, color: theme.textSecondary, marginTop: 8 },
});
