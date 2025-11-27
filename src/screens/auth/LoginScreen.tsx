import {HelperTextMessage, VectorIcon} from '@components';
import {SCREEN} from '@constants/enum';
import {isValidEmail, showToast} from '@helpers';
import {useAppDispatch} from '@hooks/rtkHooks';
import {useLoginMutation} from '@redux/features/businesses/businessService';
import {
  setAuthlessLogin,
  setIsLoggedIn,
  setToken,
  setUser,
} from '@redux/features/settings';
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';

const LoginScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [login] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePasscode, setSecurePasscode] = useState(false);
  const [networkCallStatus, setNetworkCallStatus] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    emailMessage: '',
    password: false,
    passwordMessage: '',
  });

  const handleAuthLessLogin = async () => {
    try {
      dispatch(setAuthlessLogin(true));
    } catch (error) {}
  };

  const handleLogin = async () => {
    if (!isValid()) return;
    try {
      setNetworkCallStatus(true);
      const postData = {
        email: email,
        password: password,
      };

      const resp = await login(postData).unwrap();
      if (resp && resp?.success == true && resp?.token) {
        dispatch(setToken(resp?.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setUser(resp?.user));
        console.log('ResponseInLogin', resp);
      }
    } catch (error) {
      console.log('ErrorInLogin', error);
      showToast({message: 'Failed to login. Please try again'});
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

    return isValid;
  };
  const toggleSecure = () => {
    setSecurePasscode(!securePasscode);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableOpacity
        onPress={handleAuthLessLogin}
        style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <VectorIcon
          type={'fa5'}
          name="rocket"
          size={100}
          color={theme.colors.primary}
          style={styles.logo}
        />
        <Text style={styles.appName}>Connectme</Text>
        <Text style={styles.subtitle}>
          Welcome back! Please login to your account.
        </Text>

        <View style={styles.input}>
          <TextInput
            autoCapitalize="none"
            label="Email"
            value={email}
            error={errors.email}
            onChangeText={text => {
              setEmail(text);
              setErrors(prevState => ({
                ...prevState,
                email: false,
                emailMessage: '',
              }));
            }}
            mode="outlined"
            left={
              <TextInput.Icon
                icon={'email-variant'}
                color={errors.email ? theme.colors.error : theme.colors.outline}
              />
            }
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
            secureTextEntry={securePasscode}
            error={errors.password}
            mode="outlined"
            left={
              <TextInput.Icon
                icon={'lock'}
                color={
                  errors.password ? theme.colors.error : theme.colors.outline
                }
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

        <Button
          mode="contained"
          style={styles.loginButton}
          loading={networkCallStatus}
          disabled={networkCallStatus}
          onPress={handleLogin}>
          Login
        </Button>

        {/* <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={styles.googleButton}>
          <View style={styles.googleIconContainer}>
            <Image
              source={require('@assets/icons/google.png')}
              style={{height: 24, width: 24}}
            />
          </View>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton}>
          <VectorIcon
            type={'fa5'}
            name="facebook"
            size={20}
            color="#FFFFFF"
            style={styles.facebookIcon}
          />
          <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.navigate(SCREEN.REGISTER)}>
          <Text style={styles.signUp}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  skipContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#007AFF',
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
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 15,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  googleIconContainer: {
    // backgroundColor: '#4285F4',
    // padding: 6,
    // borderRadius: 2,
    // marginRight: 10,
  },
  googleButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  facebookIcon: {
    marginRight: 10,
  },
  facebookButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007AFF',
  },
  signUp: {
    textAlign: 'center',
    marginTop: 15,
    color: '#666',
  },
});

export default LoginScreen;
