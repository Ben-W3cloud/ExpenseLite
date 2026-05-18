import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryIcon from '@/components/CategoryIcon';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/constants/theme';

const categories = [
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'bills', label: 'Bills' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'other', label: 'Others' },
];

const formatDateLabel = (date: Date) => {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return `${isToday ? 'Today, ' : ''}${months[date.getMonth()]} ${date.getDate()}`;
};

export default function AddExpenseScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [amount, setAmount] = useState('0.00');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [transactionDate] = useState(new Date());

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topRow}>
        <Ionicons name="chevron-back" size={24} color={theme.primary} />
        <Text style={styles.screenTitle}>Add Expense</Text>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-circle" size={32} color={theme.primary} />
        </View>
      </View>

      <Text style={styles.sectionHeading}>Enter Amount</Text>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
          keyboardType="numeric"
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <Text style={styles.sectionHeading}>Select Category</Text>
      <View style={styles.categoryRow}>
        {categories.map((item) => {
          const selected = category === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={selected ? styles.categoryItemSelected : styles.categoryItem}
              onPress={() => setCategory(item.key)}
              activeOpacity={0.75}
            >
              <CategoryIcon category={item.key} size={24} />
              <Text style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionHeading}>Transaction Date</Text>
      <TouchableOpacity style={styles.datePicker} activeOpacity={0.8}>
        <View style={styles.dateIconWrapper}>
          <Ionicons name="calendar-outline" size={18} color={theme.primary} />
        </View>
        <Text style={styles.dateLabel}>{formatDateLabel(transactionDate)}</Text>
        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      <Text style={styles.sectionHeading}>Add a note</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="What was this for?"
        placeholderTextColor={theme.textSecondary}
        value={note}
        onChangeText={setNote}
        multiline
      />

      <View style={styles.tipCard}>
        <View style={styles.tipIconBox}>
          <Ionicons name="bulb-outline" size={20} color="#fff" />
        </View>
        <View style={styles.tipTextContainer}>
          <Text style={styles.tipTitle}>Smart spend</Text>
          <Text style={styles.tipBody}>
            This expense is 15% lower than your usual Tuesday spending in Food.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} activeOpacity={0.85}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 23,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.primary,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.card,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 32,
    color: theme.primary,
    marginRight: 12,
    bottom:16,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: theme.text,
    lineHeight: 50,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap:8,
  },
  categoryItem: {
    width: 75,
    height: 95,
    borderRadius: 18,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryItemSelected: {
    width: 76,
    height: 90,
    borderRadius: 18,
    backgroundColor: theme.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  categoryLabel: {
    marginTop: 10,
    fontSize: 12,
    color: theme.textSecondary,
  },
  categoryLabelSelected: {
    color: theme.primary,
    fontWeight: '700',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 24,
  },
  dateIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: theme.iconBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },
  noteInput: {
    minHeight: 110,
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 18,
    fontSize: 16,
    color: theme.text,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.avatarBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
  },
  tipIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    color: theme.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipBody: {
    color: theme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.primary,
    borderRadius: 24,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  saveButtonText: {
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: '700',
  },
});
