const SideMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Side Menu - Slides in from right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-30 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-gray-900 hover:text-gray-600 transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Menu Content */}
        <nav className="flex flex-col space-y-8 px-8 pt-24">
          <a
            href="#home"
            className="text-gray-900 text-lg font-medium hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            Home
          </a>
          <a
            href="#feedback"
            className="text-gray-900 text-lg font-medium hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            About
          </a>
          <a
            href="#features"
            className="text-gray-900 text-lg font-medium hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            Services
          </a>
          <a
            href="#contact"
            className="text-gray-900 text-lg font-medium hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            Contact
          </a>
        </nav>
      </div>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-20"
        />
      )}
    </>
  );
};

export default SideMenu;
