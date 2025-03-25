import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 카테고리(대/중분류) */
export const getCategories = async () => {
  const url = apiRoutes.categories.getAllWithHierarchy();
  const response = await instance.get(url);

  return response.data;
};

/** 카테고리 대분류 */
export const getMajorCategories = async () => {
  const url = apiRoutes.categories.getAllMajor();
  const response = await instance.get(url);

  return response;
};
