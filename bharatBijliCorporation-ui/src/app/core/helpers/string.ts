export function getShortMonth(fullMonthName: string): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const index = monthNames.indexOf(fullMonthName);
  return index !== -1 ? shortMonthNames[index] : fullMonthName;
}

export function getShortYear(year: string): string {
  return ('' + year).slice(2);
}
