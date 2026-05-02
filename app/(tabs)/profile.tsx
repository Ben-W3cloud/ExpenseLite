import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color="#1D4ED8" />
          </View>
          <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>Alex Thompson</Text>
        <Text style={styles.profileEmail}>alex.thompson@financialzen.com</Text>

        <TouchableOpacity style={styles.editButton} activeOpacity={0.85}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.preferenceCard}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
          <View style={[styles.preferenceIcon, { backgroundColor: '#E0F2FE' }]}> 
            <Ionicons name="cash-outline" size={20} color="#1D4ED8" />
          </View>
          <View style={styles.preferenceText}>
            <Text style={styles.preferenceTitle}>Currency</Text>
            <Text style={styles.preferenceSubtitle}>Change your primary currency</Text>
          </View>
          <Text style={styles.preferenceValue}>USD</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.preferenceRow}>
          <View style={[styles.preferenceIcon, { backgroundColor: '#E2E8F0' }]}> 
            <Ionicons name="moon-outline" size={20} color="#334155" />
          </View>
          <View style={styles.preferenceText}>
            <Text style={styles.preferenceTitle}>Dark Mode</Text>
            <Text style={styles.preferenceSubtitle}>Adjust visual appearance</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#fff' : '#fff'}
            trackColor={{ false: '#CBD5E1', true: '#1D4ED8' }}
          />
        </View>

        <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
          <View style={[styles.preferenceIcon, { backgroundColor: '#DCFCE7' }]}> 
            <Ionicons name="information-circle-outline" size={20} color="#047857" />
          </View>
          <View style={styles.preferenceText}>
            <Text style={styles.preferenceTitle}>About ExpenseLite</Text>
            <Text style={styles.preferenceSubtitle}>v2.4.0 • Terms & Privacy</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
          <View style={[styles.preferenceIcon, { backgroundColor: '#FEE2E2' }]}> 
            <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />
          </View>
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, styles.dangerText]}>Reset Data</Text>
            <Text style={[styles.preferenceSubtitle, styles.dangerText]}>Wipe all transactions and history</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={18} color="#1D4ED8" />
        <Text style={styles.logoutButtonText}>Logout from Account</Text>
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
    paddingBottom: 36,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 18,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 18,
  },
  editButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  preferenceCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  preferenceIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
    marginRight: 8,
  },
  dangerText: {
    color: '#DC2626',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
  },
});
