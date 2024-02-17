export function formatDate(date) {
  const year = date.getFullYear();
  // getMonth()는 0부터 시작하므로 1을 더해줍니다.
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}
