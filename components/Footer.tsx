export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80  py-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} AI Chatbot Builder. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-400 transition">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
