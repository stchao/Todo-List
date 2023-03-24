import { UI } from "./modules/updateUI";
import githubIcon from "./images/github-logo-white.png";
import plusIcon from "./images/plus-box.png";

const getHeader = () => {
    const headingElement = document.createElement('h1');
    headingElement.innerText = 'Todo List';

    const headerElement = document.createElement('div');
    headerElement.id = 'header';
    headerElement.appendChild(headingElement)
    return headerElement;
}

const getSidebar = () => {   
    const imgIconElement = document.createElement('img');
    imgIconElement.src = plusIcon;
    imgIconElement.classList.add('icon');

    const projectTextElement = document.createTextNode('Project');
    const addProjectButtonElement = UI.getAddButtonElement('new-project');
    addProjectButtonElement.appendChild(imgIconElement);
    addProjectButtonElement.appendChild(projectTextElement);

    const todoTextElement = document.createTextNode('Todo');
    const addTodoButtonElement = UI.getAddButtonElement('new-todo');
    addTodoButtonElement.appendChild(imgIconElement.cloneNode(true));
    addTodoButtonElement.appendChild(todoTextElement);  

    const addButtonsContainer = document.createElement('div');
    addButtonsContainer.classList.add('add-buttons-container');
    addButtonsContainer.appendChild(addProjectButtonElement);
    addButtonsContainer.appendChild(addTodoButtonElement);

    const projectLabelElement = document.createElement('label');
    projectLabelElement.innerText = 'Projects:';
    projectLabelElement.classList.add('project-font');

    const projectElement = document.createElement('div');
    projectElement.id = 'projectList';

    const sidebarElement = document.createElement('div');
    sidebarElement.id = 'sidebarContainer';
    sidebarElement.appendChild(addButtonsContainer);
    sidebarElement.appendChild(projectLabelElement);
    sidebarElement.appendChild(projectElement);

    return sidebarElement;
}

const getMain = () => {  
    const todoElements = document.createElement('div');
    todoElements.id = 'todosContainer';

    const mainElement = document.createElement('div');
    mainElement.id = 'mainContainer';
    mainElement.appendChild(todoElements);

    return mainElement;
}

const getContent = () => {
    const sidebarElement = getSidebar();
    const mainElement = getMain();

    const contentElement = document.createElement('div');
    contentElement.id = 'content';
    contentElement.appendChild(sidebarElement);
    contentElement.appendChild(mainElement);

    return contentElement;
}

const getFooter = () => {   
    const imageElement = document.createElement('img');
    imageElement.classList.add('icon');
    imageElement.setAttribute('src', githubIcon);

    const paragraphElement = document.createElement('p');
    paragraphElement.innerText = '©2023 Todo List';

    const linkElement = document.createElement('a');
    linkElement.classList.add('icon');
    linkElement.setAttribute('href', 'https://github.com/stchao/Todo-List');
    linkElement.setAttribute('target', '_blank');
    linkElement.appendChild(imageElement);

    const footerElement = document.createElement('div');
    footerElement.id = 'footer'
    footerElement.appendChild(paragraphElement);
    footerElement.appendChild(linkElement);

    return footerElement;  
}

(function() {
    const bodyFragment = document.createDocumentFragment();
    const body = document.querySelector('body');        
    const header = getHeader();
    const content = getContent();
    const footer = getFooter();

    bodyFragment.appendChild(header);
    bodyFragment.appendChild(content);
    bodyFragment.appendChild(footer);
    body.appendChild(bodyFragment);

    UI.setProjectUI();
    UI.setTodoUI();
})();

