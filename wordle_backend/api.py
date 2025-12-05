from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from data.words import WORDS
from random import randrange
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/word")
def get_word():
    random_index = randrange(0, len(WORDS))

    return {"word": WORDS[random_index]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)