import { LoginForm } from '../features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative">
      {/* Background radial gradient for premium look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1)_0,transparent_100%)] pointer-events-none" />
      
      <main className="z-10 w-full flex justify-center">
        <LoginForm />
      </main>
    </div>
  );
}
