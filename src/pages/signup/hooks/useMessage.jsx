import { useState } from "react";

export default function useMessage() {

    // 유효성 에러 메시지
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address1: '',
    });

    // 유효성 성공 메시지
    const [success, setSuccess] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address1: '',
    });

    /** 유효성 검사 결과 상태 업데이트 */
    const updateValidateField = ({ name, errorMessage, successMessage = '' }) => {
        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));

        setSuccess((prev) => ({
            ...prev,
            [name]: errorMessage === '' ? successMessage : '',
        }));
    };



    return { errors, success, updateValidateField }
}