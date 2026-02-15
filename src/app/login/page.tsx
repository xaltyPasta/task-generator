"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="d-flex flex-grow-1 align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: 420 }}>
        <h3 className="fw-bold mb-4 text-center">Login</h3>

        <button
          className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center py-2"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="me-2"
            style={{ width: 18 }}
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

