"""FastAPI application factory for FloGuru."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from floguru_shared.events import EventBus
from floguru_shared.guru_base import GuruConfig, GuruTier
from floguru_gurus.reasoner import ReasonerGuru
from floguru_gurus.coder import CoderGuru
from floguru_gurus.router import GuruRouter
from floguru_healing.healer import HyperHealer
from floguru_healing.memory import ExecutionMemory

from floguru_api.routes import tasks, gurus, health, webhooks, human_loop, max as max_routes, browser
from floguru_api.routes.webhooks import init_gateways
from floguru_api.middleware.rate_limit import RateLimitMiddleware


def create_app() -> FastAPI:
    """Build and return the fully wired FastAPI application."""

    event_bus = EventBus()
    memory = ExecutionMemory()
    healer = HyperHealer(memory=memory, event_bus=event_bus)

    guru_router = GuruRouter(event_bus=event_bus)
    guru_router.register(ReasonerGuru())
    guru_router.register(CoderGuru())

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        # Initialize chat gateways
        init_gateways()
        
        app.state.event_bus = event_bus
        app.state.guru_router = guru_router
        app.state.healer = healer
        app.state.memory = memory
        yield

    app = FastAPI(
        title="FloGuru API",
        description="AI-powered automation platform — Guru agents, browser automation, chat integrations",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RateLimitMiddleware, rpm=60, burst=10)

    app.include_router(health.router, prefix="/api", tags=["health"])
    app.include_router(tasks.router, prefix="/api", tags=["tasks"])
    app.include_router(gurus.router, prefix="/api", tags=["gurus"])
    app.include_router(webhooks.router, prefix="/api", tags=["webhooks"])
    app.include_router(human_loop.router, prefix="/api", tags=["human-in-the-loop"])
    app.include_router(max_routes.router, prefix="/api", tags=["ask-max"])
    app.include_router(browser.router, prefix="/api", tags=["browser"])

    return app
