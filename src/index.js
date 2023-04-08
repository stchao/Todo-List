import githubIcon from './images/github-logo.png';
import plusIcon from './images/plus.png';
import menuIconClosed from './images/menu.png';
import { Action, UIActions } from './modules/uiActions';
import { ProjectUI } from './modules/projectUI';
import { TodoUI } from './modules/todoUI';
import { showSieveElements } from './modules/sieveUI';

export const getClickableIconElement = (imgSrc, classes = ['icon']) => {
	const anchorElement = document.createElement('a');
	const imgIcon = document.createElement('img');
	imgIcon.src = imgSrc;
	imgIcon.classList.add(...(Array.isArray(classes) ? classes : [classes]));
	anchorElement.appendChild(imgIcon);
	return anchorElement;
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
		UIActions.showModal(action);
	});
	return addButtonElement;
};

const getMenuIcon = (imgSrc, classes = ['icon']) => {
	const menuIcon = getClickableIconElement(imgSrc, classes);
	menuIcon.addEventListener('click', UIActions.toggleSidebar);
	return menuIcon;
};

const getHeader = () => {
	const headingElement = document.createElement('h1');
	const headingText = document.createTextNode('Todo List');
	const menu = getMenuIcon(menuIconClosed);
	menu.id = 'menuIcon';
	menu.classList.add('menu-display');
	headingElement.append(headingText, menu);

	const headerElement = document.createElement('header');
	headerElement.appendChild(headingElement);
	return headerElement;
};

const getSidebar = () => {
	const imgIconElement = document.createElement('img');
	imgIconElement.src = plusIcon;
	imgIconElement.classList.add('icon');

	const projectTextElement = document.createTextNode('Project');
	const addProjectButtonElement = getAddButton(Action.AddProject);
	addProjectButtonElement.appendChild(imgIconElement);
	addProjectButtonElement.appendChild(projectTextElement);

	const todoTextElement = document.createTextNode('Todo');
	const addTodoButtonElement = getAddButton(Action.AddTodo);
	addTodoButtonElement.appendChild(imgIconElement.cloneNode(true));
	addTodoButtonElement.appendChild(todoTextElement);

	const addButtonsContainer = document.createElement('div');
	addButtonsContainer.classList.add('add-buttons-container');
	addButtonsContainer.appendChild(addProjectButtonElement);
	addButtonsContainer.appendChild(addTodoButtonElement);

	const projectLabelElement = document.createElement('label');
	projectLabelElement.innerText = 'Projects:';
	projectLabelElement.classList.add('font-large', 'font-bold');

	const projectElement = document.createElement('div');
	projectElement.id = 'projectsContainer';

	const sidebarElement = document.createElement('div');
	sidebarElement.id = 'sidebarContainer';
	sidebarElement.classList.add('sidebar-display');
	sidebarElement.appendChild(addButtonsContainer);
	sidebarElement.appendChild(projectLabelElement);
	sidebarElement.appendChild(projectElement);

	return sidebarElement;
};

const getMain = () => {
	const todoElements = document.createElement('div');
	todoElements.id = 'todosContainer';

	const sieveElements = document.createElement('div');
	sieveElements.id = 'sievesContainer';

	const mainElement = document.createElement('div');
	mainElement.id = 'mainContainer';
	mainElement.appendChild(sieveElements);
	mainElement.appendChild(todoElements);

	return mainElement;
};

const getContent = () => {
	const sidebarElement = getSidebar();
	const mainElement = getMain();

	const contentElement = document.createElement('div');
	contentElement.id = 'content';
	contentElement.appendChild(sidebarElement);
	contentElement.appendChild(mainElement);

	return contentElement;
};

const getFooter = () => {
	const paragraphElement = document.createElement('p');
	paragraphElement.innerText = '©2023 Todo List';

	const githubLinkElement = getClickableIconElement(githubIcon, [
		'icon',
		'flex-center-center',
	]);
	githubLinkElement.setAttribute(
		'href',
		'https://github.com/stchao/Todo-List'
	);
	githubLinkElement.setAttribute('target', '_blank');

	const footerElement = document.createElement('footer');
	footerElement.classList.add('flex-center-center');
	footerElement.appendChild(paragraphElement);
	footerElement.appendChild(githubLinkElement);

	return footerElement;
};

(function () {
	const bodyFragment = document.createDocumentFragment();
	const body = document.querySelector('body');
	const header = getHeader();
	const content = getContent();
	const footer = getFooter();

	bodyFragment.appendChild(header);
	bodyFragment.appendChild(content);
	bodyFragment.appendChild(footer);
	body.appendChild(bodyFragment);

	ProjectUI.showProjectElements();
	showSieveElements();
	TodoUI.showTodoElements();
})();
