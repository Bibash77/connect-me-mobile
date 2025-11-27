import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import {BASE_URL} from '@constants/config';

// import {signOut} from './features/auth';
import {RootState} from './store';

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  prepareHeaders: (headers, {getState}) => {
    // const token = (getState() as RootState).auth.token;
    // if (token) {
    //   headers.set('Authorization', `Bearer ${token}`);
    // }
  },
});

const baseQueryInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log('Resulttt@!!!!!', result);

  if (result.error && result.error.status === 401) {
    api.dispatch(baseApi.util.resetApiState());
    // api.dispatch(signOut());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  tagTypes: ['Overview'],
});
