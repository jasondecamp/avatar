export const phone = (phone) => {
  phone = String(phone).replace(/[^0-9a-zA-Z]+/g, '');

  // if the first character is '1', strip it out and add it back
  const c = (phone[0] === '1') ? '1' : '';
  phone = phone[0] === '1' ? phone.slice(1) : phone;
  phone = phone.substring(0, Math.min(phone.length, 10));

  // # (###) ###-#### as c (area) front-end
  const area = phone.substring(0,3);
  const front = phone.substring(3, 6);
  const end = phone.substring(6, 10);
  phone = c + phone;
  if (front) phone = (`${c?`${c} `:''}(${area}) ${front}`);
  if (end) phone += ('-' + end);
  return phone;
};
