import { updateProjectUI, updateTodoUI, getAddButtonElement } from "./modules/updateUI";
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

    const buttonTextElement = document.createTextNode('Project');
    const addButtonElement = getAddButtonElement('new-project');
    addButtonElement.id = 'addProjectButton'
    addButtonElement.appendChild(imgIconElement);
    addButtonElement.appendChild(buttonTextElement);

    const projectElement = document.createElement('ul');
    projectElement.id = 'projectList'

    const sidebarElement = document.createElement('div');
    sidebarElement.id = 'sidebarContainer';
    sidebarElement.appendChild(addButtonElement);
    sidebarElement.appendChild(projectElement);

    return sidebarElement;
}

const getMain = () => {
    const imgIconElement = document.createElement('img');
    imgIconElement.src = plusIcon;
    imgIconElement.classList.add('icon');

    const buttonTextElement = document.createTextNode('Todo');
    const addButtonElement = getAddButtonElement('new-todo');
    addButtonElement.id = 'addTodoButton'
    addButtonElement.appendChild(imgIconElement);
    addButtonElement.appendChild(buttonTextElement);    

    const todoElements = document.createElement('div');
    todoElements.id = 'todosContainer';

    const mainElement = document.createElement('div');
    mainElement.id = 'mainContainer';    
    mainElement.appendChild(addButtonElement);
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

    updateProjectUI();
    updateTodoUI();
})();

