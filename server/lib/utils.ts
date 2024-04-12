export const getRandomNumber = (min: number, max: number): number => {
  const randomNumber = Math.floor(Math.random() * max);
  if (randomNumber > min || !randomNumber) return randomNumber;
  return getRandomNumber(min, max);
};
