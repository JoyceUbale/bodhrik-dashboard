"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = () => {
    document.cookie =
      "user_authenticated=; path=/; max-age=0; SameSite=Lax";

    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="rounded bg-red-600 px-4 py-2 text-white"
    >
      Logout
    </button>
  );
}