import {getInitials} from '@helpers';
import {useAppSelector, useAppDispatch} from '@hooks/rtkHooks';
import {useThemedStyles} from '@hooks/useThemedStyles';
import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Avatar,
  Card,
  useTheme,
  IconButton,
  Appbar,
  MD3Theme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {updateUser} from '@store/slices/settingsSlice'; // Assuming this action exists

interface User {
  name: string;
  email: string;
  password?: string;
}

export default function ProfileScreen({navigation}: any) {
  const theme = useTheme();
  const styles = useThemedStyles(themedStyles);
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.settings);
  console.log('User', user);

  const [formData, setFormData] = useState<User>({
    name: user.name,
    email: user.email,
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = useCallback((field: keyof User, value: string) => {
    setFormData(prevData => ({...prevData, [field]: value}));
  }, []);

  const validateForm = useCallback(() => {
    let isValid = true;
    setNameError('');
    setPasswordError('');

    if (formData.name.trim().length < 2) {
      setNameError('Name must be at least 2 characters long');
      isValid = false;
    }

    if (formData.password && formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    if (formData.password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  }, [formData, confirmPassword]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      const postData: Partial<User> = {};
      if (formData.name !== user.name) postData.name = formData.name;
      if (formData.password) postData.password = formData.password;

      if (Object.keys(postData).length > 0) {
        // Dispatch action to update user data
        // dispatch(updateUser(postData));
        setIsEditing(false);
      } else {
        console.log('No changes to update');
      }
    }
  }, [formData, user, validateForm, dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={'#F8F9FA'} barStyle={'dark-content'} />
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Avatar.Text
              size={120}
              label={getInitials(user?.name)}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <Card style={styles.card}>
            <Card.Title
              title="Personal Information"
              titleStyle={styles.cardTitle}
              right={props => (
                <IconButton
                  {...props}
                  icon={isEditing ? 'close' : 'pencil'}
                  onPress={() => setIsEditing(!isEditing)}
                  color={theme.colors.primary}
                />
              )}
            />
            <Card.Content>
              <TextInput
                label="Name"
                value={formData.name}
                onChangeText={value => handleChange('name', value)}
                style={styles.input}
                error={!!nameError}
                disabled={!isEditing}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}

              <TextInput
                label="Email"
                value={formData.email}
                disabled
                style={styles.input}
                mode="outlined"
                left={<TextInput.Icon icon="email" />}
              />

              {isEditing && (
                <>
                  <TextInput
                    label="New Password"
                    value={formData.password}
                    onChangeText={value => handleChange('password', value)}
                    secureTextEntry
                    style={styles.input}
                    error={!!passwordError}
                    mode="outlined"
                    left={<TextInput.Icon icon="lock" />}
                  />

                  <TextInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                    error={!!passwordError}
                    mode="outlined"
                    left={<TextInput.Icon icon="lock-check" />}
                  />
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </>
              )}

              {isEditing && (
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  labelStyle={styles.buttonText}
                  icon="content-save">
                  Update Profile
                </Button>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    appbar: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 16,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      marginBottom: 16,
      borderWidth: 4,
      borderColor: '#fff',
      elevation: 4,
    },
    avatarLabel: {
      fontSize: 40,
    },
    name: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#333',
    },
    email: {
      fontSize: 16,
      color: '#666',
    },
    card: {
      marginBottom: 16,
      elevation: 4,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    input: {
      marginBottom: 16,
      backgroundColor: '#fff',
    },
    button: {
      marginTop: 8,
      paddingVertical: 8,
      borderRadius: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      marginTop: -12,
      marginBottom: 12,
    },
  });

// function getInitials(name: string): string {
//   const names = name.trim().split(/\s+/);
//   if (names.length >= 2) {
//     return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
//   }
//   return name.trim().substring(0, 2).toUpperCase();
// }
