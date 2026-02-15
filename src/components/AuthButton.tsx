"use client";

import { useSession, signIn } from "next-auth/react";
import UserDropdown from "./UserDropDown";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // or spinner
  }

  if (!session?.user) {
    return (
      <button
        className="btn btn-outline-light btn-sm"
        onClick={() => signIn("google")}
      >
        Login
      </button>
    );
  }

  return (
    <UserDropdown
      name={session.user.name}
      email={session.user.email ?? ""}
      role="User"
    />
  );
}
