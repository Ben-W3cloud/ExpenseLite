import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Pressable,
  Modal,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { darkMode, setDarkMode, theme } = useTheme();
  const { profile, loading, signOut, updateProfile, uploadAvatar } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [profileEditorVisible, setProfileEditorVisible] = useState(false);
  const [draftName, setDraftName] = useState(profile?.full_name ?? '');
  const [draftEmail, setDraftEmail] = useState(profile?.email ?? '');
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const styles = useMemo(() => getStyles(theme), [theme]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to choose a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setSavingAvatar(true);
      try {
        await uploadAvatar(result.assets[0].uri);
        setModalVisible(false);
      } catch {
        Alert.alert('Error', 'Could not upload avatar. Check your connection.');
      } finally {
        setSavingAvatar(false);
      }
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Allow camera access to take a profile picture.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setSavingAvatar(true);
      try {
        await uploadAvatar(result.assets[0].uri);
        setModalVisible(false);
      } catch {
        Alert.alert('Error', 'Could not upload avatar. Check your connection.');
      } finally {
        setSavingAvatar(false);
      }
    }
  };

  const removeProfilePicture = async () => {
    try {
      await updateProfile({ avatar_url: null });
      setModalVisible(false);
    } catch {
      Alert.alert('Error', 'Could not remove avatar.');
    }
  };

  const saveProfile = async () => {
    if (!draftName.trim() || !draftEmail.includes('@')) {
      Alert.alert('Check profile details', 'Enter a valid name and email address.');
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({
        full_name: draftName.trim(),
        email: draftEmail.trim().toLowerCase(),
      });
      setProfileEditorVisible(false);
    } catch {
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const changeCurrency = () => {
    Alert.alert('Primary currency', 'Choose the currency label used in the app.', [
      { text: 'USD', onPress: () => updateProfile({ currency: 'USD' }) },
      { text: 'NGN', onPress: () => updateProfile({ currency: 'NGN' }) },
      { text: 'EUR', onPress: () => updateProfile({ currency: 'EUR' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          const result = await signOut();
          if (!result.ok) {
            Alert.alert('Error', result.error);
          }
        },
      },
    ]);
  };

  const displayName = profile?.full_name || 'User';
  const displayEmail = profile?.email || '';
  const avatarUrl = profile?.avatar_url || null;

  if (loading) {
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Ionicons name="notifications-outline" size={24} color={theme.primary} />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
            <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
              <View style={styles.dragHandle} />
              <Text style={styles.sheetTitle}>Change Profile Picture</Text>

              {savingAvatar ? (
                <View style={styles.savingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={styles.savingText}>Uploading...</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity style={styles.sheetItem} onPress={takePhoto}>
                    <Ionicons name="camera-outline" size={22} color={theme.textPrimarySheet} />
                    <Text style={[styles.sheetItemText, styles.textPrimary]}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sheetItem} onPress={pickImage}>
                    <Ionicons name="image-outline" size={22} color={theme.textPrimarySheet} />
                    <Text style={[styles.sheetItemText, styles.textPrimary]}>Choose from Library</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sheetItem} onPress={removeProfilePicture}>
                    <Ionicons name="trash-outline" size={22} color={theme.iconRed} />
                    <Text style={[styles.sheetItemText, styles.textDanger]}>Remove Current Photo</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={[styles.sheetItem, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={profileEditorVisible}
          onRequestClose={() => setProfileEditorVisible(false)}
        >
          <Pressable style={styles.centerBackdrop} onPress={() => setProfileEditorVisible(false)}>
            <Pressable style={styles.editorCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.sheetTitle}>Edit Profile</Text>
              <TextInput
                style={styles.editorInput}
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Full name"
                placeholderTextColor={theme.textSecondary}
              />
              <TextInput
                style={styles.editorInput}
                value={draftEmail}
                onChangeText={setDraftEmail}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={[styles.saveProfileButton, savingProfile && { opacity: 0.6 }]}
                onPress={saveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveProfileButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        <View style={styles.headerCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={48} color={theme.primary} />
              )}
            </View>
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => {
                setDraftName(profile?.full_name ?? '');
                setDraftEmail(profile?.email ?? '');
                setModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{displayEmail}</Text>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.85}
            onPress={() => {
              setDraftName(profile?.full_name ?? '');
              setDraftEmail(profile?.email ?? '');
              setProfileEditorVisible(true);
            }}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.preferenceCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8} onPress={changeCurrency}>
            <View style={[styles.preferenceIcon, { backgroundColor: theme.iconBlueBg }]}>
              <Ionicons name="cash-outline" size={20} color={theme.iconBlue} />
            </View>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Currency</Text>
              <Text style={styles.preferenceSubtitle}>Change your primary currency</Text>
            </View>
            <Text style={styles.preferenceValue}>{profile?.currency ?? 'USD'}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={styles.preferenceRow}>
            <View style={[styles.preferenceIcon, { backgroundColor: theme.iconSlateBg }]}>
              <Ionicons name="moon-outline" size={20} color={theme.iconSlate} />
            </View>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Dark Mode</Text>
              <Text style={styles.preferenceSubtitle}>Adjust visual appearance</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor="#fff"
              trackColor={{ false: theme.switchTrackFalse, true: theme.primary }}
            />
          </View>

          <TouchableOpacity
            style={styles.preferenceRow}
            activeOpacity={0.8}
            onPress={() => Alert.alert('About ExpenseLite', 'ExpenseLite v1.0.0\nA lightweight personal finance tracker.')}
          >
            <View style={[styles.preferenceIcon, { backgroundColor: theme.iconGreenBg }]}>
              <Ionicons name="information-circle-outline" size={20} color={theme.iconGreen} />
            </View>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>About ExpenseLite</Text>
              <Text style={styles.preferenceSubtitle}>v1.0.0 - Terms & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={theme.iconRed} />
          <Text style={styles.logoutButtonText}>Logout from Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: { flex: 1, paddingTop: 23, backgroundColor: theme.background },
  contentContainer: { paddingHorizontal: 20, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: theme.text },
  headerCard: {
    backgroundColor: theme.card, borderRadius: 28, padding: 24, alignItems: 'center',
    marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
  avatarWrapper: { position: 'relative', marginBottom: 18 },
  avatarCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: theme.avatarBg,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarImage: { width: 120, height: 120, borderRadius: 60, resizeMode: 'cover' },
  editBadge: {
    position: 'absolute', right: 2, bottom: 2, width: 36, height: 36,
    borderRadius: 18, backgroundColor: theme.primary, alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: theme.card,
  },
  profileName: { fontSize: 20, fontWeight: '700', color: theme.text, marginBottom: 6 },
  profileEmail: { fontSize: 14, color: theme.textSecondary, marginBottom: 18 },
  editButton: { backgroundColor: theme.primary, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 32 },
  editButtonText: { color: theme.buttonText, fontWeight: '700', fontSize: 14 },
  preferenceCard: {
    backgroundColor: theme.card, borderRadius: 28, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 }, elevation: 3, marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 16 },
  preferenceRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  preferenceIcon: {
    width: 44, height: 44, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginRight: 14,
  },
  preferenceText: { flex: 1 },
  preferenceTitle: { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 4 },
  preferenceSubtitle: { fontSize: 13, color: theme.textSecondary },
  preferenceValue: { fontSize: 14, fontWeight: '700', color: theme.primary, marginRight: 8 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: theme.card, borderRadius: 20, paddingVertical: 16,
    borderWidth: 1, borderColor: theme.iconRed,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  logoutButtonText: { fontSize: 15, fontWeight: '700', color: theme.iconRed },
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  sheetContainer: {
    backgroundColor: theme.sheetBg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 14, paddingBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  centerBackdrop: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center', padding: 20,
  },
  editorCard: { backgroundColor: theme.sheetBg, borderRadius: 24, padding: 20 },
  editorInput: {
    backgroundColor: theme.sheetItemBg, borderRadius: 16, borderWidth: 1,
    borderColor: theme.border, padding: 16, color: theme.text, fontSize: 16,
    marginBottom: 12,
  },
  saveProfileButton: {
    backgroundColor: theme.primary, borderRadius: 18, alignItems: 'center',
    paddingVertical: 15, marginTop: 4,
  },
  saveProfileButtonText: { color: theme.buttonText, fontWeight: '700' },
  savingContainer: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  savingText: { color: theme.textSecondary, fontSize: 14 },
  dragHandle: {
    width: 40, height: 5, backgroundColor: theme.sheetDrag, borderRadius: 3,
    alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18, fontWeight: '700', color: theme.text, textAlign: 'center', marginBottom: 20,
  },
  sheetItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.sheetItemBg,
    padding: 16, borderRadius: 16, marginBottom: 12,
  },
  sheetItemText: { fontSize: 16, fontWeight: '600', marginLeft: 12 },
  textPrimary: { color: theme.textPrimarySheet },
  textDanger: { color: theme.iconRed },
  cancelBtn: { backgroundColor: theme.sheetItemBg, justifyContent: 'center', marginTop: 4, marginBottom: 0 },
  cancelBtnText: { color: theme.textCancel, fontSize: 15, fontWeight: '900' },
});
