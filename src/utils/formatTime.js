import { format, formatDistanceToNow } from 'date-fns';
import { convertToLocalTime } from 'date-fns-timezone';
// ----------------------------------------------------------------------

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// export const formatDate = (date) => {
//   const dateTmp = Date.parse(date.toLocaleString());
//   const localDate = convertToLocalTime(dateTmp, {
//     timeZone: timezone
//   });
//   return format(localDate, DEFAULT_DATE_FORMAT);
// };

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  const dateTmp = Date.parse(date.toLocaleString());
  const localDate = convertToLocalTime(dateTmp, {
    timeZone: timezone
  });

  return format(localDate, 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  const dateTmp = Date.parse(date.toLocalString());
  const localDate = convertToLocalTime(dateTmp, { timeZone: timezone });
  return format(localDate, 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}
