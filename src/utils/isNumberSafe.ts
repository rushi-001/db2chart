export function isNumberSafe(incomingNumber: number | string): number {
  const number = Number(incomingNumber);
  return isNaN(number) ? 0 : number;
}
