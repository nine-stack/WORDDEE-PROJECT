from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# อนุญาตให้ Frontend เข้าถึงได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SentenceSubmission(BaseModel):
    word: str
    sentence: str

# แก้ไขบรรทัดนี้ใน backend/main.py

WORDS_DB = [
    "resilient", 
    "ephemeral", 
    "serendipity", 
    "oblivious", 
    "meticulous", 
    "innovation",
    "nostalgia",
    "euphoria",
    "pragmatic",
    "ambiguous",
    "ubiquitous",
    "eloquent",
    "impeccable",
    "paradox",
    "solitude",
    "ethereal"
]

@app.get("/api/word")
async def get_random_word():
    word = random.choice(WORDS_DB)
    return {"word": word}

@app.post("/api/validate-sentence")
async def validate_sentence(submission: SentenceSubmission):
    word = submission.word.lower()
    sentence = submission.sentence.lower()
    
    # 1. กฎข้อแรก: ต้องมีคำศัพท์นั้นอยู่ในประโยค
    if word not in sentence:
        return {
            "score": 0,
            "level": "Beginner",
            "suggestion": f"Don't forget to use the word '{submission.word}' in your sentence!",
            "corrected_sentence": f"I want to use the word {submission.word} correctly."
        }

    # 2. คำนวณคะแนนจากความยาวประโยค (ยิ่งยาวยิ่งดี สูงสุด 9.5)
    length_score = min(9.5, len(sentence.split()) * 1.5)
    
    # ปรับคะแนนให้ดูสมจริงขึ้น (สุ่มบวกลบนิดหน่อย)
    final_score = round(length_score + random.uniform(-0.5, 0.5), 1)
    if final_score > 10: final_score = 10.0

    # 3. ประเมินระดับ (Level)
    level = "Beginner"
    if final_score > 5: level = "Intermediate"
    if final_score > 8: level = "Advanced"

    return {
        "score": final_score,
        "level": level,
        "suggestion": "Good job! Try adding more adjectives to describe the situation.",
        "corrected_sentence": submission.sentence.capitalize() + "."
    }

@app.get("/api/summary")
async def get_summary():
    return [
        {"day": "Mon", "score": random.randint(5, 9)},
        {"day": "Tue", "score": random.randint(6, 10)},
        {"day": "Wed", "score": random.randint(5, 8)},
        {"day": "Thu", "score": random.randint(7, 10)},
        {"day": "Fri", "score": random.randint(8, 10)},
    ]