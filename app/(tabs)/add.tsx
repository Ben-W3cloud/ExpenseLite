import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategoryIcon from '@/components/CategoryIcon';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { colors } from '@/constants/theme';
import type { TransactionType } from '@/lib/database.types';

const CATEGORIES = [
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'bills', label: 'Bills' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'income', label: 'Income' },
  { key: 'other', label: 'Others' },
];

const formatDateLabel = (date: Date) => {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${isToday ? 'Today, ' : ''}${months[date.getMonth()]} ${date.getDate()}`;
};

export default function AddTransactionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { profile } = useAuth();
  const { add } = useTransactions();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [type, setType] = useState<TransactionType>('expense');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const currency = profile?.currency === 'NGN' ? '₦' : profile?.currency === 'EUR' ? '€' : '$';

  const saveTransaction = async () => {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }

    setSaving(true);
    try {
      await add({
        name: note.trim() || CATEGORIES.find((c) => c.key === category)?.label || 'Transaction',
        category,
        amount: Number(parsedAmount.toFixed(2)),
        type,
        occurredAt: transactionDate,
      });
      setAmount('');
      setNote('');
      setCategory('food');
      setType('expense');
      Alert.alert('Saved', 'Your transaction was added successfully.', [
        { text: 'Add another', style: 'cancel' },
        { text: 'View expenses', onPress: () => router.push('/(tabs)/expenses') },
      ]);
    } catch {
      Alert.alert('Error', 'Could not save the transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const onDateChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setTransactionDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.75}>
            <Ionicons name="chevron-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Add Transaction</Text>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-circle" size={32} color={theme.primary} />
          </View>
        </View>

        <Text style={styles.sectionHeading}>Transaction Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonExpense]}
            onPress={() => setType('expense')}
            activeOpacity={0.75}
          >
            <Ionicons
              name="arrow-down-circle"
              size={18}
              color={type === 'expense' ? '#fff' : theme.iconRed}
            />
            <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonIncome]}
            onPress={() => setType('income')}
            activeOpacity={0.75}
          >
            <Ionicons
              name="arrow-up-circle"
              size={18}
              color={type === 'income' ? '#fff' : theme.iconGreen}
            />
            <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>Enter Amount</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>{currency}</Text>
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
          {CATEGORIES.map((item) => {
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
        <TouchableOpacity style={styles.datePicker} activeOpacity={0.8} onPress={() => setShowDatePicker(true)}>
          <View style={styles.dateIconWrapper}>
            <Ionicons name="calendar-outline" size={18} color={theme.primary} />
          </View>
          <Text style={styles.dateLabel}>{formatDateLabel(transactionDate)}</Text>
          <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={transactionDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            maximumDate={new Date()}
            onChange={onDateChange}
          />
        )}

        <Text style={styles.sectionHeading}>Add a note</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="What was this for?"
          placeholderTextColor={theme.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          activeOpacity={0.85}
          onPress={saveTransaction}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {type === 'income' ? 'Save Income' : 'Save Expense'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: { flex: 1, paddingTop: 23, backgroundColor: theme.background },
  contentContainer: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  screenTitle: { fontSize: 24, fontWeight: '700', color: theme.primary },
  avatarPlaceholder: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: theme.avatarBg,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionHeading: { fontSize: 14, fontWeight: '600', color: theme.textSecondary, marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 16, backgroundColor: theme.card,
    borderWidth: 1, borderColor: theme.border,
  },
  typeButtonExpense: { backgroundColor: theme.iconRed, borderColor: theme.iconRed },
  typeButtonIncome: { backgroundColor: theme.iconGreen, borderColor: theme.iconGreen },
  typeButtonText: { fontSize: 15, fontWeight: '700', color: theme.text },
  typeButtonTextActive: { color: '#fff' },
  amountContainer: {
    flexDirection: 'row', alignItems: 'flex-end', backgroundColor: theme.card,
    borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10, marginBottom: 25,
    shadowColor: '#000', shadowOpacity: 1, shadowRadius: 12, elevation: 3,
  },
  currencySymbol: { fontSize: 32, color: theme.primary, marginRight: 12, bottom: 16 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '700', color: theme.text, lineHeight: 50 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, gap: 8 },
  categoryItem: {
    width: 75, height: 95, borderRadius: 18, backgroundColor: theme.card,
    alignItems: 'center', justifyContent: 'center', paddingVertical: 12,
    borderWidth: 1, borderColor: theme.border,
  },
  categoryItemSelected: {
    width: 76, height: 90, borderRadius: 18, backgroundColor: theme.avatarBg,
    alignItems: 'center', justifyContent: 'center', paddingVertical: 12,
    borderWidth: 1, borderColor: theme.primary,
  },
  categoryLabel: { marginTop: 10, fontSize: 12, color: theme.textSecondary },
  categoryLabelSelected: { color: theme.primary, fontWeight: '700' },
  datePicker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.card, borderRadius: 18, paddingHorizontal: 16,
    paddingVertical: 16, borderWidth: 1, borderColor: theme.border, marginBottom: 24,
  },
  dateIconWrapper: {
    width: 36, height: 36, borderRadius: 14, backgroundColor: theme.iconBlueBg,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  dateLabel: { flex: 1, fontSize: 16, color: theme.text },
  noteInput: {
    minHeight: 110, backgroundColor: theme.card, borderRadius: 20, padding: 18,
    fontSize: 16, color: theme.text, textAlignVertical: 'top',
    borderWidth: 1, borderColor: theme.border, marginBottom: 28,
  },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: theme.primary, borderRadius: 24, paddingVertical: 18,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: theme.buttonText, fontSize: 16, fontWeight: '700' },
});
