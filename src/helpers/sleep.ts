export const artificialSleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
