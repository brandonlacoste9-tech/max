"""Task model — the unit of work flowing through FloGuru pipelines."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    WAITING_HUMAN = "waiting_human"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Task(BaseModel):
    """A discrete unit of work for a Guru to process."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    status: TaskStatus = TaskStatus.PENDING
    input_data: dict[str, Any] = Field(default_factory=dict)
    output_data: dict[str, Any] = Field(default_factory=dict)
    assigned_guru: str | None = None
    parent_task_id: str | None = None
    subtask_ids: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    priority: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: dict[str, Any] = Field(default_factory=dict)

    def mark_running(self, guru_id: str) -> None:
        self.status = TaskStatus.RUNNING
        self.assigned_guru = guru_id
        self.updated_at = datetime.now(timezone.utc)

    def mark_completed(self, output: dict[str, Any] | None = None) -> None:
        self.status = TaskStatus.COMPLETED
        if output:
            self.output_data = output
        self.updated_at = datetime.now(timezone.utc)

    def mark_failed(self, error: str) -> None:
        self.status = TaskStatus.FAILED
        self.output_data["error"] = error
        self.updated_at = datetime.now(timezone.utc)

    def request_human_input(self, prompt: str) -> None:
        self.status = TaskStatus.WAITING_HUMAN
        self.metadata["human_prompt"] = prompt
        self.updated_at = datetime.now(timezone.utc)
