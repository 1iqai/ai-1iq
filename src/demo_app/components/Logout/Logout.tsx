// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../../hooks/useAuth';

const LogoutButton = () => {
 // const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(false);
 // const { logout } = useAuth();
 // const [count, setCount] = useState(0);

  // const handleConfirmLogout = async (toastId: string) => {
  //  // setIsLoading(true);
  //   toast.dismiss(toastId);

  //   try {
  //     logout();
  //     setCount(0)
  //     localStorage.removeItem("token")

  //     navigate("/login");
  //   } catch (error) {
  //     console.log(error);
  //     localStorage.removeItem("token")
  //     toast.error('Logout failed. Please try again.', {
  //       position: 'top-right',
  //     });
  //   } finally {
  //     // setIsLoading(false);
  //   }
  // };

  // const handleLogoutClick = () => {
  //   if (count === 1)
  //     return null;
  //   setCount(1);
  //   toast.custom((t) => (
  //     <div
  //       className={`${t.visible ? 'animate-slide-in-right' : 'animate-slide-out-right'
  //         } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700`}
  //     >
  //       <div className="flex-1 w-0 p-4">
  //         <div className="flex items-start">
  //           <div className="flex-shrink-0">
  //             <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
  //               <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
  //             </div>
  //           </div>
  //           <div className="ml-3 flex-1">
  //             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
  //               Confirm Logout
  //             </p>
  //             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
  //               Are you sure you want to sign out?
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex border-l border-gray-200 dark:border-gray-700">
  //         <button
  //           onClick={() => handleConfirmLogout(t.id)}
  //           className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
  //         >
  //           <Check className="w-4 h-4 mr-1" />
  //           Yes
  //         </button>
  //       </div>
  //       <div className="flex border-l border-gray-200 dark:border-gray-700">
  //         <button
  //           onClick={() => { setCount(0); return toast.dismiss(t.id) }}
  //           className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
  //         >
  //           <X className="w-4 h-4 mr-1" />
  //           No
  //         </button>
  //       </div>
  //     </div>
  //   ), {
  //     duration: Infinity, // Keep the custom toast visible until dismissed
  //     position: 'top-right',
  //   });
  // };

  return (
    <>
      {/* <Toaster /> */}
      {/* <button
        onClick={handleLogoutClick}
        disabled={isLoading}
        className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl  text-red-600 hover:text-red-700   border border-transparent shadow-sm hover:shadow-md  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 "
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Logging out...
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4" />
            Logout
          </>
        )}
      </button> */}
    </>
  );
};

export default LogoutButton;