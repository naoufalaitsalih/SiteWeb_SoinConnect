import { Suspense } from "react";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminLoginHero from "@/components/admin/AdminLoginHero";

function LoginFormFallback() {
  return (
    <div className="h-[520px] w-full max-w-[480px] animate-pulse rounded-3xl bg-white shadow-[0_24px_64px_-12px_rgba(15,23,42,0.12)]" />
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[45fr_55fr]">
        <AdminLoginHero />

        <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="rounded-2xl bg-white px-4 py-2.5 shadow-md">
              <AdminBrandLogo size="md" />
            </div>
          </div>

          <Suspense fallback={<LoginFormFallback />}>
            <AdminLoginForm />
          </Suspense>
        </div>
    </div>
  );
}
