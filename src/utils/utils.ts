export const getDays = (duration: any) => {
  if (duration === "1M") {
    return 30;
  } else if (duration === "1Y") {
    return 365;
  } else if (duration === "3Y") {
    return 365 * 3;
  } else if (duration === "5Y") {
    return 365 * 5;
  }
};

export const calculateDate = (value: any) => {
  let end = new Date();
  let start = new Date();

  start.setDate(end.getDate() - getDays(value)!);
  end.setDate(end.getDate() + 1);
  return { end, start };
};
