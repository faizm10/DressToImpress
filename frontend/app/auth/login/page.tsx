import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#FFC429] p-6 md:p-10">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left side - Welcome message */}
        <div className="flex flex-col justify-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-[#E51937]">
              Welcome to Dress For Success
            </h1>
            <p className="text-lg text-black">
              Your one-stop platform for professional attire management and donations.
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
