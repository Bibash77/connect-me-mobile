import {useState} from 'react';

import {baseApi} from '@redux/baseApi';

import {useAppDispatch} from './rtkHooks';
import {
  IGeneralLoginResponse,
  ILoginParam,
  setGeneralToken,
  setGeneralUserDetail,
  signOut,
} from '@redux/features/auth';
import {showToast} from '@helpers';

export const useAuthentication = () => {
  const dispatch = useAppDispatch();

  // const {isAuthenticated, user} = useAppSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  // const [generalLogin] = useGeneralLoginMutation();

  const authenticateUser = async (
    password: string,
    email: string,
  ): Promise<any> => {
    try {
      setIsLoading(true);
      const loginParams: ILoginParam = {
        email: email,
        password: password,
      };
      let generalResponse: IGeneralLoginResponse | undefined = undefined;

      generalResponse = await generalLogin({
        email: email,
        password: password,
      }).unwrap();

      if (generalResponse) {
        dispatch(setGeneralToken(generalResponse?.token));
        dispatch(setGeneralUserDetail(generalResponse?.user));
        return generalResponse;
      }
    } catch (error) {
      console.log('ErrorInLogin!!!', error);
      showToast({
        message: 'Login failed. Invalid login credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);

    try {
      if (isAuthenticated && !!user) {
        dispatch(baseApi.util.resetApiState());
        dispatch(signOut());
      }
    } catch (_) {
      console.log(_);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authenticateUser,
    isLoading,
    logoutUser,
  };
};
