import { Icon } from "@iconify/react";

export default function AuthSocial() {
  return (
    <>
      <div className="flex gap-4">
        <button
          type="button"
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Icon icon="devicon:google" fontSize={20} />
          Google
        </button>
        <button
          type="button"
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Icon icon="devicon:apple" fontSize={20} />
          Apple
        </button>
      </div>
    </>
  );
}
