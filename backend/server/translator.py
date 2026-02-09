from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

app = Flask(__name__)

model_name = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(model_name, local_files_only=True)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name, local_files_only=True)

# Myanmar -> English
my_to_en = pipeline("translation", model=model, tokenizer=tokenizer, src_lang="mya_Mymr", tgt_lang="eng_Latn")

# English -> Myanmar
en_to_my = pipeline("translation", model=model, tokenizer=tokenizer, src_lang="eng_Latn", tgt_lang="mya_Mymr")

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text", "")
    direction = data.get("direction", "my->en")  # "my->en" or "en->my"

    if direction == "my->en":
        translated = my_to_en(text, max_length=1024)[0]["translation_text"]
    else:
        translated = en_to_my(text, max_length=1024)[0]["translation_text"]

    return jsonify({"translation": translated})

if __name__ == "__main__":
    app.run(port=8000)
