import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { colors } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { signIn, loading } = useAuth();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.includes('@') || password.length < 1) {
      Alert.alert('Unable to log in', 'Enter a valid email and password.');
      return;
    }
    setSubmitting(true);
    const result = await signIn({ email: email.trim().toLowerCase(), password });
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert('Login failed', result.error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.includes('@')) {
      Alert.alert('Enter your email', 'Type your email address first so we can send a reset link.');
      return;
    }
    const result = await authService.sendPasswordReset(email.trim().toLowerCase());
    Alert.alert(
      'Password reset',
      result.ok
        ? 'If that email is registered, a reset link has been sent.'
        : result.error,
    );
  };

  const isBusy = submitting || loading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to continue tracking your expenses</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isBusy}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 44 }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isBusy}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                activeOpacity={0.7}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isBusy && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleLogin}
          disabled={isBusy}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.socialButton}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Google sign-in', 'Google sign-in is not yet available.')}
        >
          <Ionicons name="logo-google" size={20} color={theme.text} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: typeof colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 36 },
  backButton: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: theme.card,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: theme.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: theme.textSecondary, lineHeight: 22 },
  form: { gap: 20, marginBottom: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: theme.textSecondary },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card,
    borderRadius: 18, borderWidth: 1, borderColor: theme.border,
    paddingHorizontal: 16, height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: theme.text, height: '100%' },
  eyeButton: { position: 'absolute', right: 16, height: '100%', justifyContent: 'center' },
  forgotText: { fontSize: 14, fontWeight: '600', color: theme.primary, textAlign: 'right' },
  primaryButton: {
    backgroundColor: theme.primary, borderRadius: 24, paddingVertical: 18,
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.18,
    shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4, marginBottom: 24,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: theme.buttonText, fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.border },
  dividerText: { fontSize: 13, color: theme.textSecondary, fontWeight: '600' },
  socialButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: theme.card, borderRadius: 24, paddingVertical: 16,
    borderWidth: 1, borderColor: theme.border, marginBottom: 24,
  },
  socialButtonText: { fontSize: 15, fontWeight: '700', color: theme.text },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 14, color: theme.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: theme.primary },
});
