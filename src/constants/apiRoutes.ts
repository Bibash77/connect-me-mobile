export const apiRoutes = {
  //APF Api
  login: 'v1/auth/login',
  register: 'v1/auth/register',
  getAllList: 'v2/business/paginated/minimal',
  getRatingList: (params: any) =>
    `v2/business/ratings/${params?.businessId}?page=${params?.page}&limit=${params?.limit}`,
  getOverviewDetails: (params: any) =>
    `v2/business/overview/${params?.businessId}`,
  getDashboardNearby: 'v2/business/nearby',
  getDashboardTopBusiness: 'v2/business/top',
  getDashboardTopCategories: 'v2/business/categories',
  getCategoriesWithTags: 'v1/category/all',
};
