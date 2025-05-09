/** 휴대폰 유효성 검사 */
export function phoneNumberCheck(number) {
  let result = /^(01[016789])?[0-9]{3,4}[0-9]{4}$/;
  return result.test(number);
}

/** 이메일 유효성 검사 */
export function emailCheck(email) {
  let result = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return result.test(email);
}

/** 폼 에러 유효성 검사 처리
 * @description 폼 에러 유효성을 모두 체크한 후 모든 에러가 빈 문자열이면 true를 반환한다.
 * @param {Object} errors - 폼 에러 객체
 */
export function formErrorsValidation(errors) {
  return Object.values(errors).every((error) => error === '');
}
