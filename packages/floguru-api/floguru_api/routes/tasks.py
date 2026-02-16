"""Task submission and status endpoints."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from floguru_shared.task import Task

router = APIRouter()


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    input_data: dict[str, Any] = Field(default_factory=dict)
    tags: list[str] = Field(default_factory=list, max_length=20)
    priority: int = Field(default=0, ge=0, le=10)


@router.post("/tasks")
async def create_task(body: TaskCreate, request: Request) -> dict:
    """Submit a new task to the Guru router."""
    task = Task(
        title=body.title,
        description=body.description,
        input_data=body.input_data,
        tags=body.tags,
        priority=body.priority,
    )

    guru_router = request.app.state.guru_router
    result = await guru_router.route(task)

    return {
        "task_id": task.id,
        "status": task.status.value,
        "guru": result.guru_id,
        "output": result.output,
        "confidence": result.confidence,
        "tokens_used": result.tokens_used,
        "duration_ms": result.duration_ms,
        "error": result.error,
    }


@router.post("/tasks/batch")
async def create_batch(bodies: list[TaskCreate], request: Request) -> dict:
    """Submit multiple tasks at once."""
    guru_router = request.app.state.guru_router
    results = []
    for body in bodies:
        task = Task(
            title=body.title,
            description=body.description,
            input_data=body.input_data,
            tags=body.tags,
            priority=body.priority,
        )
        result = await guru_router.route(task)
        results.append({
            "task_id": task.id,
            "status": task.status.value,
            "success": result.success,
            "error": result.error,
        })
    return {"submitted": len(results), "results": results}
