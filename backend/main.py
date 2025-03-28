from fastapi import FastAPI
from supabase import create_client
from backend.config.settings import SUPABASE_URL, SUPABASE_KEY
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi import FastAPI, WebSocket



app = FastAPI()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def home():
    return {"message": "Backend is running securely!"}

@app.get("/get-supabase-data")
def get_data():
    response = supabase.table("Users").select("*").execute()
    return response

@app.get("/get-supabase-credentials")
def get_supabase_credentials():
    return {
        "supabase_url": SUPABASE_URL,
        "supabase_key": SUPABASE_KEY
    }


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    #allow_origins=["*"],  # ⚠️ Puedes especificar ["http://127.0.0.1:5500"] por seguridad
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    return {"filename": file.filename}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("WebSocket connection established!")
    await websocket.close()
    
@app.get("/supabase-keys")
async def get_supabase_keys():
    return {"SUPABASE_URL": SUPABASE_URL, "SUPABASE_KEY": SUPABASE_KEY}


#uvicorn backend.main:app --reload
