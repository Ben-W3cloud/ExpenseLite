import { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Pressable,
  Modal, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/constants/theme';

export default function ProfileScreen() {
  const { darkMode, setDarkMode, theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const styles = useMemo(() => getStyles(theme), [theme]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalVisible(false);
    }
  }

  const removeProfilePicture = () => {
    setImage(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
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
          {/* Backdrop overlay: Dismisses modal when tapping outside the sheet */}
          <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>

            {/* Prevent clicks inside the sheet from closing it */}
            <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>

              {/* Visual Drag Handle Indicator */}
              <View style={styles.dragHandle} />

              <Text style={styles.sheetTitle}>Change Profile Picture</Text>

              {/* Menu Options */}
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

              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.sheetItem, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

            </Pressable>
          </Pressable>
        </Modal>
        <View style={styles.headerCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={48} color={theme.primary} />
              )}
            </View>
            <TouchableOpacity style={styles.editBadge} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
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
            <View style={[styles.preferenceIcon, { backgroundColor: theme.iconBlueBg }]}>
              <Ionicons name="cash-outline" size={20} color={theme.iconBlue} />
            </View>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Currency</Text>
              <Text style={styles.preferenceSubtitle}>Change your primary currency</Text>
            </View>
            <Text style={styles.preferenceValue}>USD</Text>
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
              thumbColor={'#fff'}
              trackColor={{ false: theme.switchTrackFalse, true: theme.primary }}
            />
          </View>

          <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
            <View style={[styles.preferenceIcon, { backgroundColor: theme.iconGreenBg }]}>
              <Ionicons name="information-circle-outline" size={20} color={theme.iconGreen} />
            </View>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>About ExpenseLite</Text>
              <Text style={styles.preferenceSubtitle}>v2.4.0 • Terms & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
            <View style={[styles.preferenceIcon, { backgroundColor: theme.iconRedBg }]}>
              <Ionicons name="alert-circle-outline" size={20} color={theme.iconRed} />
            </View>
            <View style={styles.preferenceText}>
              <Text style={[styles.preferenceTitle, styles.dangerText]}>Reset Data</Text>
              <Text style={[styles.preferenceSubtitle, styles.dangerText]}>Wipe all transactions and history</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.iconRed} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color={theme.primary} />
          <Text style={styles.logoutButtonText}>Logout from Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 23,
    backgroundColor: theme.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerCard: {
    backgroundColor: theme.card,
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
    backgroundColor: theme.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  editBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.card,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 18,
  },
  editButton: {
    backgroundColor: theme.primary,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  editButtonText: {
    color: theme.buttonText,
    fontWeight: '700',
    fontSize: 14,
  },
  preferenceCard: {
    backgroundColor: theme.card,
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
    color: theme.text,
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
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
    color: theme.text,
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
    marginRight: 8,
  },
  dangerText: {
    color: theme.iconRed,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.card,
    borderRadius: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
  },
  //modal styles
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // slightly darker for better contrast
    justifyContent: 'flex-end', // Crucial: Pushes the content to the bottom
  },
  sheetContainer: {
    backgroundColor: theme.sheetBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 40, // Extra breathing room for iOS home indicator bars
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: theme.sheetDrag,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.sheetItemBg,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  sheetItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  textPrimary: {
    color: theme.textPrimarySheet,
  },
  textDanger: {
    color: theme.iconRed,
  },
  cancelBtn: {
    backgroundColor: theme.sheetItemBg,
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 0,
  },
  cancelBtnText: {
    color: theme.textCancel,
    fontSize: 15,
    fontWeight: '900',
  },
});

