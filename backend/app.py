from flask import Flask, jsonify, request
from flask_cors import CORS # type: ignore
import os
import pandas as pd
from openai import OpenAI
from flask import jsonify, request
from datetime import datetime
import requests
import requests
from datetime import datetime, timedelta
from datetime import datetime, timedelta
from supabase import create_client, Client
from dotenv import load_dotenv



load_dotenv()
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN")
MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY")
MAILGUN_API_URL = os.getenv("MAILGUN_API_URL")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")



app = Flask(__name__)
CORS(app)  

UPLOAD_FOLDER = 'uploaded_files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CSV_FILE_PATH = os.path.join(UPLOAD_FOLDER, 'uploaded_file.csv')  # Temporary file path

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        # Get user_id from the form data
        user_id = request.form.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'message': 'User ID is required'}), 400

        # Check if a file is part of the request
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No selected file'}), 400

        # Save the uploaded file
        file.save(CSV_FILE_PATH)

        # Parse the CSV file using pandas
        df = pd.read_csv(CSV_FILE_PATH)
        data = df.to_dict(orient='records')  # Convert to a list of dictionaries

        return jsonify({
            'success': True,
            'message': 'File uploaded successfully!',
            'data': data  # Parsed CSV data
        }), 200

    except Exception as e:
        print(f"Error processing file: {e}")
        return jsonify({'success': False, 'message': 'Error processing file'}), 500





client = OpenAI(api_key=OPENAI_API_KEY)
@app.route('/generate-email', methods=['POST'])
def generate_email():
    try:
        data = request.json
        subject = data.get('subject', '')
        prompt = data.get('prompt', '')

        if not subject or not prompt:
            return jsonify({'success': False, 'message': 'Subject and prompt are required'}), 400

        completion = client.chat.completions.create(
            model="gpt-4o",
             messages=[
                {"role": "system", "content": "You are a helpful email writter You are to only give the body of the mail . Do not give the subject."},
                {
                    "role": "user",
                    "content": f"Write a professional email with the subject '{subject}'. {prompt}"
                }
            ]
        )

        generated_email = completion.choices[0].message
        mail = generated_email.content

        print(mail)
        return jsonify({'success': True, 'email': mail}), 200
    except Exception as e:
        print(f"Error generating email: {e}")
        return jsonify({'success': False, 'message': 'Error generating email'}), 500




supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)








@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        sender = data.get('from')  # Sender email from logged-in user
        recipients = data.get('to')  # Recipients from the uploaded CSV
        subject = data.get('subject')
        text_content = data.get('text')
        schedule_time = data.get('schedule_time')  # Optional scheduling time (UTC)

        CSV_FILE_PATH = os.path.join(UPLOAD_FOLDER, 'uploaded_file.csv')

        print(f"text => {text_content}")
        if not sender or not recipients or not subject or not text_content:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400

        successful_emails = []
        failed_emails = []

        current_time = datetime.utcnow()
        if schedule_time:
            if '.' in schedule_time:
                schedule_time = schedule_time.split('.')[0] + 'Z'

            schedule_time = datetime.strptime(schedule_time, '%Y-%m-%dT%H:%M:%SZ')
            if schedule_time < current_time:
                return jsonify({'success': False, 'message': 'Schedule time must be in the future'}), 400
            if schedule_time > current_time + timedelta(days=3):
                return jsonify({'success': False, 'message': 'Schedule time must be within 3 days'}), 400

        
        try:
            df = pd.read_csv(CSV_FILE_PATH)
        except Exception as e:
            print(f"Error reading CSV file: {e}")
            return jsonify({'success': False, 'message': 'Error reading CSV file'}), 500

        placeholders = [col for col in df.columns if f"{{{col}}}" in text_content]

        for _, row in df.iterrows():
            personalized_message = text_content
            for placeholder in placeholders:
                personalized_message = personalized_message.replace(f"{{{placeholder}}}", str(row[placeholder]))

            recipient = row.get('Email')  
            if not recipient:
                continue  

            try:
                mailgun_data = {
                    "from": sender,
                    "to": recipient,
                    "subject": subject,
                    "text": personalized_message,  # Use the personalized message here
                    "o:tracking": "yes",
                    "o:tracking-opens": "yes",
                    "o:tracking-clicks": "yes",
                }

                if schedule_time:
                    mailgun_data["o:deliverytime"] = schedule_time.strftime('%a, %d %b %Y %H:%M:%S GMT')

                response = requests.post(
                    MAILGUN_API_URL,
                    auth=("api", MAILGUN_API_KEY),
                    data=mailgun_data
                )

                if response.status_code == 200:
                    response_data = response.json()
                    message_id = response_data.get('id')
                    email_status = f"scheduled at {schedule_time}" if schedule_time else "success"
                    print(f"email => {recipient} messageid => {message_id}")

                    successful_emails.append({"recipient": recipient, "message_id": message_id})

                    supabase.table('email_logs').insert({
                        "email": recipient,
                        "user_loginmail": sender,
                        "message_id": message_id,
                        "status": email_status,
                        "created_at": current_time.isoformat(),
                        "update": None  
                    }).execute()

                else:
                    failed_emails.append({"recipient": recipient, "error": response.text})
                    supabase.table('email_logs').insert({
                        "email": recipient,
                        "user_loginmail": sender,
                        "message_id": "None",
                        "status": "failed",
                        "created_at": current_time.isoformat(),
                        "update": None
                    }).execute()

            except Exception as e:
                print(f"Error sending email to {recipient}: {e}")
                failed_emails.append({"recipient": recipient, "error": str(e)})

        return jsonify({
            'success': True,
            'successful_emails': successful_emails,
            'failed_emails': failed_emails
        }), 200

    except Exception as e:
        print(f"Error in send_email route: {e}")
        return jsonify({'success': False, 'message': 'Error sending emails'}), 500

@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        user_email = request.args.get('user_email')  # Get logged-in user's email from query params

        if not user_email:
            return jsonify({'success': False, 'message': 'Missing user email'}), 400

        response = supabase.table('email_logs') \
            .select('*') \
            .eq('user_loginmail', user_email) \
            .order('created_at', desc=True) \
            .execute()

        # if response.status_code == 200:
        data = response.data
        return jsonify({'success': True, 'data': data}), 200
        # else:
        #     return jsonify({'success': False, 'message': 'Failed to fetch data from Supabase'}), 500

    except Exception as e:
        print(f"Error fetching dashboard data: {e}")
        return jsonify({'success': False, 'message': 'Error fetching dashboard data'}), 500




















def get_email_events(message_id):
    try:
        # Fetch events for the given message_id
        response = requests.get(
            f"{MAILGUN_API_URL.replace('/messages', '/events')}",
            auth=("api", MAILGUN_API_KEY),
            params={"message-id": message_id}
        )

        # Ensure response is valid and parse events
        if response.status_code == 200:
            return response.json().get('items', [])
        else:
            print(f"Failed to fetch events for {message_id}: {response.text}")
            return []
    except Exception as e:
        print(f"Error fetching events for {message_id}: {e}")
        return []

def convert_timestamp_to_utc(timestamp):
    # Convert UNIX timestamp to UTC string
    return datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S UTC')

@app.route('/update-email-status', methods=['POST'])
def update_email_status():
    try:
        data = request.json
        message_ids = data.get('message_ids')  # List of message IDs to update

        if not message_ids:
            return jsonify({'success': False, 'message': 'No message IDs provided'}), 400

        updated_logs = []

        for message_id in message_ids:
            try:
                # Fetch email events for the message ID
                events = get_email_events(message_id)

                if events:
                    # Determine the latest event based on timestamp
                    latest_event = max(events, key=lambda e: e.get('timestamp', 0))
                    event_type = latest_event.get('event')
                    utc_time = convert_timestamp_to_utc(latest_event.get('timestamp'))

                    # Log the latest event
                    print(f"Message-ID {message_id}: Event {event_type} at {utc_time}")

                    # Update the `update` column in Supabase
                    supabase_response = supabase.table('email_logs') \
                        .update({"update": f"{event_type} at {utc_time}"}) \
                        .eq('message_id', message_id) \
                        .execute()

                    # Check if the update was successful
                    # if supabase_response.get('status_code') == 200 or supabase_response.get('status') == 'ok':
                    updated_logs.append({
                            "message_id": message_id,
                            "update": f"{event_type} at {utc_time}"
                    })
                    # else:
                        # print(f"Failed to update Supabase for {message_id}: {supabase_response}")

            except Exception as e:
                print(f"Error processing Message-ID {message_id}: {e}")

        return jsonify({'success': True, 'updated_logs': updated_logs}), 200

    except Exception as e:
        print(f"Error in update_email_status route: {e}")
        return jsonify({'success': False, 'message': 'Error updating email statuses'}), 500

@app.route('/update-scheduled-emails', methods=['POST'])
def update_scheduled_emails():
    try:
        # Fetch email logs with status containing "scheduled at"
        response = supabase.table('email_logs') \
            .select('message_id, status, email') \
            .ilike('status', 'scheduled at%') \
            .execute()

        # if response.status_code != 200 or not response.data:
            # return jsonify({'success': False, 'message': 'No scheduled emails found'}), 200

        scheduled_emails = response.data  # List of scheduled emails
        updated_logs = []

        for email_log in scheduled_emails:
            message_id = email_log.get('message_id')
            recipient = email_log.get('email')

            if not message_id:
                continue  # Skip if no message_id is available

            # Fetch Mailgun events for the message_id
            events = get_email_events(message_id)

            if events:
                # Determine the latest event
                latest_event = max(events, key=lambda e: e.get('timestamp', 0))
                event_type = latest_event.get('event')

                # Update status based on the event type
                if event_type == 'delivered':
                    status = 'success'
                elif event_type in ['bounced', 'failed']:
                    status = 'failed'
                else:
                    continue  # Skip updating for other event types

                # Update the Supabase table with the new status
                supabase_response = supabase.table('email_logs') \
                    .update({"status": status}) \
                    .eq('message_id', message_id) \
                    .execute()

                # if supabase_response.status_code == 200 or supabase_response.get('status') == 'ok':
                updated_logs.append({
                        "message_id": message_id,
                        "email": recipient,
                        "new_status": status
                })
                # else:
                    # print(f"Failed to update status for {message_id}: {supabase_response}")

        return jsonify({'success': True, 'updated_logs': updated_logs}), 200

    except Exception as e:
        print(f"Error in update_scheduled_emails route: {e}")
        return jsonify({'success': False, 'message': 'Error updating scheduled emails'}), 500



if __name__ == '__main__':
    app.run(debug=True)
