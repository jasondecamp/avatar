export const ordinal = (number) => {
  /* Format a number with an ordinal suffix (e.g. 1st, 2nd, etc) */
  const s = ["th","st","nd","rd"];
  const v = number%100;
  return number+(s[(v-20)%10]||s[v]||s[0]);
};
