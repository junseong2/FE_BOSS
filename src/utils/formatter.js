export function formatDate(isoString) {
  const date = new Date(isoString);

  const pad = (num) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const isoString = '2025-03-02T02:15:00.000+00:00';
console.log(formatDate(isoString)); // "2025-03-02 02:15:00"
