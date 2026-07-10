from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat_api import router as chat_router
from app.api.upload import router as upload_router
from app.api.document_api import router as document_router
from app.api import conversation_api
from app.api.admin_api import router as admin_router
from app.api.analytics_api import router as analytics_router

app = FastAPI(
    title="Multi-Domain Chatbot API",
    version="1.0.0",
    description="API for a multi-domain chatbot that answers questions based on uploaded documents."
)

@app.on_event("startup")
def startup_event():
    from app.database.mysql import init_db
    init_db()




app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(
    chat_router,
    prefix="/api/v1",
    tags=["Chat"]
)

app.include_router(
    upload_router,
    prefix="/api/v1",
    tags=["Upload"]
)

app.include_router(
    document_router,
    prefix="/api/v1",
    tags=["Documents"]
)

app.include_router(

    conversation_api.router,

    prefix="/api/v1",

    tags=["Conversations"]

)

app.include_router(
    admin_router,
    prefix="/api/v1",
)

@app.get("/")
def root():
    return{
        "message": "Chatbot is running."
    }

app.include_router(
    analytics_router,
    prefix="/api/v1/analytics",
    tags=["Analytics"]
)
