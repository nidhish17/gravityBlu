function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const truncate = (s, n, omission = '…') => {
  const arr = Array.from((s ?? '').toString()); // handles surrogate pairs
  return arr.length > n ? arr.slice(0, n).join('') + omission : arr.join('');
};


export {formatBytes, truncate};