import Toast from 'react-native-simple-toast';

interface IToast {
  message: string;
  position?: any;
}

export const showToast = (toast: IToast) => {
  Toast.showWithGravity(toast.message, Toast.SHORT, Toast.TOP);
};
