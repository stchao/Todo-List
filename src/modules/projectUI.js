import { TodoListStorage } from './todoListStorage';
import { getClickableIconElement } from '..';
import { TodoUI } from './todoUI';
import { Action, UIActions } from './uiActions';
import editIcon from '../images/pencil.png';
import deleteIcon from '../images/delete.png';

export const ProjectUI = (() => {
	const _setActiveProject = (ev, projectUuid) => {
		let targetElement = ev.target;
		while (!targetElement.id && targetElement.tagName !== 'BUTTON') {
			targetElement = targetElement.parentElement;
		}

		if (
			ev.target.tagName === 'IMG' ||
			targetElement.parentElement?.id !== 'projectsContainer'
		) {
			return;
		}

		TodoListStorage.setActiveProject(projectUuid);
		const siblings = [...targetElement.parentElement.children];
		siblings.forEach((sibling) => sibling.classList.remove('active'));
		targetElement.classList.add('active');
		TodoUI.showTodoElements();
	};

	const _getSpan = (text, classes) => {
		const span = document.createElement('span');
		span.textContent = text;

		if (classes) {
			span.classList.add(
				...(Array.isArray(classes) ? classes : [classes])
			);
		}

		return span;
	};

	const _addRemoveAnimation = (element = null) => {
		if (!element) {
			return;
		}

		element.addEventListener('transitionend', (ev) => {
			element?.remove();
		});

		element.style.transition = 'height 0.3s linear';
		element.style.height = 0;
	};

	const _getAllProjectElements = (projects, activeProjectUuid) => {
		const projectsFragment = document.createDocumentFragment();

		for (const projectUuid in projects) {
			const projectElement = getProjectElement(
				projects[projectUuid],
				projectUuid === activeProjectUuid
			);
			projectsFragment.appendChild(projectElement);
		}

		return projectsFragment;
	};

	const getProjectElement = (project, isActive = false) => {
		const projectButtonElement = document.createElement('button');
		projectButtonElement.classList.add(
			'grid-center-center',
			'project-button',
			'font-bold',
			'button'
		);

		const title = _getSpan(project.title, ['project-title', 'button-text']);
		projectButtonElement.appendChild(title);

		const editProjectElement = getClickableIconElement(editIcon);
		editProjectElement.addEventListener('click', () => {
			UIActions.showModal(
				Action.UpdateProject,
				project.uuid,
				projectButtonElement
			);
		});

		const deleteProjectElement = getClickableIconElement(deleteIcon);
		deleteProjectElement.addEventListener('click', () => {
			TodoListStorage.removeProject(project.uuid);
			_addRemoveAnimation(projectButtonElement);
		});

		if (isActive) {
			projectButtonElement?.classList.add('active');
		}

		if (project.title !== 'Default') {
			projectButtonElement.appendChild(editProjectElement);
			projectButtonElement.appendChild(deleteProjectElement);
		}

		projectButtonElement.addEventListener('click', (ev) => {
			_setActiveProject(ev, project.uuid);
		});
		return projectButtonElement;
	};

	const updateProjectElement = (args, customObject = null) => {
		switch (args.action) {
			case Action.AddProject:
				const projectsContainer =
					document.querySelector('#projectsContainer');
				const addProject = getProjectElement(customObject);
				projectsContainer.appendChild(addProject);
			case Action.UpdateProject:
				if (args.button) {
					const title = args.button.querySelector('.project-title');
					title.textContent = customObject.title;
				}
			default:
				return;
		}
	};

	const showProjectElements = (projects = null, activeProjectUuid = '') => {
		if (!projects) {
			projects = TodoListStorage.get();
			activeProjectUuid = TodoListStorage.getActiveProject(true);
		}

		const projectsContainer = document.querySelector('#projectsContainer');
		const projectElements = _getAllProjectElements(
			projects,
			activeProjectUuid
		);
		projectsContainer.textContent = '';
		projectsContainer.appendChild(projectElements);
	};

	return { getProjectElement, updateProjectElement, showProjectElements };
})();
