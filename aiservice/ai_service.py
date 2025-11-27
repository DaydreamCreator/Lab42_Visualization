from openai import OpenAI
import pymongo
import datetime
import hashlib
import json
import os
# === MongoDB Setup ===


# === OpenAI Key ===
myopenai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
#myopenai = OpenAI()

# === AI Analysis Function ===
def analyze_data(data, feature_name="temperature", language="en", model="gpt-4.1-mini"):

    # TODO: modify prompt to be more specific
    prompt = f"""
I will give you a short sequence of {feature_name} readings. Please analyze the trend and provide a brief human-friendly summary.

Data: {data}

Instructions: Describe the overall trend.

"""
#2. Mention any peaks or anomalies.
#3. Provide a concise evaluation.

    response = myopenai.responses.create(
        model=model,
        instructions="You are a helpful assistant skilled in interpreting short sequences of numerical data.",
        input=prompt
    )

    result = response.output_text
    print(response)
    return result

# === Main Function with Caching ===
def get_analysis(attribute, category, data, floor=0, date="", roomid=0, cluster=-1, language="en", model="gpt-4.1-mini"):
    client = pymongo.MongoClient("mongodb://mongodb:27017/")
    db = client["room_data_lab42"]
    collection = db["analysisCache"]
    collection.create_index([("attribute", 1),("category", 1)])

    if category == 0:    # data
        cached = collection.find_one({"category": category, "attribute": attribute, "floor": floor, "roomid": roomid, "date": date})
    else:    # pattern
        cached = collection.find_one({"category": category, "attribute": attribute, "floor": floor, "cluster": cluster})
    
    if cached:
        print("✅ Using cached result.")
        client.close()
        return cached["ai_result"]
    else:
        print("🧠 Calling OpenAI API...")
        result = analyze_data(data, attribute, language, model)
        if category == 0:    # data
            doc = {
                "category": category,
                "attribute": attribute,
                "floor": floor,
                "roomid": roomid,
                "cluster": cluster,
                "date": date,
                "ai_result": result,
                "created_at": datetime.datetime.utcnow(),
                "model_used": model,
                "language": language
            }
        else:    # pattern
            doc = {
                "category": category,
                "attribute": attribute,
                "floor": floor,
                "cluster": cluster,
                "roomid": roomid,
                "date": date,
                "ai_result": result,
                "created_at": datetime.datetime.utcnow(),
                "model_used": model,
                "language": language
            }

        collection.insert_one(doc)
        client.close()
        return result
    
def clear_cache():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["room_data_lab42"]
    collection = db["analysisCache"]

    collection.drop()
    print("✅ Cache cleared.")
    client.close()

# === Run Example ===
if __name__ == "__main__":
    clear_cache()
    """
    seq = [22, 24, 27, 30, 29, 28, 25]
    feature_name = "temperature"
    roomid = 29
    floor = 1
    model = "GPT-4.1 nano"
    date = "2024-05-18"
    summary = get_analysis(seq, date, roomid, floor, feature_name, model)
    print(summary)
    """