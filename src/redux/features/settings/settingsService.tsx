// // import { authRoutes } from '@constants/apiRoutes';
// // import { IApiResponse, IStateMachineTransition } from '@constants/types';
// import {authRoutes, settingsRoutes} from '@constants/apiRoutes';
// import {AuthInfo, IUser} from '@constants/types';
// import {baseApi} from '@redux/baseApi';

// export interface ILoginParam {
//   email: string;
//   name: string;
//   fcm_token: string;
// }

// export interface LoginResponse {
//   token: string;
//   user: AuthInfo;
//   user_info: IUser;
// }

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   created_at: string;
//   updated_at: string;
//   staff_id: string;
//   active: number;
//   privilege: number;
// }

// export interface ISubscriptionParam {
//   fcm_token: string;
//   name: string;
//   email: string;
//   topics: [];
// }
// const settingsApi = baseApi.injectEndpoints({
//   endpoints: builder => ({
//     submitSubscription: builder.mutation<[], ISubscriptionParam>({
//       query: body => ({
//         method: 'POST',
//         url: settingsRoutes.postSubscription,
//         body,
//       }),
//     }),
//     getSubscriptionList: builder.query<[], void>({
//       query: () => settingsRoutes.getSubscriptionList,
//     }),
//     getSectionOrder: builder.query<[], void>({
//       query: () => settingsRoutes.getSectionOrder,
//     }),
//   }),
//   overrideExisting: true,
// });

// export const {
//   useSubmitSubscriptionMutation,
//   useLazyGetSubscriptionListQuery,
//   useLazyGetSectionOrderQuery,
// } = settingsApi;
