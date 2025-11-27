import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Checkbox,
  MD3Theme,
} from 'react-native-paper';
import {HelperTextMessage, VectorIcon} from '@components';
import {SCREEN} from '@constants/enum';
import {isValidEmail, showToast} from '@helpers';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {useRegisterMutation} from '@redux/features/businesses/businessService';
import {useAppDispatch} from '@hooks/rtkHooks';
import {setIsLoggedIn, setToken, setUser} from '@redux/features/settings';

const RegisterScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(themedStyles);
  const [register] = useRegisterMutation();
  const theme = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [securePasscode, setSecurePasscode] = useState(false);
  const [networkCallStatus, setNetworkCallStatus] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    emailMessage: '',
    password: false,
    passwordMessage: '',
    username: false,
    usernameMessage: '',
    terms: false,
    termsMessage: '',
  });

  const toggleSecure = () => {
    setSecurePasscode(!securePasscode);
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  const handleRegister = async () => {
    if (!isValid()) return;
    try {
      setNetworkCallStatus(true);
      const postData = {
        username: fullName,
        status: 'ACTIVE',
        name: fullName,
        email: email,
        password: password,
        mobileNumber: mobileNumber ?? '',
        userType: 'ADMIN',
      };
      const resp = await register(postData).unwrap();
      if (resp && resp?.success == true && resp?.token) {
        showToast({message: 'User registered successfully.'});
        dispatch(setToken(resp?.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setUser(resp?.user));
      }
      console.log('ResponseFromRegister!', resp);
    } catch (error) {
      console.log('ErrorINRegister', error);
      showToast({message: 'Failed to register user. Please try again'});
    } finally {
      setNetworkCallStatus(false);
    }
  };

  const isValid = (): boolean => {
    let isValid = true;

    if (!email) {
      setErrors(prevState => ({
        ...prevState,
        email: true,
        emailMessage: 'Email is a required field.',
      }));
      isValid = false;
    }
    if (!fullName) {
      setErrors(prevState => ({
        ...prevState,
        username: true,
        usernameMessage: 'Name is a required field.',
      }));
      isValid = false;
    }

    if (!password) {
      setErrors(prevState => ({
        ...prevState,
        password: true,
        passwordMessage: 'Password is a required field.',
      }));
      isValid = false;
    }
    if (!isValidEmail(email)) {
      setErrors(prevState => ({
        ...prevState,
        email: true,
        emailMessage: 'Email is not valid.',
      }));
      isValid = false;
    }
    if (password.length < 3) {
      setErrors(prevState => ({
        ...prevState,
        password: true,
        passwordMessage: 'Password must be of min. 4 letters',
      }));
      isValid = false;
    }
    return isValid;
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 18,
          backgroundColor: theme.colors.background,
        }}>
        <TouchableOpacity onPress={handleGoBack}>
          <VectorIcon
            type={'materialCommunity'}
            name={'arrow-left'}
            size={28}
            color={theme.colors.onBackground}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <VectorIcon
            type={'fa5'}
            name="user-plus"
            size={80}
            color={theme.colors.primary}
            style={styles.logo}
          />
          <Text style={styles.appName}>Connectme</Text>
          <Text style={styles.subtitle}>Create an account to get started.</Text>

          <View style={styles.input}>
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                setErrors(prevState => ({
                  ...prevState,
                  username: false,
                  usernameMessage: '',
                }));
              }}
              error={errors.username}
              mode="outlined"
              left={
                <TextInput.Icon
                  icon={'account'}
                  color={
                    errors.username
                      ? theme.colors.error
                      : theme.colors.onBackground
                  }
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                />
              }
            />
            <HelperTextMessage
              isError={errors.username}
              errorMessage={errors.usernameMessage}
            />
          </View>

          <View style={styles.input}>
            <TextInput
              autoCapitalize="none"
              label="Email"
              value={email}
              mode="outlined"
              error={errors.email}
              left={
                <TextInput.Icon
                  icon={'email-variant'}
                  color={
                    errors.email
                      ? theme.colors.error
                      : theme.colors.onBackground
                  }
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                />
              }
              onChangeText={text => {
                setEmail(text);
                setErrors(prevState => ({
                  ...prevState,
                  email: false,
                  emailMessage: '',
                }));
              }}
            />
            <HelperTextMessage
              isError={errors.email}
              errorMessage={errors.emailMessage}
            />
          </View>

          <View style={styles.input}>
            <TextInput
              autoCapitalize="none"
              label="Password"
              value={password}
              onChangeText={text => {
                setPassword(text);
                setErrors(prevState => ({
                  ...prevState,
                  password: false,
                  passwordMessage: '',
                }));
              }}
              mode="outlined"
              secureTextEntry={securePasscode}
              error={errors.password}
              left={
                <TextInput.Icon
                  icon={'lock'}
                  color={
                    errors.password
                      ? theme.colors.error
                      : theme.colors.onBackground
                  }
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                />
              }
              right={
                <TextInput.Icon
                  icon={securePasscode ? 'eye-off-outline' : 'eye-outline'}
                  color={
                    errors.password
                      ? theme.colors.error
                      : theme.colors.onBackground
                  }
                  onPress={() => {
                    toggleSecure();
                  }}
                />
              }
            />
            <HelperTextMessage
              isError={errors.password}
              errorMessage={errors.passwordMessage}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              label="Mobile Number"
              value={mobileNumber}
              placeholder={'+1 (111) 111-1111'}
              onChangeText={setMobileNumber}
              mode="outlined"
              left={<TextInput.Icon icon="phone" />}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={agreeTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeTerms(!agreeTerms)}
            />
            <Text style={styles.termsText}>
              I agree to the Terms and Conditions
            </Text>
          </View>

          <Button
            mode="contained"
            style={styles.registerButton}
            onPress={handleRegister}
            loading={networkCallStatus}
            disabled={!agreeTerms || networkCallStatus}>
            Register
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate(SCREEN.LOGIN)}>
            <Text style={styles.loginLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    scrollView: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    logo: {
      alignSelf: 'center',
      marginBottom: 20,
    },
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: '#666',
    },
    input: {
      marginBottom: 12,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    termsText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#666',
    },
    registerButton: {
      marginTop: 10,
      marginBottom: 15,
    },
    loginLink: {
      textAlign: 'center',
      marginTop: 15,
      color: '#007AFF',
    },
  });

export default RegisterScreen;
