import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('todo.db')
    cursor = conn.cursor()
    
    # Erstelle die Tabelle für ToDo-Aufgaben
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            due_date DATE,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def add_task(title, description=None, due_date=None):
    conn = sqlite3.connect('todo.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO tasks (title, description, due_date)
        VALUES (?, ?, ?)
    ''', (title, description, due_date))
    
    conn.commit()
    conn.close()

def get_all_tasks():
    conn = sqlite3.connect('todo.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM tasks ORDER BY created_at DESC')
    tasks = cursor.fetchall()
    
    conn.close()
    return tasks

def mark_task_complete(task_id):
    conn = sqlite3.connect('todo.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE tasks 
        SET status = 'completed', completed_at = ? 
        WHERE id = ?
    ''', (datetime.now(), task_id))
    
    conn.commit()
    conn.close()

def delete_task(task_id):
    conn = sqlite3.connect('todo.db')
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
