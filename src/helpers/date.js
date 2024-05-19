import moment from "moment";

export const calculateTimeBudgetObject = (
  endDate,
  fullName,
  timeFormat,
  startDate
) => {
  endDate = moment(endDate);
  const now = startDate ? moment(startDate) : moment();
  let years = endDate.diff(now, "years");
  let months = endDate.diff(now, "months");
  let days = endDate.diff(now, "days");
  if (timeFormat) {
    switch (timeFormat) {
      case "all":
        months = months - (years || 0) * 12;
        days = days - (months || 0) * 30 - (years || 0) * 12;
        return {
          str: `${years}y ${months}m ${days}d`,
          years,
          months,
          days,
        };
      case "months":
        return {
          str: `${months} ${
            fullName ? (months > 1 ? "Months" : "Month") : "Mo"
          }`,
          value: months,
          timeUnits: fullName ? "Months" : "Mo",
        };
      case "years":
        return {
          str: `${years} ${fullName ? (years > 1 ? "Years" : "Year") : "Ye"}`,
          value: years,
          timeUnits: fullName ? "Years" : "Ye",
        };
      default:
        return {
          str: `${days} ${fullName ? (days > 1 ? "Days" : "Day") : "Da"}`,
          value: days,
          timeUnits: fullName ? "Days" : "Da",
        };
    }
  } else {
    if (years >= 1)
      return {
        str: `${years} ${fullName ? (years > 1 ? "Years" : "Year") : "Ye"}`,
        value: years,
        timeUnits: fullName ? (years > 1 ? "Years" : "Year") : "Ye",
      };
    else if (months >= 1)
      return {
        str: `${months} ${fullName ? (months > 1 ? "Months" : "Month") : "Mo"}`,
        value: months,
        timeUnits: fullName ? (months > 1 ? "Months" : "Month") : "Mo",
      };
    else if (days >= 0)
      return {
        str: `${days} ${fullName ? (days > 1 ? "Days" : "Day") : "Da"}`,
        value: days,
        timeUnits: fullName ? (days > 1 ? "Days" : "Day") : "Da",
      };
    else if (years < 0)
      return {
        str: `${years} ${
          fullName ? (Math.abs(years) > 1 ? "Years" : "Year") : "Ye"
        }`,
        value: years,
        timeUnits: fullName ? (Math.abs(years) > 1 ? "Years" : "Year") : "Ye",
      };
    else if (months < 0)
      return {
        str: `${months} ${
          fullName ? (Math.abs(months) > 1 ? "Months" : "Month") : "Mo"
        }`,
        value: months,
        timeUnits: fullName
          ? Math.abs(months) > 1
            ? "Months"
            : "Month"
          : "Mo",
      };
    else if (days < 0)
      return {
        str: `${days} ${
          fullName ? (Math.abs(days) > 1 ? "Days" : "Day") : "Da"
        }`,
        value: days,
        timeUnits: fullName ? (Math.abs(days) > 1 ? "Days" : "Day") : "Da",
      };
    else
      return {
        str: `0 ${fullName ? (Math.abs(days) > 1 ? "Days" : "Day") : "Da"}`,
        value: 0,
        timeUnits: fullName ? (Math.abs(days) > 1 ? "Days" : "Day") : "Da",
      };
  }
};
