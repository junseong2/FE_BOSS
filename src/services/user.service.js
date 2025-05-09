import { AxiosError } from "axios";
import { toastError, toastInfo } from "../components/toast/CustomToast";


export const getUserInfo = async (navigate) => {
    try {
        const response = await instance.get('/auth/user-info', {
            withCredentials: true,
        });

        if (response.status === 403) {
            toastInfo('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }

        const data = response.data;
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toastInfo('로그인 정보가 없습니다.');
                navigate('/signin');
            } else if (error.response?.status > 499) {
                toastError('서버 오류로 사용자 정보를 불러오지 못했습니다.');
            }
        }
    }
};