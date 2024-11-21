
from fpdf import FPDF
from flask import send_file
from flask import Flask, jsonify, request, current_app
from flask_cors import CORS
import google.generativeai as genai
import json
import re
import time
import os
import ast
import re
from pymongo import ReturnDocument
import random
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, send_file
from fpdf import FPDF
from bson import ObjectId
from bson import ObjectId
from flask import jsonify, request, current_app
from bson import ObjectId
from flask import jsonify, request, current_app
from fpdf import FPDF
import base64
from io import BytesIO
from PIL import Image


quiz_routes = Blueprint('quiz_routes', __name__)
CORS(quiz_routes)
 
# Configure Gemini API
genai.configure(api_key='AIzaSyBrkOEG3pQXeqijFYC0Tu0Pidi-4sI-XhA')
model = genai.GenerativeModel('gemini-pro')

# Question cache with timestamps
question_cache = {
    'aptitude': {
        'questions': None,
        'last_updated': None
    },
    'technical': {
        'questions': None,
        'last_updated': None
    },
    'coding': {  # Add coding round entry
        'questions': None,
        'last_updated': None
    }
}


def clean_json_string(s):
    """Clean and extract JSON string from Gemini's response."""
    try:
        match = re.search(r'\[(.*)\]', s, re.DOTALL)
        if match:
            json_str = f"[{match.group(1)}]"
            json_str = re.sub(r'```json|```', '', json_str)
            return json_str.strip()
    except Exception as e:
        print(f"Error cleaning JSON string: {str(e)}")
    return None

def validate_questions(questions):
    """Validate that questions are in the correct format and have exactly 5 questions."""
    try:
        if not isinstance(questions, list) or len(questions) != 5:
            return False
        for q in questions:
            if not all(key in q for key in ['question', 'options', 'answer']) or \
               not isinstance(q['options'], list) or len(q['options']) != 4 or \
               q['answer'] not in q['options']:
                return False
        return True
    except Exception as e:
        print(f"Error validating questions: {str(e)}")
        return False
    

def validate_coding_questions(questions):
    """Validate coding questions to ensure they are in the correct format."""
    try:
        if not isinstance(questions, list) or len(questions) != 5:
            return False
        for q in questions:
            if 'question' not in q:
                return False
        return True
    except Exception as e:
        print(f"Error validating coding questions: {str(e)}")
        return False


def generate_questions(question_type, question_domain):
    """Generate questions using Gemini API with improved prompting."""

    topic_focus = {
        'aptitude': '''
        Focus on:
        - Numerical reasoning (arithmetic, percentages, ratios)
        - Logical deduction and patterns
        - Problem-solving scenarios
        - Time and work problems
        - Spatial reasoning
        ''',
        'technical': f'''
        Focus on {question_domain} field for genrating the questions. At least half questions based on field. OR
        Focus on (if field is null):
        - Programming fundamentals and syntax
        - Data structures and algorithms
        - Web development (HTML, CSS, JavaScript)
        - Database concepts (SQL, NoSQL)
        - Software design principles
        - API and REST concepts
        '''
    }


    prompt = f"""Generate exactly 5 unique multiple-choice questions for {question_type} assessment.

    Requirements:
    - Diverse topics within {question_type}
    - Exactly 4 options per question, 1 correct answer
    - Moderate to challenging difficulty
    - Test practical knowledge
    - Return ONLY JSON array
    
    {topic_focus[question_type]}
    
    JSON format:
    [
        {{
            "question": "Question text here?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "answer": "Option 2"
        }}
    ]
    Return ONLY the JSON array."""

    try:
        response = model.generate_content(prompt)
        
        if response and response.text:
            json_str = clean_json_string(response.text)
            
            if json_str:
                questions = json.loads(json_str)
                
                if validate_questions(questions):
                    return questions
        print(f"Invalid response format for {question_type}")
        return None
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        return None

def generate_coding_questions():
    """Generate coding questions using Gemini API."""
    prompt = """
    Generate exactly 5 unique coding questions for assessment.

    Requirements:
    - Each question should include a problem description.
    - The response should be in JSON format, structured as follows:

    Example for JSON format:
    [
        {
            "question": "Write a function to reverse a string.",
        }
    ]
    Give ONLY the JSON array as response.
    """

    try:
        response = model.generate_content(prompt)
        
        if response and response.text:
            json_str = clean_json_string(response.text)
            if json_str:
                questions = json.loads(json_str)
                if validate_coding_questions(questions):
                    return questions
        print("Invalid response format for coding questions")
        return None
    except Exception as e:
        print(f"Error generating coding questions: {str(e)}")
        return None


def evaluate_coding_question(question, answer):
    """Evaluate code using Gemini API."""
    
    # If the user says "I don't know", assign a score of 0
    if answer.strip().lower() == "i don't know":
        return {"score": 0}
    
    prompt = f"""
    You are a coding evaluation model. Your task is to evaluate the correctness and quality of a provided coding answer against a specific question. Analyze the solution for correctness, efficiency, readability, and adherence to best practices. Provide a JSON response with the following keys:  
    - `score` (an integer between 0 and 100 representing overall performance)  
    - `feedback` (a string with detailed feedback on the code)  
    - `categories` (an object with scores for specific criteria: correctness, efficiency, readability, and adherence to best practices)
    

Here’s the input:  
**Question:**  
```
{question}
```

**Answer:**  
```  
{answer}
```

Analyze the answer, ensuring it is a valid program in a programming language, it should not be theoritically explaied, Pseudo code or algorithm be given a 0 score, and provide a JSON response. 

### Example Input:
**Question:**  
```
Write a function in Python to check if a number is prime.
```

**Answer:**  
```python
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True
```

### Expected Output:
```json
{{
  "score": 85,
  "feedback": "The solution is mostly correct but can be optimized. The loop runs up to 'n', which is inefficient. It should run only up to the square root of 'n'. The code is clear and adheres to good practices.",
  "categories": {{
    "correctness": 90,
    "efficiency": 70,
    "readability": 95,
    "adherence_to_best_practices": 85
  }}
}}
```  
    """
    
    print(prompt)

    try:
        # Send the prompt to Gemini model
        response = model.generate_content(prompt)
        print(f"Raw Response: {response.text}")  # Log the raw response
        
        # Clean response by removing backticks or other non-JSON characters
        clean_response = response.text.strip('`')  # Removes backticks around JSON
        
        # Try to extract the JSON score from the response manually
        start = clean_response.find('{')
        end = clean_response.rfind('}')
        
        if start != -1 and end != -1:
            try:
                # Extract and parse the JSON portion
                json_response = clean_response[start:end+1]
                coding_response = json.loads(json_response)  # Convert the response to a Python dictionary
                if 'score' in coding_response:
                    return coding_response  # Return the parsed response containing the score
                else:
                    print("Score not found in the response.")
                    return None
            except json.JSONDecodeError:
                print("Failed to parse JSON response")
                return None
        else:
            print("No valid JSON found in the response.")
            return None
        
    except Exception as e:
        print(f"Error evaluating coding questions: {str(e)}")
        return None

def should_regenerate_questions(question_type):
    """Determine if questions should be regenerated based on time and randomness."""
    cache_entry = question_cache[question_type]
    if cache_entry['questions'] is None or cache_entry['last_updated'] is None:
        return True
    time_threshold = datetime.now() - timedelta(hours=1)
    if cache_entry['last_updated'] < time_threshold:
        return True
    return random.random() < 0.3


def get_or_generate_questions(question_type, question_domain):
    """Get questions from cache or generate new ones with rotation mechanism."""
    if should_regenerate_questions(question_type):
        new_questions = generate_questions(question_type, question_domain)
        if validate_questions(new_questions):
            question_cache[question_type]['questions'] = new_questions
            question_cache[question_type]['last_updated'] = datetime.now()

            # Log each question and correct answer immediately after generation
            print("\nGenerated Questions and Answers:")
            for idx, question in enumerate(new_questions):
                print(f"Question {idx + 1}: {question['question']}")
                print(f"Correct Answer: {question['answer']}\n")

            return new_questions
        else:
            print("Generated questions failed validation.")
            return None  # Return None if validation fails
    else:
        # Log the cached questions and correct answers if they are being reused
        print("\nUsing Cached Questions and Answers:")
        for idx, question in enumerate(question_cache[question_type]['questions']):
            print(f"Question {idx + 1}: {question['question']}")
            print(f"Correct Answer: {question['answer']}\n")

    return question_cache[question_type]['questions']


# API route to retrieve questions
@quiz_routes.route('/api/aptitude', methods=['GET'])
def get_aptitude_questions():
    questions = get_or_generate_questions('aptitude', 'null')
    if questions:
        return jsonify(questions)
    return jsonify({"error": "Error generating questions"}), 500



@quiz_routes.route('/api/technical', methods=['GET'])
def get_technical_questions():
    try:
        # Get the user_id from query params
        userid = request.args.get("user_id")
        
        # Ensure that the user_id is converted to ObjectId for MongoDB query
        user_object_id = ObjectId(userid)
        
        # Access the database
        db = current_app.config["db"]
        candidates_collection = db["candidates"]
        
        # Query the document by ObjectId with projection for 'field'
        result = candidates_collection.find_one({"_id": user_object_id}, {"field": 1})
        
        # Check if result exists and field is available
        if result:
            # Get the domain field, default to 'computer science' if field is not present
            domain = result.get("field", "computer science")
            
            # Call the function to get or generate technical questions based on the domain
            questions = get_or_generate_questions('technical', question_domain=domain)
            
            # If questions are fetched, return them
            if questions:
                return jsonify(questions)
        else:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
    
    except Exception as e:
        # Handle any errors that occur
        return jsonify({'status': 'error', 'message': 'Failed to get user from id'}), 500


@quiz_routes.route('/api/coding', methods=['GET'])
def get_coding_questions():
    if should_regenerate_questions('coding'):
        new_questions = generate_coding_questions()

        
        if new_questions:
            question_cache['coding']['questions'] = new_questions
            question_cache['coding']['last_updated'] = datetime.now()
    
    questions = question_cache['coding']['questions']
    
    if questions:

        print(questions)
        return jsonify(questions)
    return jsonify({"error": "Error generating coding questions"}), 500





@quiz_routes.route('/api/submit/aptitude', methods=['POST'])
def submit_aptitude_answers():
    try:
        data = request.json  # Receiving answers as JSON
        print("Received aptitude answers:", data.get("answers"))  # Debug log

        answers = data.get("answers")
        user_id= data.get("user_id")

        # Retrieve the current questions
        questions = question_cache['aptitude']['questions'] or []
        if not questions:
            print("Error: No aptitude questions found in cache.")
            return jsonify({"error": "No questions available for scoring"}), 500

        correct_answers = 0
        total_questions = len(questions)

        # Evaluate each answer
        for idx, question in enumerate(questions):
            question_text = question["question"]
            correct_answer = question["answer"]
            user_answer = answers.get(str(idx))  # Ensure we get the answer as a string key

            # Log the question, correct answer, and user answer for each question
            print(f"\nQuestion {idx + 1}: {question_text}")
            print(f"Expected Answer = '{correct_answer}', User Answer = '{user_answer}', Correct = {user_answer == correct_answer}")

            if user_answer == correct_answer:
                correct_answers += 1

        score_percentage = (correct_answers / total_questions) * 100
        pass_criteria = 70  # Define pass percentage

        # Log the final score
        print(f"\nTotal Correct Answers: {correct_answers}/{total_questions}")
        print(f"Score Percentage: {score_percentage}")

        db = current_app.config["db"]
        candidates_collection = db["candidates"]
        candidate_data = {
            "aptitude_score":score_percentage
        }

        try:
        # Update or insert data in MongoDB
            result = candidates_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": candidate_data},
                upsert=True  # Create document if not found
            
            )        
            return jsonify({
                "score": score_percentage,
                "passed": score_percentage >= pass_criteria,
                "correct_answers": correct_answers,
                "total_questions": total_questions
            })        

        except Exception as e:
            return jsonify({'status': 'error', 'message': 'Failed to save transcription'}), 500





    except Exception as e:
        print(f"Error in submit_aptitude_answers: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@quiz_routes.route('/api/submit/technical', methods=['POST'])
def submit_technical_answers():
    try:
        data = request.json  # Receiving answers as JSON
        print("Received technical answers:", data)  # Debug log


        answers = data.get("answers")
        user_id= data.get("user_id")

        # Retrieve the current technical questions
        questions = question_cache['technical']['questions'] or []
        if not questions:
            print("Error: No technical questions found in cache.")
            return jsonify({"error": "No questions available for scoring"}), 500

        correct_answers = 0
        total_questions = len(questions)

        # Evaluate each answer
        for idx, question in enumerate(questions):
            question_text = question["question"]
            correct_answer = question["answer"]
            user_answer = answers.get(str(idx))  # Ensure we get the answer as a string key

            # Log the question, correct answer, and user answer for each question
            print(f"\nQuestion {idx + 1}: {question_text}")
            print(f"Expected Answer = '{correct_answer}', User Answer = '{user_answer}', Correct = {user_answer == correct_answer}")

            if user_answer == correct_answer:
                correct_answers += 1

        score_percentage = (correct_answers / total_questions) * 100
        pass_criteria = 80  # Define pass percentage for technical round

        # Log the final score
        print(f"\nTotal Correct Answers: {correct_answers}/{total_questions}")
        print(f"Score Percentage: {score_percentage}")



        db = current_app.config["db"]
        candidates_collection = db["candidates"]
        candidate_data = {
            "technical_score":score_percentage
        }

        try:
        # Update or insert data in MongoDB
            result = candidates_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": candidate_data},
                upsert=True  # Create document if not found
            
            )        
            return jsonify({
                "score": score_percentage,
                "passed": score_percentage >= pass_criteria,
                "correct_answers": correct_answers,
                "total_questions": total_questions
            })        

        except Exception as e:
            return jsonify({'status': 'error', 'message': 'Failed to save transcription'}), 500


    except Exception as e:
        print(f"Error in submit_technical_answers: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



# @quiz_routes.route('/api/submit/coding', methods=['POST'])
# def submit_coding_answers():
#     try:
#         # Receive answers as JSON
#         data = request.json
#         print("Received coding answers:", data)  # Debug log

#         if not data.get('questions') or not data.get('answers'):
#             return jsonify({"error": "Questions and answers are required"}), 400

#         totalScore = 0
#         # Loop through questions and answers
#         for i, question in enumerate(data['questions']):
#             answer = data['answers'][i]  # Get the corresponding answer
#             evaluation = evaluate_coding_question(question, answer)  # Get evaluation from Gemini
            
#             # If evaluation exists and contains score, add it to the total
#             if evaluation and 'score' in evaluation:
#                 totalScore += evaluation['score']

#         # Ensure total score does not exceed 50
#         totalScore = min(totalScore, 50)

#         # Get the user ID from the request
#         user_id = data.get('user_id')
#         if not user_id:
#             return jsonify({"error": "user_id is required"}), 400

#         # Convert user_id to ObjectId if necessary (ensure correct format)
#         try:
#             user_id = ObjectId(user_id)  # Convert to ObjectId
#         except Exception as e:
#             return jsonify({"error": "Invalid user_id format"}), 400

#         # Get MongoDB connection
#         db = current_app.config["db"]
#         candidates_collection = db["candidates"]

#         # Update the document with the total score in MongoDB
#         result = candidates_collection.update_one(
#             {"_id": user_id},  # Match by ObjectId
#             {"$set": {"coding_score": totalScore}}  # Set the coding_score field
#         )

#         if result.modified_count > 0:
#             return jsonify({"message": "Score updated successfully", "total_score": totalScore}), 200
#         else:
#             return jsonify({"error": "Failed to update score, document not found"}), 500

#     except Exception as e:
#         print(f"Error in submit_coding_answers: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500


# @quiz_routes.route('/api/generate_report', methods=['POST'])
# def generate_report():
#     try:
#         # Retrieve the data and user_id from the request
#         data = request.json
#         print(f"Received data for report generation: {data}")  # Log request data
#         results = data.get("results", [])
#         user_id = data.get("user_id")

#         # Ensure the user_id is present
#         if not user_id:
#             return jsonify({"error": "User ID is required"}), 400
        
#         # Fetch the user's data from MongoDB using user_id
#         db = current_app.config["db"]
#         candidates_collection = db["candidates"]
#         user_data = candidates_collection.find_one({"_id": ObjectId(user_id)})
        
#         if not user_data:
#             return jsonify({"error": "User not found"}), 404
        
#         # Initialize PDF
#         pdf = FPDF()
#         pdf.add_page()
#         pdf.set_font("Arial", "B", 16)

#         # Add a title
#         pdf.cell(200, 10, "Coding Round Assessment Report", 0, 1, "C")

#         pdf.set_font("Arial", "", 12)
#         pdf.ln(10)

#         # Add user details from MongoDB
#         pdf.cell(200, 10, f"Name: {user_data.get('name', 'N/A')}", 0, 1)
#         pdf.cell(200, 10, f"Field: {user_data.get('field', 'N/A')}", 0, 1)
#         pdf.cell(200, 10, f"Introduction: {user_data.get('introduction', 'N/A')}", 0, 1)
#         pdf.cell(200, 10, f"Aptitude Score: {user_data.get('aptitude_score', 'N/A')}", 0, 1)
#         pdf.cell(200, 10, f"Technical Score: {user_data.get('technical_score', 'N/A')}", 0, 1)
#         pdf.cell(200, 10, f"Coding Score: {user_data.get('coding_score', 'N/A')}", 0, 1)
#         pdf.cell(200, 10, f"Confidence Level: {user_data.get('confidence_level', 'N/A')}", 0, 1)
#         pdf.cell(200, 10, f"Efficiency Level: {user_data.get('efficiency_level', 'N/A')}", 0, 1)

#         pdf.ln(10)

#         # Dynamically generate the file path
#         pdf_file_path = f"/Users/ij/Desktop/PYTHON/capstone/reports/{user_id}_coding_round_report.pdf"
#         pdf.output(pdf_file_path)

#         return jsonify({"message": "Report generated successfully", "file_path": pdf_file_path}), 200

#     except Exception as e:
#         print(f"Error generating PDF report: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500
    

# @quiz_routes.route('/api/download_report', methods=['GET'])
# def download_report():
    try:
        # Retrieve the file path from the query parameters or session (or adjust according to your logic)
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required to fetch the report."}), 400
        
        # Dynamically set the PDF file path
        pdf_file_path = f"/Users/ij/Desktop/PYTHON/capstone/reports/{user_id}_coding_round_report.pdf"
        
        # Ensure the file exists before attempting to send it
        if not os.path.exists(pdf_file_path):
            return jsonify({"error": "File not found"}), 404
        
        # Return the file as an attachment, allowing the user to download it
        return send_file(pdf_file_path, as_attachment=True, download_name="coding_round_report.pdf")

    except Exception as e:
        print(f"Error downloading PDF: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



# @quiz_routes.route('/api/generate_report', methods=['POST'])
# def generate_report():
    try:
        data = request.json  # Expecting a JSON with results and other details
        results = data.get("results", [])

        # Initialize PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)

        # Add a title
        pdf.cell(200, 10, "Coding Round Assessment Report", 0, 1, "C")

        pdf.set_font("Arial", "", 12)
        pdf.ln(10)

        # Add each question result to the PDF
        for i, result in enumerate(results):
            question_text = result.get("question", {}).get("text", "No question text available")
            code_submitted = result.get("code", "No code submitted")
            score = result.get("score", "No score available")
            feedback = result.get("feedback", {})

            pdf.cell(200, 10, f"Question {i + 1}: {question_text}", 0, 1)
            pdf.cell(200, 10, f"Code Submitted: {code_submitted}", 0, 1)
            pdf.cell(200, 10, f"Score: {score}/10", 0, 1)
            pdf.cell(200, 10, "Feedback Summary:", 0, 1)

            # Check if feedback is available and properly structured
            details = feedback.get("details", [])
            if details:
                for detail in details:
                    pdf.cell(200, 10, f"  - {detail.get('feedback', 'No feedback provided')}", 0, 1)
                    if "details" in detail:
                        for issue in detail["details"]:
                            pdf.cell(200, 10, f"     {issue}", 0, 1)
            else:
                pdf.cell(200, 10, "  No detailed feedback available", 0, 1)

            # Add Efficiency and Code Quality feedback if available
            if 'efficiency_feedback' in feedback:
                pdf.cell(200, 10, f"Efficiency Feedback: {feedback['efficiency_feedback']}", 0, 1)
            if 'quality_feedback' in feedback:
                pdf.cell(200, 10, f"Code Quality Feedback: {feedback['quality_feedback']}", 0, 1)

            pdf.ln(10)

        # Define the path where the PDF will be saved
        pdf_file_path = "/Users/ij/Desktop/PYTHON/capstone/coding_round_report.pdf"
        pdf.output(pdf_file_path)

        return jsonify({"message": "Report generated successfully", "file_path": pdf_file_path}), 200
    except Exception as e:
        print(f"Error generating PDF report: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



@quiz_routes.route('/api/submit/coding', methods=['POST'])
def submit_coding_answers():
    try:
        # Receive answers as JSON
        data = request.json
        print("Received coding answers:", data)  # Debug log

        if not data.get('questions') or not data.get('answers'):
            return jsonify({"error": "Questions and answers are required"}), 400


        evaluation = evaluate_coding_question(data['questions'][0], data['answers'][0])  # Get evaluation from Gemini


        return jsonify({"feedback":evaluation['feedback'], "total_score":evaluation['score']}),200

    except Exception as e:
        print(f"Error in submit_coding_answers: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500






# @quiz_routes.route('/api/generate_report', methods=['POST'])
# def generate_report():
#     try:
#         data = request.json  # Expecting a JSON with results and other details
#         results = data.get("results", [])
#         user_id= data.get("user_id")

#         total=0
#         count=0


#         for i, result in enumerate(results):
#             score=result.get("score",0)
#             total+=score
#             count+=1

#         average=total/count

#         db = current_app.config["db"]
#         candidates_collection = db["candidates"]
#         candidate_data = {
#             "coding_score":average
#         }

#         try:
#         # Update or insert data in MongoDB
#             updated_doc = candidates_collection.find_one_and_update(
#                 {"_id": ObjectId(user_id)},
#                 {"$set": candidate_data},
#                 return_document = ReturnDocument.AFTER
#             )        

#             print(updated_doc)
        
#         except Exception as e:
#             return jsonify({'status': 'error', 'message': 'Failed to save transcription'}), 500


#         # Initialize PDF
#         pdf = FPDF()
#         pdf.add_page()
#         pdf.set_font("Arial", "B", 16)

#         # Add a title
#         pdf.cell(200, 10, "Assessment Report", 0, 1, "C")

#         pdf.set_font("Arial", "", 12)
#         pdf.ln(10)

#         pdf.cell(200,10, f"Name: {updated_doc.get("name")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Field: {updated_doc.get("field")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Introduction: {updated_doc.get("introduction")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Confidence: {updated_doc.get("confidence_level")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"polarity: {updated_doc.get("polarity")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Subjectivity: {updated_doc.get("subjectivity")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Effeciency: {updated_doc.get("efficiency_level")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Aptitude Score: {updated_doc.get("aptitude_score")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Technical Score: {updated_doc.get("technical_score")}", 0,1)
#         pdf.ln(10)
#         pdf.cell(200,10, f"Average Score: {updated_doc.get("coding_score")}", 0,1)
#         pdf.ln(10)

#         # Add each question result to the PDF
#         for i, result in enumerate(results):
#             question_text = result.get("question", {}).get("text", "No question text available")
#             code_submitted = result.get("code", "No code submitted")
#             score = result.get("score", "No score available")
#             feedback = result.get("feedback", "NO feedback provided")

#             pdf.cell(200, 10, f"Question {i + 1}: {question_text}", 0, 1)
#             pdf.cell(200, 10, f"Code Submitted: {code_submitted}", 0, 1)
#             pdf.cell(200, 10, f"Score: {score}/100", 0, 1)
#             pdf.cell(200, 10, f"Feedback Summary: {feedback}", 0, 1)


#             pdf.ln(10)


#         # Define the path where the PDF will be saved
#         pdf_file_path = "/Users/ij/Desktop/PYTHON/capstone/coding_round_report.pdf"
#         pdf.output(pdf_file_path)

#         return jsonify({"message": "Report generated successfully", "file_path": pdf_file_path}), 200
#     except Exception as e:
#         print(f"Error generating PDF report: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500


@quiz_routes.route('/api/generate_report', methods=['POST'])
def generate_report():
    try:
        data = request.json  # Expecting a JSON with results and other details
        results = data.get("results", [])
        user_id = data.get("user_id")

        total = 0
        count = 0

        for i, result in enumerate(results):
            score = result.get("score", 0)
            total += score
            count += 1

        average = total / count if count > 0 else 0

        db = current_app.config["db"]
        candidates_collection = db["candidates"]
        candidate_data = {
            "coding_score": average
        }

        try:
            # Update or insert data in MongoDB
            updated_doc = candidates_collection.find_one_and_update(
                {"_id": ObjectId(user_id)},
                {"$set": candidate_data},
                return_document=ReturnDocument.AFTER
            )
            print(updated_doc)

        except Exception as e:
            return jsonify({'status': 'error', 'message': 'Failed to save transcription'}), 500

        # Initialize PDF
        pdf = FPDF()
        pdf.add_page()
        
        # Title and header
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, "IntervAI: Your Virtual Interview Assistant", 0, 1, "C")
        pdf.cell(200, 10, "Assessment Report", 0, 1, "C")
        pdf.set_font("Arial", "", 12)
        pdf.ln(10)

        # Decode the Base64 image and add it to the PDF, centered and larger
        base64_image_data = updated_doc.get('image', '').split(',')[1]  # Remove data:image/jpeg;base64, part
        image_data = base64.b64decode(base64_image_data)
        image = Image.open(BytesIO(image_data))
        image_path = "/tmp/temp_image.jpg"
        image.save(image_path)

        # Adjust the image size and center it
        pdf.image(image_path, x=60, y=40, w=90, h=90)  # x=60 centers the image, w=90, h=90 increases the size
        pdf.ln(100)  # Add space below the image

        # Add candidate details
        pdf.cell(200, 10, f"Name: {updated_doc.get('name', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Field: {updated_doc.get('field', 'N/A')}", 0, 1)
        pdf.multi_cell(0, 10, f"Introduction: {updated_doc.get('introduction', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Confidence: {updated_doc.get('confidence_level', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Polarity: {updated_doc.get('polarity', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Subjectivity: {updated_doc.get('subjectivity', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Efficiency: {updated_doc.get('efficiency_level', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Aptitude Score: {updated_doc.get('aptitude_score', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Technical Score: {updated_doc.get('technical_score', 'N/A')}", 0, 1)
        pdf.cell(200, 10, f"Average Coding Round Score: {updated_doc.get('coding_score', 'N/A')}", 0, 1)
        pdf.ln(10)

        # Add each question result to the PDF
        for i, result in enumerate(results):
            question_text = result.get("question", {}).get("text", "No question text available")
            code_submitted = result.get("code", "No code submitted")
            score = result.get("score", "No score available")
            feedback = result.get("feedback", "No feedback provided")

            pdf.multi_cell(0, 10, f"Question {i + 1}: {question_text}")
            pdf.multi_cell(0, 10, f"Code Submitted: {code_submitted}")
            pdf.cell(200, 10, f"Score: {score}/100", 0, 1)
            pdf.multi_cell(0, 10, f"Feedback Summary: {feedback}")
            pdf.ln(10)

        # Define the path where the PDF will be saved
        pdf_file_path = "/Users/ij/Desktop/PYTHON/capstone/Assessment.pdf"
        pdf.output(pdf_file_path)

        return jsonify({"message": "Report generated successfully", "file_path": pdf_file_path}), 200

    except Exception as e:
        print(f"Error generating PDF report: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500




@quiz_routes.route('/api/download_report', methods=['GET'])
def download_report():
    # Ensure this is the correct path where the PDF is generated
    pdf_file_path = "/Users/ij/Desktop/PYTHON/capstone/Assessment.pdf"

    try:
        # Return the file as an attachment, allowing the user to download it
        return send_file(pdf_file_path, as_attachment=True, download_name="Assessment.pdf")
    except Exception as e:
        # Log the error for debugging
        print(f"Error downloading PDF: {str(e)}")
        
        # Return error message if file is not found or any other issue occurs
        return jsonify({"error": "File not found"}), 404













