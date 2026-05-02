import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExpenseCard from '@/components/ExpenseCard';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type TransactionType = 'expense' | 'income';

type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: Date;
  type: TransactionType;
};

type GroupedTransaction = {
  date: string;
  label: string;
  total: number;
  data: Transaction[];
};

// ============================================================================
// SAMPLE DATA
// ============================================================================

const sampleTransactions: Transaction[] = [
  // TODAY (Oct 24)
  {
    id: '1',
    name: 'Blueberry Cafe',
    category: 'food',
    amount: 24.5,
    date: new Date(2025, 9, 24, 12, 45),
    type: 'expense',
  },
  {
    id: '2',
    name: 'Electric Company',
    category: 'bills',
    amount: 118.0,
    date: new Date(2025, 9, 24, 9, 15),
    type: 'expense',
  },
  // YESTERDAY (Oct 23)
  {
    id: '3',
    name: 'Salary Deposit',
    category: 'income',
    amount: 2500.0,
    date: new Date(2025, 9, 23, 4, 30),
    type: 'income',
  },
  {
    id: '4',
    name: 'Amazon Prime',
    category: 'shopping',
    amount: 50.0,
    date: new Date(2025, 9, 23, 11, 20),
    type: 'expense',
  },
  // 2 DAYS AGO (Oct 22)
  {
    id: '5',
    name: 'Uber Trip',
    category: 'transport',
    amount: 35.2,
    date: new Date(2025, 9, 22, 8, 45),
    type: 'expense',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all unique categories from transactions, with "All" at the start
 */
const getCategories = (transactions: Transaction[]): string[] => {
  const unique = new Set(transactions.map((t) => t.category));
  return ['all', ...Array.from(unique).sort()];
};

/**
 * Calculate relative date label (TODAY, YESTERDAY, or formatted date)
 */
const getRelativeDateLabel = (transactionDate: Date, referenceDate: Date): string => {
  const txDate = new Date(transactionDate);
  txDate.setHours(0, 0, 0, 0);

  const refDate = new Date(referenceDate);
  refDate.setHours(0, 0, 0, 0);

  const diffTime = refDate.getTime() - txDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    return 'TODAY';
  }
  if (diffDays === 1) {
    return 'YESTERDAY';
  }

  // Format: "DD MMM" (e.g., "22 OCT")
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = txDate.getDate();
  const month = months[txDate.getMonth()];
  return `${day} ${month}`;
};

/**
 * Group transactions by date with relative labels
 */
const groupTransactionsByDate = (transactions: Transaction[]): GroupedTransaction[] => {
  if (transactions.length === 0) {
    return [];
  }

  // Find the maximum date to use as reference for "TODAY"
  const maxDate = new Date(
    Math.max(...transactions.map((t) => t.date.getTime()))
  );

  // Group by date
  const grouped = new Map<string, Transaction[]>();
  transactions.forEach((tx) => {
    const dateKey = tx.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(tx);
  });

  // Convert to sorted array with labels and totals
  const result: GroupedTransaction[] = Array.from(grouped.entries())
    .map(([dateKey, txs]) => {
      const date = new Date(dateKey);
      const label = getRelativeDateLabel(date, maxDate);
      const total = txs.reduce((sum, tx) => {
        return sum + (tx.type === 'income' ? tx.amount : -tx.amount);
      }, 0);

      return {
        date: dateKey,
        label,
        total,
        data: txs.sort((a, b) => b.date.getTime() - a.date.getTime()),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return result;
};

/**
 * Filter transactions by search query (name or category)
 */
const filterTransactionsBySearch = (
  transactions: Transaction[],
  searchText: string
): Transaction[] => {
  if (!searchText.trim()) {
    return transactions;
  }

  const query = searchText.toLowerCase().trim();
  return transactions.filter(
    (tx) =>
      tx.name.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query)
  );
};

/**
 * Filter transactions by category
 */
const filterTransactionsByCategory = (
  transactions: Transaction[],
  category: string
): Transaction[] => {
  if (category === 'all') {
    return transactions;
  }
  return transactions.filter((tx) => tx.category === category);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExpensesScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get available categories
  const categories = useMemo(() => getCategories(sampleTransactions), []);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = sampleTransactions;
    result = filterTransactionsBySearch(result, searchText);
    result = filterTransactionsByCategory(result, selectedCategory);
    return result;
  }, [searchText, selectedCategory]);

  // Group by date
  const groupedData = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions]
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: GroupedTransaction;
  }) => {
    const totalColor = section.total >= 0 ? '#047857' : '#DC2626';
    const totalSign = section.total >= 0 ? '+' : '-';

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{section.label}</Text>
        <Text style={[styles.sectionTotal, { color: totalColor }]}>
          {totalSign}₦{Math.abs(section.total).toLocaleString()}
        </Text>
      </View>
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <ExpenseCard
      category={item.category}
      note={item.name}
      amount={item.amount}
      date={item.date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt" size={64} color="#D1D5DB" />
      <Text style={styles.emptyStateText}>No transactions found</Text>
      <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <Ionicons name="notifications-outline" size={24} color="#1D4ED8" />
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#D1D5DB"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Transactions List */}
        {groupedData.length > 0 ? (
          <SectionList
            sections={groupedData}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            renderSectionHeader={renderSectionHeader}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  filterChipsContainer: {
    marginBottom: 20,
  },
  filterChipsContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipSelected: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
});