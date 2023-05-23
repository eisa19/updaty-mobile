//concatString String Function
export const concatString = (string, length) => {
  return `${string.slice(0, length - 1).trim()}${
    string.length > length ? "..." : ""
  }`;
};
