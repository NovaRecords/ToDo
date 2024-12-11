// Todos im Local Storage speichern
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM Elemente
const todoInput = document.getElementById('todoInput');
const dueDateInput = document.getElementById('dueDateInput');
const todoList = document.getElementById('todoList');
const sortSelect = document.getElementById('sortSelect');

// Setze das Standarddatum auf morgen
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const offset = tomorrow.getTimezoneOffset();
tomorrow.setMinutes(tomorrow.getMinutes() - offset);
dueDateInput.value = tomorrow.toISOString().slice(0, 16);

// Todos laden
function loadTodos() {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    sortTodos(); // Sortiere die Todos beim Laden
    renderTodos();
}

// Event Listener für Enter-Taste
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Formatiere das Datum
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString('de-DE', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// Prüfe ob eine Aufgabe überfällig ist
function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

// Sortiere Todos
function sortTodos() {
    const sortBy = sortSelect.value;
    
    todos.sort((a, b) => {
        // Erledigte Aufgaben immer ans Ende
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        
        // Sortiere nach ausgewähltem Kriterium
        const dateA = new Date(a[sortBy]);
        const dateB = new Date(b[sortBy]);
        return dateA - dateB;
    });
    
    renderTodos();
}

// Neue Todo hinzufügen
function addTodo() {
    const todoText = todoInput.value.trim();
    const dueDate = dueDateInput.value;
    
    if (todoText === '' || dueDate === '') {
        return;
    }

    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        created: new Date().toISOString(),
        dueDate: new Date(dueDate).toISOString()
    };

    todos.push(todo);
    saveTodos();
    sortTodos();
    todoInput.value = '';
}

// Todo als erledigt markieren
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    sortTodos(); // Sortiere nach Statusänderung
}

// Todo bearbeiten
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('Aufgabe bearbeiten:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            
            // Aktuelles Datum und Zeit aus dem Todo extrahieren
            const currentDate = new Date(todo.dueDate);
            // Format DD.MM.YYYY
            const dateStr = currentDate.toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const timeStr = currentDate.toTimeString().slice(0, 5); // Format: HH:mm
            
            // Datum bearbeiten
            const newDate = prompt('Neues Fälligkeitsdatum (TT.MM.JJJJ):', dateStr);
            if (newDate !== null) {
                // Zeit bearbeiten
                const newTime = prompt('Neue Uhrzeit (HH:mm):', timeStr);
                if (newTime !== null) {
                    // Konvertiere deutsches Datum in ISO Format
                    const [day, month, year] = newDate.split('.');
                    // Kombiniere Datum und Zeit
                    const newDateTime = new Date(`${year}-${month}-${day}T${newTime}`);
                    if (!isNaN(newDateTime.getTime())) {
                        todo.dueDate = newDateTime.toISOString();
                        saveTodos();
                        renderTodos();
                    } else {
                        alert('Ungültiges Datum oder ungültige Uhrzeit!');
                    }
                }
            }
        }
    }
}

// Todo löschen
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Todos im Local Storage speichern
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Todos anzeigen
function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        const isTaskOverdue = isOverdue(todo.dueDate) && !todo.completed;
        li.className = `todo-item ${todo.completed ? 'completed' : ''} ${isTaskOverdue ? 'overdue' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                onchange="toggleTodo(${todo.id})">
            <div class="todo-content">
                <span class="todo-text">${todo.text}</span>
                <div class="todo-dates">
                    <span class="todo-date">Erstellt: ${formatDate(todo.created)}</span>
                    <span class="todo-date ${isTaskOverdue ? 'overdue' : ''}">Fällig: ${formatDate(todo.dueDate)}</span>
                </div>
            </div>
            <div class="button-group">
                <button class="edit-btn" onclick="editTodo(${todo.id})">Bearbeiten</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Löschen</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}

// Initial todos laden
loadTodos();
