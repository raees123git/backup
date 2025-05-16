# SkillEdge-API/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from peft import PeftModel, PeftConfig
from huggingface_hub import login
from dotenv import load_dotenv

# Load env vars
load_dotenv()

hf_token = os.getenv("HF_TOKEN")
login(hf_token)

app = FastAPI()

# CORS Configuration
enabled_origins = os.getenv("FRONTEND_URL", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=enabled_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment: model adapter ID
ADAPTER_MODEL_ID = os.getenv("MODEL_PATH", "raees456/QA_Generation_Model22")

# Load PEFT configuration
peft_config = PeftConfig.from_pretrained(ADAPTER_MODEL_ID)

# Load base model
base_model = AutoModelForCausalLM.from_pretrained(
    peft_config.base_model_name_or_path,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto"
)

# Apply LoRA adapter
model = PeftModel.from_pretrained(base_model, ADAPTER_MODEL_ID)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(peft_config.base_model_name_or_path)

# Text generation pipeline
device = 0 if torch.cuda.is_available() else -1
text_generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    # device=device
)

# Request schemas
class QuestionRequest(BaseModel):
    type: str
    role: str

class EvaluationRequest(BaseModel):
    question: str
    answer: str
    role: str

@app.post("/api/interview/generate-question")
async def generate_question(request: QuestionRequest):
    if not request.type or not request.role:
        raise HTTPException(status_code=400, detail="Missing type or role")
    
    prompt_map = {
        "technical": f"You are an interviewer. Ask a challenging technical question for a {request.role}.",
        "behavioral": "You are an interviewer. Ask a behavioral question about teamwork.",
        "resume": "You are an interviewer. Ask a resume-based question."
    }
    prompt = prompt_map.get(request.type, "You are an interviewer. Ask a question.")

    try:
        outputs = text_generator(
            prompt,
            max_new_tokens=50,
            do_sample=True,
            temperature=0.7,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id,
            num_return_sequences=1
        )
        generated = outputs[0]["generated_text"]
        question_text = generated[len(prompt):].strip() or generated.strip()
        return {"question": question_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

@app.post("/api/interview/evaluate-answer")
async def evaluate_answer(request: EvaluationRequest):
    try:
        return {
            "feedback": "Good answer! Here are some areas for improvement...",
            "score": 85,
            "analysis": {"grammar": 90, "relevance": 80, "technical_accuracy": 85}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
