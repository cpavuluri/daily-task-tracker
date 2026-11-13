from fastapi import FastAPI 

app = FastAPI(title="Daily Task Tracker")

@app.get("/")
def home():
    return{"message": "Welcome to Daily Task Tracker!"}

@app.get("/health")
def health_check():
    return{"status": "healthy"}
    