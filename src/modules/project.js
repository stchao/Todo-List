import { v4 as uuidv4 } from 'uuid';

export const Project = (title = '', currentUuid = '') => {
	return {
		uuid: currentUuid || uuidv4(),
		title,
		lastModifiedISO: new Date().toISOString(),
		todos: {},
	};
};
