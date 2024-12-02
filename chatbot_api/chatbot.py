from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model and tokenizer
model_name = "trippyboi1/pet-adoption-chatbot-Meta3-1b"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    if not data or 'prompt' not in data:
        return jsonify({"error": "Invalid request: 'prompt' is required"}), 400

    prompt = data.get("prompt")
    print(f"Received prompt: {prompt}")

    system_instruction = "Act as an assistant for a pet adoption website. Answer concisely and professionally. Don't provide any links or url"
    formatted_prompt = f"{system_instruction}\nUser: {prompt}\nAssistant:"

    inputs = tokenizer(
        formatted_prompt,
        return_tensors="pt",
        padding=True,
        truncation=True
    ).to(device)

    outputs = model.generate(
        inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        max_length=100,
        temperature=0.7,
        top_p=0.8,
        do_sample=True,
        repetition_penalty=2.0,
        pad_token_id=tokenizer.pad_token_id or tokenizer.eos_token_id
    )

    raw_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    assistant_response = raw_response.split("Assistant:")[-1].strip()

    print(f"Generated response: {assistant_response}")
    return jsonify({"response": assistant_response})

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)
