/* /scripts/helpers.js */
export function pad2(n) { return (n < 10 ? '0' : '') + n; }

export function timeToMinutes(t = '00:00') {
  const [hh = '0', mm = '0'] = (t || '0:0').split(':');
  return parseInt(hh, 10) * 60 + parseInt(mm, 10);
}

export function minutesToTime(min) {
  min = ((min % (24 * 60)) + (24 * 60)) % (24 * 60);
  const h = Math.floor(min / 60), m = min % 60;
  return pad2(h) + ':' + pad2(m);
}

export function addMinutesToTimeString(timeStr, minutesToAdd) {
  if (!timeStr) return '';
  return minutesToTime(timeToMinutes(timeStr) + minutesToAdd);
}

export function durationMinutes(start = '00:00', end = '00:00') {
  let s = timeToMinutes(start), e = timeToMinutes(end);
  if (e <= s) e += 24 * 60;
  return e - s;
}