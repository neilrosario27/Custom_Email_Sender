

// import { Link } from "react-router-dom";

// const Navbar = ({ user, handleSignOut }) => {
//   return (
//     <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
//       {/* Navbar Title */}
//       <h1 className="text-2xl font-bold">
//         <Link to="/" className="hover:text-blue-400 transition duration-300">
//           Email Sender
//         </Link>
//       </h1>

//       {/* Navbar Links */}
//       <div className="flex items-center space-x-4">
//         {!user ? (
//           <>
//             <Link
//               to="/login"
//               className="px-4 py-2 border border-blue-500 text-blue-500 bg-gray-800 hover:bg-blue-500 hover:text-white rounded transition duration-300"
//             >
//               Sign In
//             </Link>
//             <Link
//               to="/register"
//               className="px-4 py-2 border border-green-500 text-green-500 bg-gray-800 hover:bg-green-500 hover:text-white rounded transition duration-300"
//             >
//               Register
//             </Link>
//           </>
//         ) : (
//           <>
//             <Link
//               to="/upload"
//               className="px-4 py-2 border border-purple-500 text-purple-500 bg-gray-800 hover:bg-purple-500 hover:text-white rounded transition duration-300"
//             >
//               Upload
//             </Link>
//             <Link
//               to="/dashboard"
//               className="px-4 py-2 border border-indigo-500 text-indigo-500 bg-gray-800 hover:bg-indigo-500 hover:text-white rounded transition duration-300"
//             >
//               Dashboard
//             </Link>
//             <button
//               onClick={handleSignOut}
//               className="px-4 py-2 border border-red-500 text-red-500 bg-gray-800 hover:bg-red-500 hover:text-white rounded transition duration-300"
//             >
//               Sign Out
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { Link } from "react-router-dom";

const Navbar = ({ user, handleSignOut }) => {
  return (
    <nav
      style={{
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Navbar Title */}
      <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
        <Link
          to="/"
          style={{
            color: "#4f83cc",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.target.style.color = "#2c64a1")}
          onMouseOut={(e) => (e.target.style.color = "#4f83cc")}
        >
          Email Sender
        </Link>
      </h1>

      {/* Navbar Links */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link
              to="/login"
              style={{
                padding: "8px 16px",
                border: "1px solid #007BFF",
                color: "#007BFF",
                backgroundColor: "#333",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#007BFF";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#333";
                e.target.style.color = "#007BFF";
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              style={{
                padding: "8px 16px",
                border: "1px solid #28a745",
                color: "#28a745",
                backgroundColor: "#333",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#28a745";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#333";
                e.target.style.color = "#28a745";
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/upload"
              style={{
                padding: "8px 16px",
                border: "1px solid #6f42c1",
                color: "#6f42c1",
                backgroundColor: "#333",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#6f42c1";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#333";
                e.target.style.color = "#6f42c1";
              }}
            >
              Upload
            </Link>
            <Link
              to="/dashboard"
              style={{
                padding: "8px 16px",
                border: "1px solid #6610f2",
                color: "#6610f2",
                backgroundColor: "#333",
                borderRadius: "4px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#6610f2";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#333";
                e.target.style.color = "#6610f2";
              }}
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                padding: "8px 16px",
                border: "1px solid #dc3545",
                color: "#dc3545",
                backgroundColor: "#333",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#dc3545";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#333";
                e.target.style.color = "#dc3545";
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
