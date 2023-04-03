import { TodoListStorage } from './todoListStorage';
import { Modal, TagId } from './modal';
import { TodoUI } from './todoUI';
import { ProjectUI } from './projectUI';

export const Action = {
	AddTodo: 0,
	UpdateTodo: 1,
	DeleteTodo: 2,
	AddProject: 3,
	UpdateProject: 4,
	DeleteProject: 5,
};

export const UIActions = (() => {
	const executeAction = (args, customObject = null) => {
		const title =
			document.querySelector(`#${TagId.title}`)?.value ||
			new Date().toLocaleString();
		const description =
			document.querySelector(`#${TagId.description}`)?.value || '';
		const dueDate =
			document.querySelector(`#${TagId.dueDate}`)?.value || '';
		const priority =
			document.querySelector(`#${TagId.priority}`)?.value || 'Low';
		const completed =
			document.querySelector(`#${TagId.completed}`)?.checked ?? false;

		switch (args.action) {
			case Action.AddTodo:
				customObject = TodoListStorage.addTodo();
			case Action.UpdateTodo:
				customObject.title = title;
				customObject.description = description;
				customObject.dueDate = dueDate;
				customObject.priority = priority;
				customObject.completed = completed;
				customObject.lastModifiedInMS = Date.now();
				TodoListStorage.updateTodo(customObject);
				break;
			case Action.AddProject:
				customObject = TodoListStorage.addProject();
			case Action.UpdateProject:
				customObject.title = title;
				customObject.lastModifiedInMS = Date.now();
				TodoListStorage.updateProjectTitle(customObject);
				break;
			default:
				return;
		}

		TodoUI.updateTodoElement(args, customObject);
		ProjectUI.updateProjectElement(args, customObject);
	};

	const showModal = (
		action,
		uuid = '',
		button = null,
		buttonContent = null
	) => {
		const container = document.querySelector('#container');
		let args = { action, button, buttonContent };
		let modal = null;
		let actionLabel = 'Update';

		switch (action) {
			case Action.AddTodo:
				actionLabel = 'Create';
			case Action.UpdateTodo:
				const selectedTodo =
					TodoListStorage.getActiveProject().todos[uuid] ?? null;
				modal = Modal.getTodoForm(
					executeAction,
					actionLabel,
					selectedTodo,
					args
				);
				break;
			case Action.AddProject:
				actionLabel = 'Create';
			case Action.UpdateProject:
				const selectedProject = TodoListStorage.get()[uuid] ?? null;
				modal = Modal.getProjectForm(
					executeAction,
					actionLabel,
					selectedProject,
					args
				);
				break;
			default:
				return;
		}

		container.appendChild(modal);
	};

	const getAddButton = (action) => {
		const addButtonElement = document.createElement('button');
		addButtonElement.classList.add(
			'flex-center-center',
			'add-button',
			'button',
			'font-bold'
		);
		addButtonElement.addEventListener('click', () => {
			showModal(action);
		});
		return addButtonElement;
	};

	return { executeAction, showModal, getAddButton };
})();
