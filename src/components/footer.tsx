export default function Footer() {
  return (
    <footer className="py-8 bg-[#0A0F18] border-t border-[#243447]/50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          &copy; 2026 AegisCode by Kevin Hsieh. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
