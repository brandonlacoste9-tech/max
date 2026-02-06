"""Execution memory — persistent store of past Guru runs for learning."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field


class ExecutionRecord(BaseModel):
    """A single execution record stored for HyperHealing analysis."""

    task_id: str
    guru_name: str
    tier: str
    input_summary: str = ""
    output_summary: str = ""
    success: bool = True
    confidence: float = 0.0
    tokens_used: int = 0
    duration_ms: float = 0.0
    error: str | None = None
    tags: list[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: dict[str, Any] = Field(default_factory=dict)


class ExecutionMemory:
    """Append-only log of execution records, backed by a JSON-lines file.

    This is intentionally simple — a production system would use a proper
    database or vector store.  The file-based approach keeps FloGuru
    dependency-light and easy to inspect/debug.
    """

    def __init__(self, path: str | Path = ".floguru/memory.jsonl") -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._records: list[ExecutionRecord] = []
        self._load()

    def _load(self) -> None:
        if self.path.exists():
            for line in self.path.read_text().strip().splitlines():
                if line.strip():
                    self._records.append(ExecutionRecord.model_validate_json(line))

    def append(self, record: ExecutionRecord) -> None:
        """Persist a new execution record."""
        self._records.append(record)
        with self.path.open("a") as f:
            f.write(record.model_dump_json() + "\n")

    def query(
        self,
        guru_name: str | None = None,
        success: bool | None = None,
        tags: list[str] | None = None,
        limit: int = 50,
    ) -> list[ExecutionRecord]:
        """Query execution history with optional filters."""
        results = list(self._records)
        if guru_name is not None:
            results = [r for r in results if r.guru_name == guru_name]
        if success is not None:
            results = [r for r in results if r.success == success]
        if tags:
            tag_set = set(tags)
            results = [r for r in results if tag_set.issubset(set(r.tags))]
        return results[-limit:]

    def success_rate(self, guru_name: str | None = None) -> float:
        """Calculate overall or per-guru success rate."""
        records = self.query(guru_name=guru_name, limit=10_000)
        if not records:
            return 0.0
        return sum(1 for r in records if r.success) / len(records)

    @property
    def total_records(self) -> int:
        return len(self._records)
