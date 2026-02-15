"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

type Props = {
  name?: string | null;
  email: string;
  role: string;
};

export default function UserDropdown({ name, email, role }: Props) {
  const [open, setOpen] = useState(false);

  const initial =
    name?.trim().charAt(0).toUpperCase() ??
    email.charAt(0).toUpperCase();

  return (
    <div className="position-relative">
      <button
        className="btn btn-outline-light rounded-circle fw-bold d-flex align-items-center justify-content-center"
        style={{ width: 40, height: 40 }}
        onClick={() => setOpen((v) => !v)}
      >
        {initial}
      </button>

      {open && (
        <div
          className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
          style={{
            minWidth: 260,
            maxWidth: "90vw",
            zIndex: 1050,
          }}
        >
          <div className="px-3 py-2 border-bottom">
            <div className="fw-bold text-truncate">
              {name}
            </div>
            <div className="small text-muted text-truncate">
              {email}
            </div>
            <span className="badge bg-secondary mt-1">
              {role}
            </span>
          </div>

          <div className="p-2">
            <button
              className="btn btn-danger btn-sm w-100"
              onClick={() =>
                signOut({ callbackUrl: "/login" })
              }
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

