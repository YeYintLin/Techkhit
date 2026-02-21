import os
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

app = Flask(__name__)

MODEL_NAME = os.getenv("NLLB_MODEL_NAME", "facebook/nllb-200-distilled-600M")
MODEL_CACHE_DIR = os.getenv(
    "NLLB_CACHE_DIR",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), ".model_cache"),
)

my_to_en = None
en_to_my = None
INIT_ERROR = None


def load_model_bundle():
    local_kwargs = {"cache_dir": MODEL_CACHE_DIR, "local_files_only": True}
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, **local_kwargs)
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, **local_kwargs)
        app.logger.info("Loaded translation model from local cache: %s", MODEL_CACHE_DIR)
        return tokenizer, model
    except Exception as local_error:
        app.logger.warning(
            "Local model not available (%s). Downloading from official Hugging Face repo: %s",
            local_error,
            MODEL_NAME,
        )

    remote_kwargs = {"cache_dir": MODEL_CACHE_DIR, "local_files_only": False}
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, **remote_kwargs)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, **remote_kwargs)
    app.logger.info("Model downloaded and cached at: %s", MODEL_CACHE_DIR)
    return tokenizer, model


try:
    tokenizer, model = load_model_bundle()

    # Myanmar -> English
    my_to_en = pipeline(
        "translation",
        model=model,
        tokenizer=tokenizer,
        src_lang="mya_Mymr",
        tgt_lang="eng_Latn",
    )

    # English -> Myanmar
    en_to_my = pipeline(
        "translation",
        model=model,
        tokenizer=tokenizer,
        src_lang="eng_Latn",
        tgt_lang="mya_Mymr",
    )
except Exception as e:
    INIT_ERROR = str(e)
    app.logger.exception("Translator initialization failed")


@app.route("/translate", methods=["POST"])
def translate():
    if INIT_ERROR:
        return (
            jsonify(
                {
                    "error": "Translator is not ready",
                    "details": INIT_ERROR,
                }
            ),
            503,
        )

    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    direction = data.get("direction", "my->en")  # "my->en" or "en->my"

    if not text:
        return jsonify({"error": "Missing text"}), 400

    if direction not in ("my->en", "en->my"):
        return jsonify({"error": "Invalid direction. Use 'my->en' or 'en->my'"}), 400

    if direction == "my->en":
        translated = my_to_en(text, max_length=1024)[0]["translation_text"]
    else:
        translated = en_to_my(text, max_length=1024)[0]["translation_text"]

    return jsonify({"translation": translated})


@app.route("/health", methods=["GET"])
def health():
    if INIT_ERROR:
        return jsonify({"status": "error", "details": INIT_ERROR}), 503
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
