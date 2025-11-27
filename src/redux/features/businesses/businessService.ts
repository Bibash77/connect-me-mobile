import {apiRoutes} from '@constants/apiRoutes';
import {baseApi} from '@redux/baseApi';

export interface ISiteSettings {
  data: [];
}

export interface IContactParams {
  page?: string;
  staff_name?: string;
  staff_rank?: string;
}
export interface ILoginParams {
  email: string;
  password: string;
}

export interface ITopBusinessParams {
  latitude: string;
  longitude: string;
  page: string;
  limit: string;
}
const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<[], ILoginParams>({
      query: body => ({
        url: apiRoutes.login,
        body,
        method: 'POST',
      }),
    }),

    register: builder.mutation<[], ILoginParams>({
      query: body => ({
        url: apiRoutes.register,
        body,
        method: 'POST',
      }),
    }),

    allBusinessList: builder.mutation<[], void>({
      query: body => ({
        url: apiRoutes.getAllList,
        body,
        method: 'POST',
      }),
    }),

    allSearchedCategories: builder.mutation<[], void>({
      query: body => ({
        url: apiRoutes.getDashboardTopCategories,
        body,
        method: 'POST',
      }),
    }),

    allNearbyBussinesses: builder.mutation<[], void>({
      query: body => ({
        url: apiRoutes.getDashboardNearby,
        body,
        method: 'POST',
      }),
    }),

    allTopBussinesses: builder.mutation<[], ITopBusinessParams>({
      query: body => ({
        url: apiRoutes.getDashboardTopBusiness,
        body,
        method: 'POST',
      }),
    }),

    getRatingList: builder.query<[], IContactParams>({
      query: params => apiRoutes.getRatingList(params),
    }),
    getCategoriesWithTags: builder.query<[], void>({
      query: () => apiRoutes.getCategoriesWithTags,
    }),
    getOverviewDetail: builder.query<[], IContactParams>({
      query: params => apiRoutes.getOverviewDetails(params),
      providesTags: ['Overview'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useAllBusinessListMutation,
  useLazyGetRatingListQuery,
  useLazyGetOverviewDetailQuery,
  useAllNearbyBussinessesMutation,
  useAllTopBussinessesMutation,
  useAllSearchedCategoriesMutation,
  useLazyGetCategoriesWithTagsQuery,
  //   useLazyGetContactInfoQuery,
} = authApi;
