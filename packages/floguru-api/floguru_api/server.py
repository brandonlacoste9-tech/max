"""Entry point — run with: python -m floguru_api.server"""

import uvicorn
from floguru_api.app import create_app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "floguru_api.server:app",
        host="0.0.0.0",
        port=8420,
        reload=True,
    )
