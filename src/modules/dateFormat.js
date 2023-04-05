import { format } from 'date-fns';

export const formatWithoutTimezone = (dateISO = null) => {
	if (!dateISO) {
		return 'N/A';
	}

	const tempDate = new Date(dateISO);
	const userTimezoneOffset = tempDate.getTimezoneOffset() * 60000;
	const dateWithoutTimezone = new Date(
		tempDate.getTime() + userTimezoneOffset * Math.sign(userTimezoneOffset)
	);
	return format(dateWithoutTimezone, 'yyyy-MM-dd');
};
