

// import { useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { supabase } from '../services/supabaseClient';

// const CreateMail = () => {
//   const location = useLocation();
//   const csvData = location.state?.csvData || []; // Retrieve CSV data passed during navigation
//   const [subject, setSubject] = useState('');
//   const [prompt, setPrompt] = useState('');
//   const [generatedEmail, setGeneratedEmail] = useState('');
//   const [status, setStatus] = useState('');
//   const [senderEmail, setSenderEmail] = useState(''); // To store the logged-in user's email

//   // Fetch the logged-in user's email from Supabase
//   useEffect(() => {
//     const fetchUserEmail = async () => {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (user) {
//         setSenderEmail(user.email); // Set the sender email
//       } else if (error) {
//         console.error('Error fetching user email:', error.message);
//       }
//     };
//     fetchUserEmail();
//   }, []);

//   const handleGenerate = async () => {
//     if (!subject || !prompt) {
//       setStatus('Please fill in both subject and prompt!');
//       return;
//     }

//     try {
//       const response = await axios.post('http://127.0.0.1:5000/generate-email', {
//         subject,
//         prompt,
//       });

//       if (response.data.success) {
//         setGeneratedEmail(response.data.email);
//         setStatus('Email generated successfully!');
//       } else {
//         setStatus('Failed to generate email.');
//       }
//     } catch (error) {
//       console.error('Error generating email:', error);
//       setStatus('Error occurred while generating email.');
//     }
//   };

//   const handleSend = async () => {
//     if (!generatedEmail) {
//       setStatus('Please generate or edit the email before sending!');
//       return;
//     }

//     if (!senderEmail) {
//       setStatus('Sender email is not available.');
//       return;
//     }

//     const recipients = csvData.map((row) => row.Email); // Extract recipient emails from CSV

//     try {
//       const response = await axios.post('http://127.0.0.1:5000/send-email', {
//         from: senderEmail, // Use the logged-in user's email
//         to: recipients,
//         subject,
//         text: generatedEmail,
//       });

//       if (response.data.success) {
//         setStatus(`Emails sent successfully! Message ID: ${response.data.message_id}`);
//       } else {
//         setStatus('Failed to send emails.');
//       }
//     } catch (error) {
//       console.error('Error sending email:', error);
//       setStatus('Error occurred while sending emails.');
//     }
//   };

//   return (
//     <div>
//       <h2>Create and Send Email</h2>
//       <div>
//         <label>Subject:</label>
//         <input
//           type="text"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           placeholder="Enter email subject"
//         />
//       </div>
//       <div>
//         <label>Prompt:</label>
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Enter email prompt (e.g., details or context)"
//         />
//       </div>
//       <button onClick={handleGenerate}>Generate Email</button>
//       <div>
//         <label>Generated Email:</label>
//         <textarea
//           value={generatedEmail}
//           onChange={(e) => setGeneratedEmail(e.target.value)}
//           placeholder="Generated email will appear here"
//         />
//       </div>
//       <button onClick={handleSend}>Send Emails</button>
//       {status && <p>{status}</p>}

//       <h3>Uploaded CSV Data:</h3>
//       {csvData.length > 0 ? (
//         <table border="1">
//           <thead>
//             <tr>
//               {Object.keys(csvData[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {csvData.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, i) => (
//                   <td key={i}>{value}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No CSV data available.</p>
//       )}
//     </div>
//   );
// };

// export default CreateMail;




import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../services/supabaseClient';

const CreateMail = () => {
  const location = useLocation();
  const csvData = location.state?.csvData || []; // Retrieve CSV data passed during navigation
  const [subject, setSubject] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [scheduleTime, setScheduleTime] = useState(''); // For scheduling emails
  const [status, setStatus] = useState('');
  const [senderEmail, setSenderEmail] = useState(''); // To store the logged-in user's email

  // Fetch the logged-in user's email from Supabase
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setSenderEmail(user.email); // Set the sender email
      } else if (error) {
        console.error('Error fetching user email:', error.message);
      }
    };
    fetchUserEmail();
  }, []);

  const handleGenerate = async () => {
    if (!subject || !prompt) {
      setStatus('Please fill in both subject and prompt!');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/generate-email', {
        subject,
        prompt,
      });

      if (response.data.success) {
        setGeneratedEmail(response.data.email);
        setStatus('Email generated successfully!');
      } else {
        setStatus('Failed to generate email.');
      }
    } catch (error) {
      console.error('Error generating email:', error);
      setStatus('Error occurred while generating email.');
    }
  };

  const handleSend = async () => {
    if (!generatedEmail) {
      setStatus('Please generate or edit the email before sending!');
      return;
    }
  
    if (!senderEmail) {
      setStatus('Sender email is not available.');
      return;
    }
  
    const recipients = csvData.map((row) => row.Email); // Extract recipient emails from CSV
  
    let formattedScheduleTime = null;
  
    if (scheduleTime) {
      const localDate = new Date(scheduleTime); // Convert `datetime-local` input to a Date object
      formattedScheduleTime = localDate.toISOString(); // Convert to ISO 8601 format
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/send-email', {
        from: senderEmail, // Use the logged-in user's email
        to: recipients,
        subject,
        text: generatedEmail,
        schedule_time: formattedScheduleTime, // Send the properly formatted time
      });
  
      if (response.data.success) {
        const { successful_emails, failed_emails } = response.data;
        setStatus(
          `Emails sent successfully to ${successful_emails.length} recipients. Failed for ${failed_emails.length} recipients.`
        );
      } else {
        setStatus('Failed to send emails.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('Error occurred while sending emails.');
    }
  };
  
  return (
    <div>
      <h2>Create and Send Email</h2>
      <div>
        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>
      <div>
        <label>Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter email prompt (e.g., details or context)"
        />
      </div>
      <div>
        <label>Schedule Time (UTC):</label>
        <input
          type="datetime-local"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          placeholder="Enter schedule time (optional)"
        />
      </div>
      <button onClick={handleGenerate}>Generate Email</button>
      <div>
        <label>Generated Email:</label>
        <textarea
          value={generatedEmail}
          onChange={(e) => setGeneratedEmail(e.target.value)}
          placeholder="Generated email will appear here"
        />
      </div>
      <button onClick={handleSend}>Send Emails</button>
      {status && <p>{status}</p>}

      <h3>Uploaded CSV Data:</h3>
      {csvData.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(csvData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No CSV data available.</p>
      )}
    </div>
  );
};

export default CreateMail;
