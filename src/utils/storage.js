/** 토큰 조회 */
export function getToken() {
  return localStorage.getItem('token');
}

/** 토큰 저장 */
export function setToken(token) {
  return localStorage.setToken('token', token);
}
