import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#121821",
            color: "#e6edf3",
            border: "1px solid #232e3c",
            fontSize: "14px",
          },
          error: { iconTheme: { primary: "#f87a8a", secondary: "#121821" } },
        }}
      />
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
