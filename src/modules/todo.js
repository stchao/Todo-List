import { v4 as uuidv4 } from 'uuid';

export const Priority = {
	Low: 'Low',
	Medium: 'Medium',
	High: 'High',
};

export const PriorityMapping = (priority) => {
	switch (priority) {
		case 'Priority: Medium':
			return 1;
		case 'Priority: High':
			return 2;
		case 'Priority: Low':
		default:
			return 0;
	}
};

export const Todo = (
	title = '',
	description = '',
	dueDateISO = new Date().toISOString(),
	priority = Priority.Low,
	completed = false,
	currentUuid = ''
) => {
	return {
		uuid: currentUuid || uuidv4(),
		title,
		description,
		dueDateISO,
		priority,
		lastModifiedISO: new Date().toISOString(),
		completed,
	};
};
