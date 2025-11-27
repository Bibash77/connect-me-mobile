import React, {useEffect, useState} from 'react';

import {PrimarySpinner} from '@components';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IAuthHandlerProps {
  children: React.ReactNode;
}

export default function AuthHandler({children}: IAuthHandlerProps) {
  const [redhydrating, setRedhydrating] = useState(true);

  useEffect(() => {
    prepareAppState();
  }, []);

  const prepareAppState = async () => {
    const token = await AsyncStorage.getItem('jwt_token');

    if (!!token) {
    }

    setRedhydrating(false);
  };

  if (redhydrating) return <PrimarySpinner />;

  return children;
}
