import uniqueId from 'lodash/uniqueId';


// BEGIN

const app = () => {
  const initialState = () => {
    const lists = [{ id: uniqueId(), name: 'General', tasks: [] }];
    return {
      lists,
      currentListId: lists[0].id
    };
  };

  const state = initialState();

  const selectors = {
    listsContainer: () => document.querySelector('[data-container="lists"]'),
    tasksContainer: () => document.querySelector('[data-container="tasks"]'),
    listForm: () => document.querySelector('[data-container="new-list-form"]'),
    taskForm: () => document.querySelector('[data-container="new-task-form"]')
  };

  const createElement = (tag, attributes = {}) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value;
    });
    return element;
  };

  const getCurrentList = () => 
    state.lists.find(list => list.id === state.currentListId);

  const isListNameValid = (name) =>
    name.trim() !== '' && 
    !state.lists.some(list => list.name === name.trim());

  const isTaskNameValid = (name) => 
    name.trim() !== '';

  const renderListLink = (list) => {
    const listItem = createElement('li');
    
    if (state.currentListId === list.id) {
      const bold = createElement('b', { textContent: list.name });
      listItem.appendChild(bold);
    } else {
      const link = createElement('a', {
        href: `#${list.name}`,
        textContent: list.name
      });
      listItem.appendChild(link);
    }
    
    return listItem;
  };

  const renderLists = () => {
    const container = selectors.listsContainer();
    container.innerHTML = '';
    const listUl = createElement('ul');

    state.lists.forEach(list => {
      const listItem = renderListLink(list);
      listUl.appendChild(listItem);
    });

    container.appendChild(listUl);
  };

  const renderTasks = () => {
    const container = selectors.tasksContainer();
    container.innerHTML = '';
    const currentList = getCurrentList();

    if (currentList.tasks.length > 0) {
      const taskUl = createElement('ul');
      currentList.tasks.forEach(task => {
        const taskItem = createElement('li', { textContent: task });
        taskUl.appendChild(taskItem);
      });
      container.appendChild(taskUl);
    }
  };

  const handleListClick = (e) => {
    e.preventDefault();
    const target = e.target.closest('a');
    if (!target) return;

    const listName = target.textContent;
    const list = state.lists.find(list => list.name === listName);
    
    if (list) {
      state.currentListId = list.id;
      render();
    }
  };

  const handleListSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const listName = formData.get('name').trim();

    if (!isListNameValid(listName)) {
      e.target.reset();
      return;
    }

    state.lists.push({
      id: uniqueId(),
      name: listName,
      tasks: []
    });

    render();
    e.target.reset();
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskName = formData.get('name').trim();
    const currentList = getCurrentList();

    if (!isTaskNameValid(taskName)) {
      e.target.reset();
      return;
    }

    currentList.tasks.push(taskName);
    render();
    e.target.reset();
  };

  const render = () => {
    renderLists();
    renderTasks();
  };

  const initEventListeners = () => {
    selectors.listsContainer().addEventListener('click', handleListClick);
    selectors.listForm().addEventListener('submit', handleListSubmit);
    selectors.taskForm().addEventListener('submit', handleTaskSubmit);
  };

  const init = () => {
    initEventListeners();
    render();
  };

  init();
};

export default app;
// END