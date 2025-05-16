from transformers import pipeline

# Replace with your Hugging Face username and model repo name
model_name = "raees456/QA_Generation_Model22"

# Your Hugging Face API token, required if the model repo is private
hf_token = "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"

# Create a text-generation pipeline that uses the remote model via API
generator = pipeline(
    "text-generation",
    model=model_name,
    tokenizer=model_name,
    # use_auth_token=True  # only here
)

# Input prompt for the model
prompt = "generate 2 questions on Machine Learni"

# Generate output
outputs = generator(prompt, max_length=200, num_return_sequences=1,truncation=True)

# Print the generated text
print(outputs[0]['generated_text'])
