

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * 사용자가 입력한 폼 필드 값에 대해 유효성을 검사하고, 
 * 에러 또는 성공 메시지를 반환하는 함수입니다.
 *
 * @param {Object} params - 검사에 필요한 파라미터 객체입니다.
 * @param {string} params.name - 검사할 필드의 이름 ('username', 'email', 'password', 'confirmPassword', 'phone1'~'phone3', 'address1' 등).
 * @param {string} params.value - 해당 필드에 사용자가 입력한 값.
 * @param {boolean} [params.isValidPhone] - 전화번호 유효성 여부 (phone 필드의 경우에만 사용).
 * @param {boolean} [params.isAuthEmail] - 이메일 인증 여부 (email 필드에서 성공 메시지 판단 시 사용).
 * @param {Object} [params.formData] - 전체 폼 데이터 객체 (비밀번호 확인 등 비교가 필요한 경우 사용).
 * @param {string} [params.formData.password] - 비밀번호 값 (confirmPassword와 비교 시 사용).
 * @param {string} [params.formData.confirmPassword] - 비밀번호 확인 값 (password 변경 시 재검증에 사용).
 *
 * @returns {{ name: string, errorMessage: string, successMessage: string }}
 * 유효성 검사 결과를 담은 객체를 반환합니다.
 * - `name`: 검사한 필드 이름 (전화번호 필드인 경우 'phone'으로 통합).
 * - `errorMessage`: 유효하지 않을 경우의 메시지.
 * - `successMessage`: 유효할 경우의 메시지.
 *
 * @example
 * const result = validateField({
 *   name: 'email',
 *   value: 'test@example.com',
 *   isAuthEmail: false
 * });
 * // 결과: { name: 'email', errorMessage: '', successMessage: '이메일 형식이 올바릅니다.' }
 */
export function validateField({ name, value, isValidPhone, isAuthEmail, formData }) {
    let errorMessage = '';
    let successMessage = '';

    switch (name) {
        case 'username':
            if (!value) {
                errorMessage = '이름을 입력하세요.';
            } else if (value.length < 3) {
                errorMessage = '이름은 3자 이상이어야 합니다.';
            } else {
                successMessage = '이름이 확인되었습니다.';
            }
            break;

        case 'email':
            if (!value) {
                errorMessage = '이메일을 입력하세요.';
            } else if (!emailPattern.test(value)) {
                errorMessage = '유효한 이메일 주소를 입력하세요.';
            } else if (!isAuthEmail) {
                successMessage = '이메일 형식이 올바릅니다.';
            }
            break;

        case 'password':
            if (!value) {
                errorMessage = '비밀번호를 입력하세요.';
            } else if (value.length < 8) {
                errorMessage = '비밀번호는 8자 이상이어야 합니다.';
            } else {
                successMessage = '비밀번호가 확인되었습니다.';
            }

            // 비밀번호가 변경되면 비밀번호 확인도 다시 검증
            if (formData.confirmPassword) {
                validateField('confirmPassword', formData.confirmPassword);
            }
            break;

        case 'confirmPassword':
            if (!value) {
                errorMessage = '비밀번호 확인을 입력하세요.';
            } else if (value !== formData.password) {
                errorMessage = '비밀번호가 일치하지 않습니다.';
            } else {
                successMessage = '비밀번호가 일치합니다.';
            }
            break;

        case 'phone1':
        case 'phone2':
        case 'phone3':
            if (!value) {
                errorMessage = '전화번호를 입력하세요.';
            } else if (!isValidPhone) {
                errorMessage = '유효한 전화번호를 입력하세요.';
            } else {
                successMessage = '전화번호가 확인되었습니다.';
            }
            break;

        case 'address1':
            if (!value) {
                errorMessage = '주소를 입력하세요.';
            } else {
                successMessage = '주소가 확인되었습니다.';
            }
            break;
        default:
    }
    if (name === 'phone1' || name === 'phone2' || name === 'phone3') {
        return { name: 'phone', errorMessage, successMessage }
    }
    return { name, errorMessage, successMessage };
};