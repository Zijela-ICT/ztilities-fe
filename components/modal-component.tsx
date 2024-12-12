interface ModalProps {
  setModalState?: any;
  title: string;
  detail? : string;
  className?: string;
  modalState?: boolean;
  children?: any;
}

export default function ModalCompoenent({
  children,
  title,
  detail,
  modalState,
  setModalState,
  className
}: ModalProps) {
  return (
    <>
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          modalState ? "block" : "hidden"
        } fixed inset-0 z-50 flex justify-center items-center overflow-y-auto `}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto">
          {/* Modal content */}
          <div className="relative bg-white rounded-xl shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between pt-10 pb-2 px-4 md:px-5 rounded-t">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={() => setModalState(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
      
            <p className="text-gray-700 text-base px-5 font-thin" >{detail}</p>
    
            {/* Modal body */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
