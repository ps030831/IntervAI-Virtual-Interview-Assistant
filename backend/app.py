# from flask import Flask, jsonify, request
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # To allow cross-origin requests between React and Flask

# # Sample questions for aptitude and technical rounds
# aptitude_questions = [
#     {"question": "What is 2 + 2?", "options": ["2", "3", "4", "5"], "answer": "4"},
#     {"question": "What is 5 - 3?", "options": ["1", "2", "3", "4"], "answer": "2"},
#     {"question": "What is 7 * 3?", "options": ["21", "24", "18", "30"], "answer": "21"},
#     {"question": "What is 9 / 3?", "options": ["2", "3", "4", "5"], "answer": "3"},
#     {"question": "What is 15 + 5?", "options": ["20", "15", "25", "10"], "answer": "20"},
#     {"question": "What is 100 - 40?", "options": ["60", "50", "70", "80"], "answer": "60"},
#     {"question": "What is 8 * 8?", "options": ["64", "56", "72", "81"], "answer": "64"},
#     {"question": "What is 12 / 4?", "options": ["4", "2", "3", "6"], "answer": "3"},
#     {"question": "What is 30 + 10?", "options": ["20", "30", "40", "50"], "answer": "40"},
#     {"question": "What is 6 * 7?", "options": ["42", "36", "48", "54"], "answer": "42"}
# ]

# technical_questions = [
#     {"question": "What is the output of 2 + 2?", "options": ["2", "4", "3", "5"], "answer": "4"},
#     {"question": "What does HTML stand for?", "options": ["Hyper Text Markup Language", "High Text Markup Language"], "answer": "Hyper Text Markup Language"},
#     {"question": "What is the main purpose of CSS?", "options": ["Styling", "Scripting", "Markup", "Database"], "answer": "Styling"},
#     {"question": "Which language is used for web development?", "options": ["Python", "Java", "JavaScript", "C++"], "answer": "JavaScript"},
#     {"question": "What does SQL stand for?", "options": ["Structured Query Language", "Style Query Language"], "answer": "Structured Query Language"},
#     {"question": "What is the output of console.log(1 + '1')?", "options": ["11", "2", "undefined", "NaN"], "answer": "11"},
#     {"question": "Which is a JavaScript framework?", "options": ["Django", "Flask", "React", "Rails"], "answer": "React"},
#     {"question": "What does API stand for?", "options": ["Application Programming Interface", "Application Process Interface"], "answer": "Application Programming Interface"},
#     {"question": "What is the use of 'this' keyword in JavaScript?", "options": ["Refers to the object calling the function", "Refers to the global object"], "answer": "Refers to the object calling the function"},
#     {"question": "What is the main use of Git?", "options": ["Version control", "Database management"], "answer": "Version control"}
# ]

# # Route for aptitude quiz
# @app.route('/api/aptitude', methods=['GET'])
# def get_aptitude_questions():
#     return jsonify(aptitude_questions)

# # Route for technical quiz
# @app.route('/api/technical', methods=['GET'])
# def get_technical_questions():
#     return jsonify(technical_questions)

# # Route for receiving answers and calculating score for aptitude round
# @app.route('/api/submit/aptitude', methods=['POST'])
# def submit_aptitude_answers():
#     data = request.json
#     correct_answers = sum(1 for i in range(len(aptitude_questions)) if data.get(str(i)) == aptitude_questions[i]["answer"])
#     score_percentage = (correct_answers / len(aptitude_questions)) * 100
#     pass_criteria = 70  # 70% criteria
#     return jsonify({"score": score_percentage, "passed": score_percentage >= pass_criteria})

# # Route for receiving answers and calculating score for technical round
# @app.route('/api/submit/technical', methods=['POST'])
# def submit_technical_answers():
#     data = request.json
#     correct_answers = sum(1 for i in range(len(technical_questions)) if data.get(str(i)) == technical_questions[i]["answer"])
#     score_percentage = (correct_answers / len(technical_questions)) * 100
#     pass_criteria = 80  # 80% criteria
#     return jsonify({"score": score_percentage, "passed": score_percentage >= pass_criteria})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)








# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import google.generativeai as genai
# import json
# import re
# import random
# from datetime import datetime, timedelta

# app = Flask(__name__)
# CORS(app)

# # Configure Gemini API
# genai.configure(api_key='AIzaSyBrkOEG3pQXeqijFYC0Tu0Pidi-4sI-XhA')
# model = genai.GenerativeModel('gemini-pro')

# # Question cache with timestamps
# question_cache = {
#     'aptitude': {
#         'questions': None,
#         'last_updated': None
#     },
#     'technical': {
#         'questions': None,
#         'last_updated': None
#     }
# }

# def clean_json_string(s):
#     """Clean and extract JSON string from Gemini's response."""
#     try:
#         match = re.search(r'\[(.*)\]', s, re.DOTALL)
#         if match:
#             json_str = f"[{match.group(1)}]"
#             json_str = re.sub(r'```json|```', '', json_str)
#             return json_str.strip()
#     except Exception as e:
#         print(f"Error cleaning JSON string: {str(e)}")
#     return None

# def validate_questions(questions):
#     """Validate that questions are in the correct format and have exactly 5 questions."""
#     try:
#         if not isinstance(questions, list) or len(questions) != 5:
#             return False
#         for q in questions:
#             if not all(key in q for key in ['question', 'options', 'answer']) or \
#                not isinstance(q['options'], list) or len(q['options']) != 4 or \
#                q['answer'] not in q['options']:
#                 return False
#         return True
#     except Exception as e:
#         print(f"Error validating questions: {str(e)}")
#         return False

# def generate_questions(question_type):
#     """Generate questions using Gemini API with improved prompting."""
#     topic_focus = {
#         'aptitude': '''
#         Focus on:
#         - Numerical reasoning (arithmetic, percentages, ratios)
#         - Logical deduction and patterns
#         - Data interpretation (graphs, tables)
#         - Problem-solving scenarios
#         - Time and work problems
#         - Spatial reasoning
#         ''',
#         'technical': '''
#         Focus on:
#         - Programming fundamentals and syntax
#         - Data structures and algorithms
#         - Web development (HTML, CSS, JavaScript)
#         - Database concepts (SQL, NoSQL)
#         - Software design principles
#         - API and REST concepts
#         '''
#     }

#     prompt = f"""Generate exactly 5 unique multiple-choice questions for {question_type} assessment.

#     Requirements:
#     - Diverse topics within {question_type}
#     - Exactly 4 options per question, 1 correct answer
#     - Moderate to challenging difficulty
#     - Test practical knowledge
#     - Return ONLY JSON array
    
#     {topic_focus[question_type]}
    
#     JSON format:
#     [
#         {{
#             "question": "Question text here?",
#             "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
#             "answer": "Option 2"
#         }}
#     ]
#     Return ONLY the JSON array."""

#     try:
#         response = model.generate_content(prompt)
#         if response and response.text:
#             json_str = clean_json_string(response.text)
#             if json_str:
#                 questions = json.loads(json_str)
#                 if validate_questions(questions):
#                     return questions
#         print(f"Invalid response format for {question_type}")
#         return None
#     except Exception as e:
#         print(f"Error generating questions: {str(e)}")
#         return None

# def should_regenerate_questions(question_type):
#     """Determine if questions should be regenerated based on time and randomness."""
#     cache_entry = question_cache[question_type]
#     if cache_entry['questions'] is None or cache_entry['last_updated'] is None:
#         return True
#     time_threshold = datetime.now() - timedelta(hours=1)
#     if cache_entry['last_updated'] < time_threshold:
#         return True
#     return random.random() < 0.3

# def get_or_generate_questions(question_type):
#     """Get questions from cache or generate new ones with rotation mechanism."""
#     if should_regenerate_questions(question_type):
#         new_questions = generate_questions(question_type)
#         if validate_questions(new_questions):
#             question_cache[question_type]['questions'] = new_questions
#             question_cache[question_type]['last_updated'] = datetime.now()
#             return new_questions
#     return question_cache[question_type]['questions']

# # API Routes
# @app.route('/api/aptitude', methods=['GET'])
# def get_aptitude_questions():
#     questions = get_or_generate_questions('aptitude')
#     return jsonify(random.sample(questions, len(questions)))

# @app.route('/api/technical', methods=['GET'])
# def get_technical_questions():
#     questions = get_or_generate_questions('technical')
#     return jsonify(random.sample(questions, len(questions)))

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)



















# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import google.generativeai as genai
# import json
# import re
# import random
# from datetime import datetime, timedelta

# app = Flask(__name__)
# CORS(app)

# # Configure Gemini API
# genai.configure(api_key='AIzaSyBrkOEG3pQXeqijFYC0Tu0Pidi-4sI-XhA')  # Replace with your actual API key
# model = genai.GenerativeModel('gemini-pro')

# # Question cache with timestamps
# question_cache = {
#     'aptitude': {
#         'questions': None,
#         'last_updated': None
#     },
#     'technical': {
#         'questions': None,
#         'last_updated': None
#     }
# }

# def clean_json_string(s):
#     """Clean and extract JSON string from Gemini's response."""
#     try:
#         match = re.search(r'\[(.*)\]', s, re.DOTALL)
#         if match:
#             json_str = f"[{match.group(1)}]"
#             json_str = re.sub(r'```json|```', '', json_str)
#             return json_str.strip()
#     except Exception as e:
#         print(f"Error cleaning JSON string: {str(e)}")
#     return None

# def validate_questions(questions):
#     """Validate that questions are in the correct format and have exactly 5 questions."""
#     try:
#         if not isinstance(questions, list) or len(questions) != 5:
#             return False
#         for q in questions:
#             if not all(key in q for key in ['question', 'options', 'answer']) or \
#                not isinstance(q['options'], list) or len(q['options']) != 4 or \
#                q['answer'] not in q['options']:
#                 return False
#         return True
#     except Exception as e:
#         print(f"Error validating questions: {str(e)}")
#         return False

# def generate_questions(question_type):
#     """Generate questions using Gemini API with improved prompting."""
#     print(f"Generating questions for: {question_type}")
#     topic_focus = {
#         'aptitude': '''
#         Focus on:
#         - Numerical reasoning (arithmetic, percentages, ratios)
#         - Logical deduction and patterns
#         - Data interpretation (graphs, tables)
#         - Problem-solving scenarios
#         - Time and work problems
#         - Spatial reasoning
#         ''',
#         'technical': '''
#         Focus on:
#         - Programming fundamentals and syntax
#         - Data structures and algorithms
#         - Web development (HTML, CSS, JavaScript)
#         - Database concepts (SQL, NoSQL)
#         - Software design principles
#         - API and REST concepts
#         '''
#     }

#     prompt = f"""Generate exactly 5 unique multiple-choice questions for {question_type} assessment.

#     Requirements:
#     - Diverse topics within {question_type}
#     - Exactly 4 options per question, 1 correct answer
#     - Moderate to challenging difficulty
#     - Test practical knowledge
#     - Return ONLY JSON array
    
#     {topic_focus[question_type]}
    
#     JSON format:
#     [
#         {{
#             "question": "Question text here?",
#             "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
#             "answer": "Option 2"
#         }}
#     ]
#     Return ONLY the JSON array."""

#     try:
#         response = model.generate_content(prompt)
#         print("Received response from Gemini API:", response)
        
#         if response and response.text:
#             json_str = clean_json_string(response.text)
#             print("Cleaned JSON string:", json_str)
            
#             if json_str:
#                 questions = json.loads(json_str)
#                 print("Parsed questions:", questions)
                
#                 if validate_questions(questions):
#                     return questions
#         print(f"Invalid response format for {question_type}")
#         return None
#     except Exception as e:
#         print(f"Error generating questions: {str(e)}")
#         return None

# def should_regenerate_questions(question_type):
#     """Determine if questions should be regenerated based on time and randomness."""
#     cache_entry = question_cache[question_type]
#     if cache_entry['questions'] is None or cache_entry['last_updated'] is None:
#         return True
#     time_threshold = datetime.now() - timedelta(hours=1)
#     if cache_entry['last_updated'] < time_threshold:
#         return True
#     return random.random() < 0.3

# def get_or_generate_questions(question_type):
#     """Get questions from cache or generate new ones with rotation mechanism."""
#     print(f"Getting or generating questions for {question_type}")
#     if should_regenerate_questions(question_type):
#         new_questions = generate_questions(question_type)
#         if validate_questions(new_questions):
#             question_cache[question_type]['questions'] = new_questions
#             question_cache[question_type]['last_updated'] = datetime.now()
#             return new_questions
#         else:
#             print("Generated questions failed validation.")
#             return None  # Return None if validation fails
#     return question_cache[question_type]['questions']

# # API Routes to fetch questions
# @app.route('/api/aptitude', methods=['GET'])
# def get_aptitude_questions():
#     print("Fetching aptitude questions...")
#     questions = get_or_generate_questions('aptitude')
#     if questions:
#         print("Returning aptitude questions")
#         return jsonify(random.sample(questions, len(questions)))
#     else:
#         print("Error fetching aptitude questions")
#         return jsonify({"error": "Error fetching aptitude questions"}), 500

# @app.route('/api/technical', methods=['GET'])
# def get_technical_questions():
#     print("Fetching technical questions...")
#     questions = get_or_generate_questions('technical')
#     if questions:
#         print("Returning technical questions")
#         return jsonify(random.sample(questions, len(questions)))
#     else:
#         print("Error fetching technical questions")
#         return jsonify({"error": "Error fetching technical questions"}), 500

# # Routes to submit answers
# @app.route('/api/submit/aptitude', methods=['POST'])
# def submit_aptitude_answers():
#     try:
#         data = request.json  # Receiving answers as JSON
#         print("Received aptitude answers:", data)  # Debug log

#         # Retrieve cached questions
#         questions = question_cache['aptitude']['questions'] or []
#         if not questions:
#             print("Error: No aptitude questions found in cache.")
#             return jsonify({"error": "No questions available for scoring"}), 500

#         # Calculate score
#         correct_answers = sum(1 for i in range(len(questions)) if str(i) in data and data[str(i)] == questions[i]["answer"])
#         score_percentage = (correct_answers / len(questions)) * 100
#         pass_criteria = 70  # Define the pass percentage

#         return jsonify({
#             "score": score_percentage,
#             "passed": score_percentage >= pass_criteria,
#             "correct_answers": correct_answers,
#             "total_questions": len(questions)
#         })
#     except Exception as e:
#         print(f"Error in submit_aptitude_answers: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500

# @app.route('/api/submit/technical', methods=['POST'])
# def submit_technical_answers():
#     try:
#         data = request.json  # Receiving answers as JSON
#         print("Received technical answers:", data)  # Debug log

#         # Retrieve cached questions
#         questions = question_cache['technical']['questions'] or []
#         if not questions:
#             print("Error: No technical questions found in cache.")
#             return jsonify({"error": "No questions available for scoring"}), 500

#         # Calculate score
#         correct_answers = sum(1 for i in range(len(questions)) if str(i) in data and data[str(i)] == questions[i]["answer"])
#         score_percentage = (correct_answers / len(questions)) * 100
#         pass_criteria = 80  # Define the pass percentage

#         return jsonify({
#             "score": score_percentage,
#             "passed": score_percentage >= pass_criteria,
#             "correct_answers": correct_answers,
#             "total_questions": len(questions)
#         })
#     except Exception as e:
#         print(f"Error in submit_technical_answers: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)




























# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import google.generativeai as genai
# import json
# import re
# import random
# from datetime import datetime, timedelta

# app = Flask(__name__)
# CORS(app)

# # Configure Gemini API
# genai.configure(api_key='AIzaSyBrkOEG3pQXeqijFYC0Tu0Pidi-4sI-XhA')  # Replace with your valid API key
# model = genai.GenerativeModel('gemini-pro')

# # Question cache with timestamps
# question_cache = {
#     'aptitude': {
#         'questions': None,
#         'last_updated': None
#     },
#     'technical': {
#         'questions': None,
#         'last_updated': None
#     }
# }

# def clean_json_string(s):
#     """Clean and extract JSON string from Gemini's response."""
#     try:
#         match = re.search(r'\[(.*)\]', s, re.DOTALL)
#         if match:
#             json_str = f"[{match.group(1)}]"
#             json_str = re.sub(r'```json|```', '', json_str)
#             return json_str.strip()
#     except Exception as e:
#         print(f"Error cleaning JSON string: {str(e)}")
#     return None

# def validate_questions(questions):
#     """Validate that questions are in the correct format and have exactly 5 questions."""
#     try:
#         if not isinstance(questions, list) or len(questions) != 5:
#             return False
#         for q in questions:
#             if not all(key in q for key in ['question', 'options', 'answer']) or \
#                not isinstance(q['options'], list) or len(q['options']) != 4 or \
#                q['answer'] not in q['options']:
#                 return False
#         return True
#     except Exception as e:
#         print(f"Error validating questions: {str(e)}")
#         return False

# def generate_questions(question_type):
#     """Generate questions using Gemini API with improved prompting."""
#     print(f"Generating questions for: {question_type}")
#     topic_focus = {
#         'aptitude': '''
#         Focus on:
#         - Numerical reasoning (arithmetic, percentages, ratios)
#         - Logical deduction and patterns
#         - Data interpretation (graphs, tables)
#         - Problem-solving scenarios
#         - Time and work problems
#         - Spatial reasoning
#         ''',
#         'technical': '''
#         Focus on:
#         - Programming fundamentals and syntax
#         - Data structures and algorithms
#         - Web development (HTML, CSS, JavaScript)
#         - Database concepts (SQL, NoSQL)
#         - Software design principles
#         - API and REST concepts
#         '''
#     }

#     prompt = f"""Generate exactly 5 unique multiple-choice questions for {question_type} assessment.

#     Requirements:
#     - Diverse topics within {question_type}
#     - Exactly 4 options per question, 1 correct answer
#     - Moderate to challenging difficulty
#     - Test practical knowledge
#     - Return ONLY JSON array
    
#     {topic_focus[question_type]}
    
#     JSON format:
#     [
#         {{
#             "question": "Question text here?",
#             "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
#             "answer": "Option 2"
#         }}
#     ]
#     Return ONLY the JSON array."""

#     try:
#         response = model.generate_content(prompt)
#         print("Received response from Gemini API:", response)
        
#         if response and response.text:
#             json_str = clean_json_string(response.text)
#             print("Cleaned JSON string:", json_str)
            
#             if json_str:
#                 questions = json.loads(json_str)
#                 print("Parsed questions:", questions)
                
#                 if validate_questions(questions):
#                     return questions
#         print(f"Invalid response format for {question_type}")
#         return None
#     except Exception as e:
#         print(f"Error generating questions: {str(e)}")
#         return None

# def should_regenerate_questions(question_type):
#     """Determine if questions should be regenerated based on time and randomness."""
#     cache_entry = question_cache[question_type]
#     if cache_entry['questions'] is None or cache_entry['last_updated'] is None:
#         return True
#     time_threshold = datetime.now() - timedelta(hours=1)
#     if cache_entry['last_updated'] < time_threshold:
#         return True
#     return random.random() < 0.3

# def get_or_generate_questions(question_type):
#     """Get questions from cache or generate new ones with rotation mechanism."""
#     print(f"Getting or generating questions for {question_type}")
#     if should_regenerate_questions(question_type):
#         new_questions = generate_questions(question_type)
#         if validate_questions(new_questions):
#             question_cache[question_type]['questions'] = new_questions
#             question_cache[question_type]['last_updated'] = datetime.now()
#             return new_questions
#         else:
#             print("Generated questions failed validation.")
#             return None  # Return None if validation fails
#     return question_cache[question_type]['questions']

# # API Routes to fetch questions
# @app.route('/api/aptitude', methods=['GET'])
# def get_aptitude_questions():
#     print("Fetching aptitude questions...")
#     questions = get_or_generate_questions('aptitude')
#     if questions:
#         print("Returning aptitude questions")
#         return jsonify(random.sample(questions, len(questions)))
#     else:
#         print("Error fetching aptitude questions")
#         return jsonify({"error": "Error fetching aptitude questions"}), 500

# @app.route('/api/technical', methods=['GET'])
# def get_technical_questions():
#     print("Fetching technical questions...")
#     questions = get_or_generate_questions('technical')
#     if questions:
#         print("Returning technical questions")
#         return jsonify(random.sample(questions, len(questions)))
#     else:
#         print("Error fetching technical questions")
#         return jsonify({"error": "Error fetching technical questions"}), 500

# # Routes to submit answers
# @app.route('/api/submit/aptitude', methods=['POST'])
# def submit_aptitude_answers():
#     try:
#         data = request.json  # Receiving answers as JSON
#         print("Received aptitude answers:", data)  # Debug log

#         # Retrieve cached questions
#         questions = question_cache['aptitude']['questions'] or []
#         if not questions:
#             print("Error: No aptitude questions found in cache.")
#             return jsonify({"error": "No questions available for scoring"}), 500

#         # Initialize score counter
#         correct_answers = 0
#         total_questions = len(questions)

#         # Calculate score
#         for i, question in enumerate(questions):
#             correct_answer = question["answer"]
#             user_answer = data.get(str(i))
            
#             # Logging each question, correct answer, and user answer
#             print(f"Question {i+1}: Correct Answer = '{correct_answer}', User Answer = '{user_answer}'")

#             if user_answer == correct_answer:
#                 correct_answers += 1

#         # Calculate score as a percentage
#         score_percentage = (correct_answers / total_questions) * 100
#         pass_criteria = 70  # Define the pass percentage

#         return jsonify({
#             "score": score_percentage,
#             "passed": score_percentage >= pass_criteria,
#             "correct_answers": correct_answers,
#             "total_questions": total_questions
#         })
#     except Exception as e:
#         print(f"Error in submit_aptitude_answers: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500


# @app.route('/api/submit/technical', methods=['POST'])
# def submit_technical_answers():
#     try:
#         data = request.json  # Receiving answers as JSON
#         print("Received technical answers:", data)  # Debug log

#         # Retrieve cached questions
#         questions = question_cache['technical']['questions'] or []
#         if not questions:
#             print("Error: No technical questions found in cache.")
#             return jsonify({"error": "No questions available for scoring"}), 500

#         # Calculate score
#         correct_answers = sum(1 for idx, question in enumerate(questions) if data.get(str(idx)) == question["answer"])
#         score_percentage = (correct_answers / len(questions)) * 100
#         pass_criteria = 80  # Define the pass percentage

#         return jsonify({
#             "score": score_percentage,
#             "passed": score_percentage >= pass_criteria,
#             "correct_answers": correct_answers,
#             "total_questions": len(questions)
#         })
#     except Exception as e:
#         print(f"Error in submit_technical_answers: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


















from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
import json
import re
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)
 
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
            if 'question' not in q or 'test_cases' not in q:
                return False
            # Ensure test_cases is a list with at least one case
            if not isinstance(q['test_cases'], list) or len(q['test_cases']) < 1:
                return False
        return True
    except Exception as e:
        print(f"Error validating coding questions: {str(e)}")
        return False


def generate_questions(question_type):
    """Generate questions using Gemini API with improved prompting."""
    topic_focus = {
        'aptitude': '''
        Focus on:
        - Numerical reasoning (arithmetic, percentages, ratios)
        - Logical deduction and patterns
        - Data interpretation (graphs, tables)
        - Problem-solving scenarios
        - Time and work problems
        - Spatial reasoning
        ''',
        'technical': '''
        Focus on:
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
    - Each question should include a problem description and at least 2 test cases
    - The response should be in JSON format, structured as follows:

    JSON format:
    [
        {
            "question": "Write a function to reverse a string.",
            "test_cases": [
                {"input": "hello", "output": "olleh"},
                {"input": "world", "output": "dlrow"}
            ]
        }
    ]
    Return ONLY the JSON array.
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




def should_regenerate_questions(question_type):
    """Determine if questions should be regenerated based on time and randomness."""
    cache_entry = question_cache[question_type]
    if cache_entry['questions'] is None or cache_entry['last_updated'] is None:
        return True
    time_threshold = datetime.now() - timedelta(hours=1)
    if cache_entry['last_updated'] < time_threshold:
        return True
    return random.random() < 0.3


def get_or_generate_questions(question_type):
    """Get questions from cache or generate new ones with rotation mechanism."""
    if should_regenerate_questions(question_type):
        new_questions = generate_questions(question_type)
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
@app.route('/api/aptitude', methods=['GET'])
def get_aptitude_questions():
    questions = get_or_generate_questions('aptitude')
    if questions:
        return jsonify(questions)
    return jsonify({"error": "Error generating questions"}), 500

@app.route('/api/technical', methods=['GET'])
def get_technical_questions():
    questions = get_or_generate_questions('technical')
    if questions:
        return jsonify(questions)
    return jsonify({"error": "Error generating technical questions"}), 500


@app.route('/api/coding', methods=['GET'])
def get_coding_questions():
    if should_regenerate_questions('coding'):
        new_questions = generate_coding_questions()
        if new_questions:
            question_cache['coding']['questions'] = new_questions
            question_cache['coding']['last_updated'] = datetime.now()
    
    questions = question_cache['coding']['questions']
    if questions:
        return jsonify(questions)
    return jsonify({"error": "Error generating coding questions"}), 500




@app.route('/api/submit/aptitude', methods=['POST'])
def submit_aptitude_answers():
    try:
        data = request.json  # Receiving answers as JSON
        print("Received aptitude answers:", data)  # Debug log

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
            user_answer = data.get(str(idx))  # Ensure we get the answer as a string key

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

        return jsonify({
            "score": score_percentage,
            "passed": score_percentage >= pass_criteria,
            "correct_answers": correct_answers,
            "total_questions": total_questions
        })

    except Exception as e:
        print(f"Error in submit_aptitude_answers: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/submit/technical', methods=['POST'])
def submit_technical_answers():
    try:
        data = request.json  # Receiving answers as JSON
        print("Received technical answers:", data)  # Debug log

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
            user_answer = data.get(str(idx))  # Ensure we get the answer as a string key

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

        return jsonify({
            "score": score_percentage,
            "passed": score_percentage >= pass_criteria,
            "correct_answers": correct_answers,
            "total_questions": total_questions
        })

    except Exception as e:
        print(f"Error in submit_technical_answers: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/submit/coding', methods=['POST'])
def submit_coding_answers():
    try:
        data = request.json  # Receive answers as JSON
        print("Received coding answers:", data)  # Debug log

        # Retrieve the coding questions
        questions = question_cache['coding']['questions'] or []
        if not questions:
            print("Error: No coding questions found in cache.")
            return jsonify({"error": "No coding questions available for scoring"}), 500

        # Assume data is a dictionary where keys are question indices and values are user-submitted code.
        results = []
        for idx, question in enumerate(questions):
            user_code = data.get(str(idx), "")
            test_cases = question['test_cases']

            # Evaluate the user's code against each test case (this is a placeholder)
            passed_all_cases = True  # Assume this variable will track if the code passes all cases
            for case in test_cases:
                # This is where you’d add logic to execute `user_code` and check output
                # You may use a sandboxed execution environment or Gemini API
                expected_output = case['output']
                user_output = "placeholder"  # Replace this with actual evaluation logic
                if user_output != expected_output:
                    passed_all_cases = False
                    break

            results.append({
                "question": question['question'],
                "passed": passed_all_cases
            })

        # Calculate the score
        score = (sum(1 for r in results if r['passed']) / len(results)) * 100
        pass_criteria = 70  # Example pass percentage

        return jsonify({
            "score": score,
            "passed": score >= pass_criteria,
            "results": results
        })

    except Exception as e:
        print(f"Error in submit_coding_answers: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
