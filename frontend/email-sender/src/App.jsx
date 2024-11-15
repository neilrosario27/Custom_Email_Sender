
// import { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { supabase } from "./services/supabaseClient";
// import Navbar from "./components/Navbar";
// import Auth from "./components/Auth";
// import FileUpload from "./components/FileUpload";
// import Register from "./components/Register";
// import Dashboard from "./components/Dashboard";
// import CreateMail from "./components/CreateMail";
// // import SendEmail from "./components/SendEmail"; // Import the new SendEmail component

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const getUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     getUser();

//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   const handleSignOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Error signing out:", error.message);
//     } else {
//       setUser(null);
//     }
//   };

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <Navbar user={user} handleSignOut={handleSignOut} />
//         <Routes>
//           <Route
//             path="/"
//             element={
//               user ? (
//                 <Navigate to="/upload" />
//               ) : (
//                 <h2 className="text-center mt-6">
//                   Welcome to Email Sender App
//                 </h2>
//               )
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               user ? <Navigate to="/upload" /> : <Auth setUser={setUser} />
//             }
//           />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/upload"
//             element={
//               user ? <FileUpload userId={user.id} /> : <Navigate to="/login" />
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               user ? <Dashboard userId={user.id} /> : <Navigate to="/login" />
//             }
//           />
//           {/* New Route for CreateMail */}
//           <Route
//             path="/create-mail"
//             element={
//               user ? (
//                 <CreateMail userId={user.id} userEmail={user.email} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./services/supabaseClient";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import FileUpload from "./components/FileUpload";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateMail from "./components/CreateMail";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar at the top */}
        <Navbar user={user} handleSignOut={handleSignOut} />

        {/* Main content */}
        <div className="flex flex-col items-center mt-16 px-4">

          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/upload" />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 max-w-md">
                      Welcome to the Email Sender App! Log in or register to
                      start sending emails efficiently.
                    </p>
                  </div>
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/upload" />
                ) : (
                  <Auth setUser={setUser} />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/upload"
              element={
                user ? (
                  <FileUpload userId={user.id} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard userId={user.id} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/create-mail"
              element={
                user ? (
                  <CreateMail userId={user.id} userEmail={user.email} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
