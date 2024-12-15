import Image from "next/image";
import ButtonComponent from "./button-component";
import { CancelIcon } from "@/utils/svg";

interface ModalProps {
  setModalState?: any;
  title: string;
  detail?: string;
  className?: string;
  modalState?: boolean;
  children?: any;
  bulk?: any;
  activeRowId?: number;
}

export default function ModalCompoenent({
  children,
  title,
  detail,
  modalState,
  setModalState,
  bulk,
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
          <div
            className={`relative ${
              bulk ? "bg-[#FBFBFC]" : "bg-white"
            } rounded-xl shadow`}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between pt-10 pb-2 px-4 md:px-5 rounded-t">
              <h3 className="text-2xl font-semibold text-gray-900 ">{title}</h3>
              <button
                onClick={() => setModalState(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <div className="w-3 h-3">
                  <CancelIcon />
                </div>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <p className="text-gray-700 text-base px-5 font-thin">{detail}</p>

            {/* Modal body */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

interface ActionModalProps {
  setModalState?: any;
  title: string;
  detail?: string;
  className?: string;
  modalState?: boolean;
  children?: any;
  bulk?: any;
  takeAction?: any;
}

export function ActionModalCompoenent({
  children,
  title,
  detail,
  modalState,
  setModalState,
  bulk,
  takeAction,
}: ActionModalProps) {
  return (
    <>
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          modalState ? "block" : "hidden"
        } fixed inset-0 z-50 flex justify-center items-center overflow-y-auto bg-black bg-opacity-50`}
      >
        <div className="relative p-4 w-full max-w-lg max-h-full mx-auto">
          <div
            className={`relative ${
              bulk ? "bg-[#FBFBFC]" : "bg-white"
            } rounded-xl shadow text-center p-8`}
          >
            <div className="mb-6">
              <Image
                className=" mx-auto text-gray-400 my-16"
                src={`/assets/warning.png`}
                width={155}
                height={155}
                alt="img"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {title}
            </h3>
            <p className="text-gray-700 text-lg font-thin mb-8">{detail}</p>

            <div className="flex items-center space-x-4">
              <ButtonComponent
                text="Cancel"
                className="bg-white text-[#A8353A] border border-[#A8353A]"
                onClick={() => setModalState(false)}
              />
              <ButtonComponent
                text="Yes"
                className="text-white"
                onClick={takeAction}
              />
            </div>

            <button
              onClick={() => setModalState(false)}
              type="button"
              className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
            >
              <div className="w-3 h-3">
                <CancelIcon />
              </div>

              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function SuccessModalCompoenent({
  children,
  title,
  detail,
  modalState,
  setModalState,
  bulk,
  takeAction,
}: ActionModalProps) {
  return (
    <>
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          modalState ? "block" : "hidden"
        } fixed inset-0 z-50 flex justify-center items-center overflow-y-auto bg-black bg-opacity-50`}
      >
        <div className="relative p-4 w-full max-w-lg max-h-full mx-auto">
          <div
            className={`relative ${
              bulk ? "bg-[#FBFBFC]" : "bg-white"
            } rounded-xl shadow text-center p-8`}
          >
            <div className="mb-6">
              {/* <Image
                className=" mx-auto text-gray-400 my-16"
                src={`/assets/warning.png`}
                width={155}
                height={155}
                alt="img"
              /> */}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {title}
            </h3>
            <p className="text-gray-700 text-lg font-thin mb-8">{detail}</p>

            <div className="flex items-center">
              <ButtonComponent
                text="Done"
                className="text-white"
                onClick={() => setModalState(false)}
              />
            </div>

            <button
              onClick={() => setModalState(false)}
              type="button"
              className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
            >
              <div className="w-3 h-3">
                <CancelIcon />
              </div>

              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
