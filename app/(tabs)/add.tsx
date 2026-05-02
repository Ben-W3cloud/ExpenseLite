import { useState } from 'react';
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

const categories = [
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'bills', label: 'Bills' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'entertainment', label: 'Entertainment' },
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
        <Ionicons name="chevron-back" size={24} color="#1D4ED8" />
        <Text style={styles.screenTitle}>Add Expense</Text>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-circle" size={32} color="#1D4ED8" />
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
          placeholderTextColor="#CBD5E1"
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
          <Ionicons name="calendar-outline" size={18} color="#1D4ED8" />
        </View>
        <Text style={styles.dateLabel}>{formatDateLabel(transactionDate)}</Text>
        <Ionicons name="chevron-down" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <Text style={styles.sectionHeading}>Add a note</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="What was this for?"
        placeholderTextColor="#94A3B8"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
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
    color: '#1D4ED8',
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 32,
    color: '#1D4ED8',
    marginRight: 12,
    paddingBottom: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 48,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 56,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  categoryItem: {
    width: 76,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryItemSelected: {
    width: 76,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1D4ED8',
  },
  categoryLabel: {
    marginTop: 10,
    fontSize: 12,
    color: '#64748B',
  },
  categoryLabelSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  dateIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateLabel: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  noteInput: {
    minHeight: 110,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    fontSize: 16,
    color: '#0F172A',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
  },
  tipIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    color: '#1D4ED8',
    fontWeight: '700',
    marginBottom: 4,
  },
  tipBody: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1D4ED8',
    borderRadius: 24,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
