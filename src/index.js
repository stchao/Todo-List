import { Storage } from "./modules/storage";
import { createProjectElement, createTodosElements, getModals, toggleModal } from "./modules/updateUI";
import githubIcon from "./images/github-logo-white.png";
import plusIcon from "./images/plus-box.png";

const getHeader = () => {
    const headerElement = document.createElement('div');
    const headingElement = document.createElement('h1');
    headingElement.innerText = 'Todo List';
    headerElement.id = 'header';
    headerElement.appendChild(headingElement)
    return headerElement;
}

const getSidebar = () => {
    const sidebarElement = document.createElement('div');
    const addButtonElement = document.createElement('button');
    const buttonTextElement = document.createTextNode('Project')
    const imgIconElement = document.createElement('img');
    const projectElement = document.createElement('ul');
    const currentStorage = Storage.get();

    imgIconElement.src = plusIcon;
    imgIconElement.classList.add('icon');
    addButtonElement.id = 'addProjectButton'
    addButtonElement.addEventListener('click', () => { toggleModal('new-project'); });
    addButtonElement.appendChild(imgIconElement);
    addButtonElement.appendChild(buttonTextElement);

    for (const projectUuid in currentStorage) {
        const projectItemElement = createProjectElement(currentStorage[projectUuid]);        
        const todosElement = createTodosElements(currentStorage[projectUuid]);
        projectElement.appendChild(projectItemElement);
        projectElement.appendChild(todosElement);
    }    
    
    projectElement.id = 'projectList'
    sidebarElement.id = 'sidebarContainer';
    sidebarElement.appendChild(addButtonElement);
    sidebarElement.appendChild(projectElement);

    return sidebarElement;
}

const getMain = () => {
    const mainElement = document.createElement('div');
    const addButtonElement = document.createElement('button');
    const buttonTextElement = document.createTextNode('Todo')
    const imgIconElement = document.createElement('img');

    imgIconElement.src = plusIcon;
    imgIconElement.classList.add('icon');

    addButtonElement.id = 'addTodoButton'
    addButtonElement.addEventListener('click', () => { toggleModal('new-todo'); });
    addButtonElement.appendChild(imgIconElement);
    addButtonElement.appendChild(buttonTextElement)
    mainElement.id = 'mainContainer';
    
    mainElement.appendChild(addButtonElement);

    return mainElement;
}

const getContent = () => {
    const contentElement = document.createElement('div');
    const sidebarElement = getSidebar();
    const mainElement = getMain();

    contentElement.id = 'content';
    contentElement.appendChild(sidebarElement);
    contentElement.appendChild(mainElement);

    return contentElement;
}

const getFooter = () => {
    const footerElement = document.createElement('div');
    const linkElement = document.createElement('a');
    const imageElement = document.createElement('img')
    const paragraphElement = document.createElement('p');

    linkElement.classList.add('icon');
    linkElement.setAttribute('href', 'https://github.com/stchao/Todo-List');
    linkElement.setAttribute('target', '_blank');
    imageElement.classList.add('icon');
    imageElement.setAttribute('src', githubIcon);
    paragraphElement.innerText = '©2023 Todo List';

    linkElement.appendChild(imageElement);
    footerElement.id = 'footer'
    footerElement.appendChild(paragraphElement);
    footerElement.appendChild(linkElement);

    return footerElement;  
}

const getModal = () => {
    const modalElement = document.createElement('div');
    const formElement = document.createElement('form');
    const modalElements = getModals();    
    
    formElement.appendChild(modalElements);

    modalElement.id = 'modal';
    modalElement.classList.add('modal');
    modalElement.classList.add('d-none');
    modalElement.appendChild(formElement);

    return modalElement;
}

(function() {
    const bodyFragment = document.createDocumentFragment();
    const body = document.querySelector('body');        
    const header = getHeader();
    const content = getContent();
    const footer = getFooter();
    const modal = getModal();

    bodyFragment.appendChild(header);
    bodyFragment.appendChild(content);
    bodyFragment.appendChild(footer);
    bodyFragment.appendChild(modal);
    body.appendChild(bodyFragment);
})();

