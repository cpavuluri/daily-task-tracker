from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models import Task, TaskCreate

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=Task, status_code=201)
def create_task(task: TaskCreate):
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO tasks (title) VALUES (?)",
            (task.title.strip(),),
        )
        task_id = cursor.lastrowid

        row = connection.execute(
            "SELECT * FROM tasks WHERE id =?",
            (task_id,),
        ).fetchone()

    return Task(**dict(row))


@router.get("/", response_model=list[Task])
def get_tasks():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM tasks ORDER BY id"
        ).fetchall()

    return[
        Task(
            id=row["id"],
            title=row["title"],
            completed=bool(row["completed"])
        )
        for row in rows 
    ]


@router.patch("/{task_id}", response_model=Task)
def complete_task(task_id: int):
    with get_connection() as connection:
        cursor = connection.execute(
            "UPDATE tasks SET completed = 1 WHERE id = ?",
            (task_id,),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")

        row = connection.execute(
            "SELECT * FROM tasks WHERE id = ?",
            (task_id,),
        ).fetchone()

    return Task(
        id=row["id"],
        title=row["title"],
        completed=bool(row["completed"]),
    )

@router.delete("/{task_id}")
def delete_task(task_id: int):
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM tasks WHERE id = ?",
            (task_id,),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")

    return{"message": "Task deleted successfully"}
