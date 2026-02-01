"""
🏛️ MAXIMUS SOVEREIGN - V-JEPA 2 VISION SERVICE
The "Eyes" of Max - Convert screenshots to latent representations

Based on: facebookresearch/vjepa2
Model: vit_giant (1B parameters)
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import torch
from PIL import Image
import io
import logging
import sys

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("c:/Users/north/max/logs/vjepa_service.log"),
    ],
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="V-JEPA 2 Vision Service",
    description="Maximus Sovereign Eyes - Screenshot to Latent Space",
    version="1.0.0",
)


class VJEPAService:
    """V-JEPA 2 Vision Service - The Eyes of Maximus"""

    def __init__(self):
        self.model = None
        self.processor = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_loaded = False

        logger.info(f"🏛️ Initializing V-JEPA 2 Service")
        logger.info(f"   Device: {self.device}")

    def load_model(self):
        """Load V-JEPA 2 Giant model via PyTorch Hub"""
        try:
            logger.info("📥 Loading V-JEPA 2 Giant (1B) from PyTorch Hub...")
            logger.info("   This may take a few minutes on first run...")

            # Load preprocessor
            self.processor = torch.hub.load(
                "facebookresearch/vjepa2", "vjepa2_preprocessor", trust_repo=True
            )
            logger.info("✅ Preprocessor loaded")

            # Load model (Giant - 1B parameters)
            self.model = torch.hub.load(
                "facebookresearch/vjepa2", "vjepa2_vit_giant", trust_repo=True
            )
            logger.info("✅ Model loaded")

            # Move to device
            self.model = self.model.to(self.device)
            self.model.eval()  # Set to evaluation mode

            logger.info(f"✅ V-JEPA 2 Giant ready on {self.device}")
            logger.info(f"   Parameters: ~1B")
            logger.info(f"   Resolution: 256x256")

            self.model_loaded = True

        except Exception as e:
            logger.error(f"❌ Failed to load V-JEPA 2 model: {e}")
            logger.error(f"   Falling back to dummy mode (for testing)")
            self.model_loaded = False
            raise

    def encode_image(self, image: Image.Image):
        """
        Convert image to latent representation

        Args:
            image: PIL Image

        Returns:
            embedding: Latent vector (numpy array)
        """
        if not self.model_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        try:
            # Preprocess image
            # V-JEPA expects video input, so we'll create a single-frame "video"
            # Convert PIL to tensor
            image_tensor = self.processor(image).unsqueeze(0)  # Add batch dimension
            image_tensor = image_tensor.to(self.device)

            # Get embedding
            with torch.no_grad():
                embedding = self.model(image_tensor)

            # Convert to numpy and flatten
            embedding_np = embedding.cpu().numpy().flatten()

            logger.info(
                f"✅ Encoded image to {len(embedding_np)}-dimensional latent space"
            )

            return embedding_np

        except Exception as e:
            logger.error(f"❌ Failed to encode image: {e}")
            raise


# Global service instance
vjepa = VJEPAService()


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    logger.info("═" * 60)
    logger.info("🏛️ V-JEPA 2 VISION SERVICE STARTING")
    logger.info("═" * 60)

    try:
        vjepa.load_model()
        logger.info("✅ Service ready to accept requests")
    except Exception as e:
        logger.error(f"⚠️  WARNING: Service started but model failed to load")
        logger.error(f"   Error: {e}")
        logger.error(f"   Service will return errors until model is loaded")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "V-JEPA 2 Vision Service",
        "status": "online" if vjepa.model_loaded else "model_not_loaded",
        "model": "vit_giant (1B)",
        "device": vjepa.device,
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ok" if vjepa.model_loaded else "degraded",
        "model": "vit_giant_xformers_rope",
        "device": vjepa.device,
        "model_loaded": vjepa.model_loaded,
    }


@app.post("/encode")
async def encode_visual(file: UploadFile = File(...)):
    """
    Encode image to latent representation

    Args:
        file: Uploaded image file

    Returns:
        JSON with embedding vector
    """
    if not vjepa.model_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Service is starting up or failed to load.",
        )

    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")

        logger.info(f"📸 Encoding image: {image.size} ({image.mode})")

        # Encode
        embedding = vjepa.encode_image(image)

        return {
            "embedding": embedding.tolist(),
            "dimensions": len(embedding),
            "image_size": list(image.size),
            "model": "vit_giant",
        }

    except Exception as e:
        logger.error(f"❌ Encoding failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stats")
async def stats():
    """Get service statistics"""
    if torch.cuda.is_available():
        gpu_memory = torch.cuda.memory_allocated() / 1024**3  # GB
        gpu_memory_total = torch.cuda.get_device_properties(0).total_memory / 1024**3
        gpu_utilization = (gpu_memory / gpu_memory_total) * 100
    else:
        gpu_memory = 0
        gpu_memory_total = 0
        gpu_utilization = 0

    return {
        "model_loaded": vjepa.model_loaded,
        "device": vjepa.device,
        "gpu_memory_used_gb": round(gpu_memory, 2),
        "gpu_memory_total_gb": round(gpu_memory_total, 2),
        "gpu_utilization_percent": round(gpu_utilization, 2),
    }


if __name__ == "__main__":
    import uvicorn

    logger.info("═" * 60)
    logger.info("🏛️ STARTING V-JEPA 2 VISION SERVICE")
    logger.info("═" * 60)
    logger.info("")
    logger.info("   Service will be available at:")
    logger.info("   http://localhost:8001")
    logger.info("")
    logger.info("   Endpoints:")
    logger.info("   GET  /         - Service info")
    logger.info("   GET  /health   - Health check")
    logger.info("   POST /encode   - Encode image")
    logger.info("   GET  /stats    - GPU statistics")
    logger.info("")
    logger.info("═" * 60)

    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
