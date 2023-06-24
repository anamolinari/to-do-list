//Código para adicionar data atual no cabeçalho da página
const currentDate = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = currentDate.toLocaleDateString('en-US', options);
document.getElementById('current-date').textContent = formattedDate;

//Criando constantes para o código
const addButton = document.querySelector('.add__button');
const todoList = document.querySelector('.todo__list');
const todoText = document.querySelector('.todo__text');
const catImage = document.querySelector('.cat__image');
const text = document.querySelector('.text');

//Criando uma nova tarefa + checkbox
addButton.addEventListener('click', function() {  
  const newTodo = document.createElement('div');
  newTodo.classList.add('todo__item');

  //Criando o checkbox
  const checkbox = document.createElement('input');  
  checkbox.type = 'checkbox';
  checkbox.classList.add('todo__checkbox');

  //Mudando o status do checkbox se ele for marcado ou não
  checkbox.addEventListener('change', function() { 
    const parentListItem = this.parentNode;
    const completedList = document.querySelector('.completed__list');

    if (this.checked) {
      showCompletedItems();
      todoList.removeChild(parentListItem);
      completedList.appendChild(parentListItem);
    } else {
      todoList.appendChild(parentListItem);
      completedList.removeChild(parentListItem);
    }
    
    //Adicionando o item de volta  à lista de tarefas pendentes quando for desmarcado
    if (!this.checked) { 
      const pendingList = document.querySelector('.todo__list');
      parentListItem.classList.remove('completed__item'); 
      pendingList.appendChild(parentListItem); 

      //Removendo a data de conclusão quando o item é desmarcado
      const todoText = parentListItem.querySelector('.todo__text'); 
      const completionDate = parentListItem.querySelector('.completion-date');
      if (completionDate) {
        const originalText = todoText.textContent.replace(completionDate.textContent, '');
        todoText.textContent = originalText;
      }
    }

    const completedItems = document.querySelectorAll('.completed__item'); //Verificando se todas as tarefas concluídas foram desmarcadas

    const hideCompletedItems = document.querySelector('.hide-completed-items');
      if (completedItems.length === 0 && hideCompletedItems) {
        hideCompletedItems.parentNode.removeChild(hideCompletedItems); //Removendo o botão 'hide-completed-items'
      }
  });

  //Adicionando uma data de conclusão se o checkbox receber o evento clique
  checkbox.addEventListener('click', function() { 
    const item = this.parentElement;
    const todoText = item.querySelector('.todo__text');
    const completionDate = item.querySelector('.completion-date');

    if (this.checked) {
      const currentDate = new Date().toLocaleDateString();
      const todoTextContent = todoText.textContent;
      const parts = todoTextContent.split(' - ');
      const completedText = `<span class="completion-date" contentEditable="false">${currentDate}</span>${parts.length === 2 ? parts[1] : todoTextContent}`;
      todoText.innerHTML = completedText;
    } else {
      const originalText = todoText.textContent.replace(completionDate.textContent, '');
      todoText.textContent = originalText;
    }

    //Impedindo a edição da data de conclusão
    if (completionDate) {
      completionDate.contentEditable = false;
    }
  });

  //Criando o campo de texto
  const todoText = document.createElement('span'); 
  todoText.contentEditable = true;
  todoText.classList.add('todo__text')
  todoText.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addButton.click(); //Adicionando uma nova tarefa quando a tecla 'Enter' é pressionada
      e.preventDefault(); //Bloquendo a quebra de linha com a tecla 'Enter'
    } else {
      handleBackspace(e, newTodo); //Usando o backspace para apagar uma nova tarefa
    }
  })

  //Adicionando a nova tarefa + o checkbox e o campo de texto na nova tarefa
  todoList.appendChild(newTodo);
  newTodo.appendChild(checkbox);
  newTodo.appendChild(todoText);

  //Ocultando a imagem do gato + texto
  catImage.style.display = 'none';
  text.style.display = 'none';

  //Adicionando o cursor no campo de texto
  todoText.focus();
})

//Função para fazer o backspace funcionar e apagar as 'novas tarefas'
function handleBackspace(event, newTodo) { 
  if (event.key === 'Backspace' && newTodo.querySelector('.todo__text').textContent === '') {
    event.preventDefault();
    const prevTodo = newTodo.previousElementSibling;
    if (prevTodo) {
      const prevTodoText = prevTodo.querySelector('.todo__text');
      prevTodoText.focus();
      const range = document.createRange();
      range.selectNodeContents(prevTodoText);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      todoList.removeChild(newTodo);
    } else {
      const firstCheckbox = document.querySelector('.todo__checkbox');
      firstCheckbox.parentNode.removeChild(firstCheckbox);
      todoList.innerHTML = '';
      catImage.style.display = 'block';
      text.style.display = 'block';
    } 
  }
}

//Função para verificar se tem alguma tarefa (pendente ou concluida) na tela
function checkTasksCompleted() { 
  const todoItems = document.querySelectorAll('.todo__item');
  const completedItems = document.querySelectorAll('.completed__item');

  if (todoItems.length === 0 && completedItems.length === 0) {
    catImage.style.display = 'block';
    text.style.display = 'block';
  }
}

//Função para criar uma lista de tarefas concluídas
function showCompletedItems() { 
  const completedList = document.querySelector('.completed__list');
  const completedItems = document.querySelectorAll('.todo__item .todo__checkbox:checked');

  completedItems.forEach(function(item) {
    const listItem = item.parentNode;
    listItem.classList.add('completed__item');
  });

  // Verificar se a lista de tarefas concluídas contém itens
  if (completedItems.length > 0) {
    // Mostrar o botão "Hide completed items"
    if (!completedList.previousElementSibling.classList.contains('hide-completed-items')) {
      const hideCompletedItems = document.createElement('div');
      hideCompletedItems.classList.add('hide-completed-items');
      hideCompletedItems.textContent = 'Hide completed items';
      completedList.parentNode.insertBefore(hideCompletedItems, completedList);

      hideCompletedItems.addEventListener('click', function() {
        const completedItems = document.querySelectorAll('.completed__item');
        
        completedItems.forEach(function(item) {
          if (item.parentNode === completedList) {
            if (item.style.display !== 'none') {
              item.style.display = 'none';
            } else {
              item.style.display = '';
            }
          }
        });

        if (hideCompletedItems.textContent === 'Hide completed items') {
          hideCompletedItems.textContent = 'Show completed items';
        } else {
          hideCompletedItems.textContent = 'Hide completed items';
        }

        checkTasksCompleted();
      });
    }
  } else {
    // Remover o botão "Hide Completed Items" se não houver itens concluídos
    const hideCompletedItems = document.querySelector('.hide-completed-items');
    if (hideCompletedItems) {
      hideCompletedItems.parentNode.removeChild(hideCompletedItems);
    }
  }

  // Verificar se há tarefas concluídas ao carregar a página
  document.addEventListener('DOMContentLoaded', function() {
    showCompletedItems();
  });

  // Verificar se há tarefas concluídas ao marcar ou desmarcar uma tarefa
  document.addEventListener('change', function() {
    showCompletedItems();
  });
}



