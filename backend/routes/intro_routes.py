# from flask import Blueprint, jsonify, request
# from flask_cors import CORS
# import os
# import base64
# import pandas as pd
# from textblob import TextBlob

# # Create a Blueprint for intro and round1 routes
# intro_routes = Blueprint('intro_routes', __name__)
# CORS(intro_routes)  # Apply CORS to the intro_routes blueprint

# # Route to upload an image
# @intro_routes.route('/upload-image', methods=['POST'])
# def upload_image():
#     data = request.get_json()
#     name = data.get('name')
#     field = data.get('field')
#     image_data = data.get('image')

#     if not name or not field or not image_data:
#         return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

#     try:
#         # Decode the base64 image data
#         image_base64 = image_data.split(",")[1]
#         image_bytes = base64.b64decode(image_base64)

#         # Ensure the 'uploads' directory exists
#         if not os.path.exists("uploads"):
#             os.makedirs("uploads")

#         # Save the image with the user's name
#         file_path = f"uploads/{name}.jpg"
#         with open(file_path, "wb") as image_file:
#             image_file.write(image_bytes)

#         # Save user data to an Excel file
#         user_data = {'Name': [name], 'Field': [field], 'Image Path': [file_path]}
#         df = pd.DataFrame(user_data)

#         # Append data to Excel if it exists
#         if os.path.exists("userdata.xlsx"):
#             existing_df = pd.read_excel("userdata.xlsx")
#             df = pd.concat([existing_df, df], ignore_index=True)
        
#         df.to_excel("userdata.xlsx", index=False)

#         return jsonify({'status': 'success', 'message': 'Image saved and data saved to Excel'}), 200

#     except Exception as e:
#         print(f"Error saving image: {e}")
#         return jsonify({'status': 'error', 'message': 'Failed to save image'}), 500

# # Route to process speech transcription and perform sentiment analysis
# @intro_routes.route('/process-speech', methods=['POST'])
# def process_speech():
#     data = request.get_json()
#     transcription = data.get('transcription')
#     name = data.get('name')
#     field = data.get('field')

#     if not transcription:
#         return jsonify({'status': 'error', 'message': 'No transcription provided'}), 400

#     # Perform sentiment analysis
#     analysis = TextBlob(transcription)
#     polarity = analysis.sentiment.polarity
#     subjectivity = analysis.sentiment.subjectivity
#     confidence_level = "Confident" if polarity > 0.2 else "Neutral" if polarity == 0 else "Not Confident"
#     efficiency_level = "Efficient" if subjectivity < 0.5 else "Inefficient"

#     # Save analysis results to Excel
#     new_data = pd.DataFrame([{
#         "Name": name,
#         "Field": field,
#         "Transcription": transcription,
#         "Polarity": polarity,
#         "Subjectivity": subjectivity,
#         "Confidence Level": confidence_level,
#         "Efficiency Level": efficiency_level
#     }])


#     try:
#         if os.path.exists("userdata.xlsx"):
#             existing_df = pd.read_excel("userdata.xlsx")
#             final_df = pd.concat([existing_df, new_data], ignore_index=True)
#         else:
#             final_df = new_data

#         final_df.to_excel("userdata.xlsx", index=False)

#         return jsonify({
#             'status': 'success',
#             'message': 'Data saved successfully',
#             'analysis': {
#                 'polarity': polarity,
#                 'subjectivity': subjectivity,
#                 'confidence_level': confidence_level,
#                 'efficiency_level': efficiency_level
#             }
#         }), 200

#     except Exception as e:
#         return jsonify({'status': 'error', 'message': f'Failed to save data: {str(e)}'}), 500






from flask import Blueprint, jsonify, request, current_app
from flask_cors import CORS
import base64
from textblob import TextBlob
import datetime
from flask_cors import cross_origin
import logging
from pymongo import MongoClient
from bson import ObjectId


# Create a Blueprint for intro and round1 routes
intro_routes = Blueprint('intro_routes', __name__)
CORS(intro_routes)# Apply CORS to intro_routes with the correct origin


# Route to upload an image
@intro_routes.route('/upload-image', methods=['POST'])

def upload_image():
    data = request.get_json()
    name = data.get('name')
    field = data.get('field')
    image_data = data.get('image')  # Base64-encoded image

    if not name or not field or not image_data:
        return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

    try:
        # Connect to MongoDB
        db = current_app.config["db"]
        candidates_collection = db["candidates"]

        # Prepare candidate data
        candidate_data = {
            "name": name,
            "field": field,
            "image": image_data,  # Store the base64-encoded image directly
            "timestamp": datetime.datetime.utcnow(),
            "introduction": "",  # Placeholder for future intro data
            "aptitude_score": None,  # Placeholder for future scores
            "technical_score": None
        }

        # Insert candidate data into MongoDB
        result = candidates_collection.insert_one(candidate_data)

        # Return success response
        return jsonify({'status': 'success', 'message': 'Image and data saved to MongoDB', 'id': str(result.inserted_id)}), 200

    except Exception as e:
        print(f"Error saving data to MongoDB: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to save image'}), 500
    


@intro_routes.route('/process-speech', methods=['POST'])
@cross_origin()  # This is the correct way to apply CORS for specific routes


def process_speech():
    data = request.get_json()
    transcription = data.get('transcription')
    # name = data.get('name')
    # field = data.get('field')
    user_id = data.get('user_id')

    # Basic validation
    if not transcription or not user_id:
        logging.error("Missing data in request")
        return jsonify({'status': 'error', 'message': 'Invalid data provided'}), 400

    # # Perform sentiment analysis using TextBlob
    analysis = TextBlob(transcription)
    polarity = analysis.sentiment.polarity
    subjectivity = analysis.sentiment.subjectivity

    positive_keywords = [
        "passionate", "strong", "unique", "impactful", "drive", "professional", "focus", 
        "dedicated", "expert", "innovative", "proficient", "experienced", "skilled",
        "competent", "accomplished", "knowledgeable", "enthusiastic", "creative", 
        "motivated", "cutting-edge", "advanced", "effective", "efficient", "proactive", 
        "specialized", "data-driven", "analytical", "strategic", "insightful", 
        "solution-oriented", "results-focused", "dynamic", "adaptable", "versatile", 
        "reliable", "strong foundation", "technical expertise", "industry-leading", 
        "cross-functional", "collaborative", "highly skilled", "proven track record", 
        "successfully implemented", "optimized", "enhanced", "streamlined", 
        "automated", "scalable", "secure", "robust", "high-performance", 
        "machine learning", "artificial intelligence", "deep learning", "data visualization",
        "predictive modeling", "natural language processing", "cloud computing",
        "software engineering", "algorithm development", "problem-solving", 
        "statistical analysis", "big data", "neural networks", "computer vision",
        "technical acumen", "data science", "coding", "development", "research",
        "mastered", "tooling", "frameworks", "APIs", "data mining", "pattern recognition",
        "leader", "mentor", "team player", "influential", "key contributor", "change-maker",
        "visionary", "pioneer", "driven", "goal-oriented", "empowered", "self-starter",
        "ambitious", "entrepreneurial", "catalyst", "value-driven", "growth mindset",
        "initiator", "forward-thinking", "ownership", "responsible", "trusted", "guidance",
        "advisor", "consultant", "collaboration", "synergy", "communicator", "facilitator",
        "networking", "relationship building", "team-oriented", "partnership", "engagement",
        "coordinated", "liaison", "integration", "alignment", "consensus", 
        "interpersonal skills", "stakeholder management", "continuous learning", 
        "lifelong learner", "self-improvement", "adaptability", "learning agility", 
        "curiosity", "resilience", "upskilling", "growth-driven", "resourceful", 
        "dedicated learner", "curious", "enthusiastic learner", "versatility",
        "cross-disciplinary", "multidisciplinary", "multifaceted", "award-winning", 
        "recognized", "acknowledged", "commendable", "outstanding", "excellence", 
        "achieved", "earned", "highly rated", "acclaimed", "distinguished", "exemplary", 
        "noteworthy", "honored", "laureate", "accolades", "recipient", "notable", 
        "well-regarded", "prestigious", "first-class", "top-performing", "system architecture",
        "full stack", "DevOps", "SaaS", "infrastructure", "automation", "cybersecurity",
        "blockchain", "data integrity", "data governance", "project management", "agile", 
        "scrum", "continuous integration", "test-driven", "quality assurance", 
        "user experience", "UX", "UI", "product lifecycle", "market research", 
        "business intelligence", "competitive analysis", "financial modeling"
    ]

    # Calculate keyword density-based polarity boost
    keyword_matches = sum(1 for word in positive_keywords if word in transcription.lower())
    boost = min(0.07 * keyword_matches, 0.35)  # Slightly higher boost per keyword with an increased cap
    polarity += boost
    polarity = min(polarity, 1.0)  # Ensure polarity does not exceed 1.0

    # Adjusted Confidence Level Logic
    if polarity > 0.35:
        confidence_level = "Confident"
    elif polarity < 0:
        confidence_level = "Nervous"
    else:
        confidence_level = "Neutral"

    # Efficiency Level Logic with adjusted subjectivity threshold
    if subjectivity < 0.6 and (polarity > 0.3 or keyword_matches > 3):
        efficiency_level = "Efficient"
    else:
        efficiency_level = "Needs Improvement"




    # Prepare data for MongoDB
    db = current_app.config["db"]
    candidates_collection = db["candidates"]
    candidate_data = {
        "user_id": user_id,
        "introduction": transcription,
        "polarity": polarity,
        "subjectivity": subjectivity,
        "confidence_level": confidence_level,
        "efficiency_level": efficiency_level,
        "timestamp": datetime.datetime.utcnow()
    }

    try:
        # Update or insert data in MongoDB
        result = candidates_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": candidate_data},
            upsert=True  # Create document if not found
        )
        logging.info(f"Data saved successfully for user {user_id}")
        return jsonify({
            'status': 'success',
            'message': 'Transcription and analysis saved successfully'
        }), 200

    except Exception as e:
        logging.error(f"Error processing speech: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to save transcription'}), 500
    

