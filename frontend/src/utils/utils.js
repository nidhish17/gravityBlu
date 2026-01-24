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

function formatSecondsToHHMMSS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Function to add a leading zero if the number is a single digit
    const pad = (num) => num.toString().padStart(2, '0');

    // Return the formatted string
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function getRandomColor() {
  // Generate a random number between 0 and 0xFFFFFF (16777215)
  // Convert it to a hexadecimal string
  let color = Math.floor(Math.random()*16777215).toString(16);

  // Pad the string with zeros at the start if it's less than 6 characters
  // to ensure a valid hex code (e.g., #0000FF)
  return "#" + color.padStart(6, '0');
}


export {formatBytes, truncate, formatSecondsToHHMMSS, getRandomColor};