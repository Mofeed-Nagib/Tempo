export const classnames = (...args: (string | undefined | null | false)[]) => {
  return args.filter(Boolean).join(" ");
};

export function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatHours = (hours: number, capitalize: boolean = false) => {
  if (capitalize) {
    return hours === 1 ? `1 Hour` : `${hours} Hours`;
  } else {
    return hours === 1 ? `1 hour` : `${hours} hours`;
  }
};

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
