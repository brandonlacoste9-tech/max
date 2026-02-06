"""Human-in-the-loop endpoints for task approval workflows.

When a task requires human oversight, it enters a WAITING_HUMAN state.
These endpoints let operators review, approve, or reject pending tasks.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()

# In-memory approval queue (production would use a persistent store)
_approval_queue: dict[str, dict[str, Any]] = {}


class ApprovalRequest(BaseModel):
    """A task waiting for human review."""
    task_id: str
    title: str
    description: str = ""
    guru_name: str = ""
    proposed_action: str = ""
    risk_level: str = "low"  # low | medium | high
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ApprovalDecision(BaseModel):
    """Human operator's decision on a pending task."""
    approved: bool
    reason: str = ""
    modified_action: str | None = None


@router.post("/approval-queue")
async def submit_for_approval(request: ApprovalRequest) -> dict:
    """Add a task to the human approval queue."""
    entry_id = str(uuid.uuid4())
    _approval_queue[entry_id] = {
        "id": entry_id,
        "status": "pending",
        **request.model_dump(mode="json"),
    }
    return {"id": entry_id, "status": "pending", "position": len(_approval_queue)}


@router.get("/approval-queue")
async def list_pending() -> dict:
    """List all tasks awaiting human approval."""
    pending = [v for v in _approval_queue.values() if v["status"] == "pending"]
    return {"pending": pending, "total": len(pending)}


@router.get("/approval-queue/{entry_id}")
async def get_entry(entry_id: str) -> dict:
    """Get details of a specific approval entry."""
    entry = _approval_queue.get(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.post("/approval-queue/{entry_id}/decide")
async def decide(entry_id: str, decision: ApprovalDecision) -> dict:
    """Approve or reject a pending task."""
    entry = _approval_queue.get(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    if entry["status"] != "pending":
        raise HTTPException(status_code=409, detail=f"Entry already {entry['status']}")

    entry["status"] = "approved" if decision.approved else "rejected"
    entry["decision_reason"] = decision.reason
    entry["decided_at"] = datetime.now(timezone.utc).isoformat()
    if decision.modified_action:
        entry["proposed_action"] = decision.modified_action

    return {
        "id": entry_id,
        "status": entry["status"],
        "decision_reason": decision.reason,
    }
