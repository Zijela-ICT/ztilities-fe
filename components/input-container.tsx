import { UploadIcon } from "@/utils/svg";

interface InputProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  className?: string;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  onClick?: any;
  show?: boolean;
  toggleView?: boolean;
  name?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputComponent({
  onChange,
  name,
  value,
  className = "mt-4",
  type = "text",
  placeholder,
  onClick,
  show,
  toggleView,
  onKeyDown,
}: InputProps) {
  return (
    <>
      <div className="relative mb-2">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`${className} w-full h-14 px-4 pr-10 border rounded-lg bg-gray-100 font-bold text-base text-gray-400 text-sm placeholder-gray-400  focus:outline-none`}
        />

        {show && (
          <>
            {toggleView ? (
              <svg
                onClick={onClick}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.606096 0.0808672C1.11373 -0.136688 1.7016 0.0984632 1.91916 0.606093L1.00001 1.00001C1.91916 0.606093 1.9193 0.606419 1.91916 0.606093L1.91864 0.604892C1.91836 0.604244 1.91857 0.604717 1.91864 0.604892L1.92256 0.613759C1.92657 0.622772 1.93345 0.63809 1.94325 0.659293C1.96284 0.701714 1.99403 0.767593 2.03702 0.85358C2.12308 1.0257 2.256 1.27747 2.43743 1.58228C2.80143 2.1938 3.35445 3.00825 4.10781 3.81956C4.28538 4.01079 4.4733 4.2011 4.67179 4.38806C4.68009 4.3956 4.68829 4.40331 4.6964 4.41117C6.18108 5.80141 8.25233 7.00001 11 7.00001C12.209 7.00001 13.2784 6.7692 14.2209 6.3982C15.447 5.91563 16.4746 5.18913 17.3156 4.39972C18.2653 3.50839 18.9628 2.55005 19.4233 1.81101C19.6526 1.44292 19.8207 1.13319 19.9299 0.9191C19.9845 0.812168 20.0241 0.729438 20.0492 0.67562C20.0617 0.648721 20.0706 0.62908 20.0759 0.617286L20.0809 0.606093C20.2986 0.0987399 20.8864 -0.136631 21.3939 0.0808672C21.9016 0.298423 22.1367 0.886302 21.9192 1.39393L21 1.00001C21.9192 1.39393 21.9193 1.3937 21.9192 1.39393L21.917 1.39895L21.9134 1.40718L21.902 1.43302C21.8925 1.45435 21.8791 1.48378 21.8619 1.52072C21.8274 1.59458 21.7775 1.69856 21.7116 1.82775C21.5799 2.08591 21.384 2.44609 21.1207 2.86869C20.7181 3.51484 20.1521 4.31621 19.4097 5.1243L20.2071 5.92174C20.5976 6.31227 20.5976 6.94543 20.2071 7.33596C19.8166 7.72648 19.1834 7.72648 18.7929 7.33596L17.9527 6.49578C17.3885 6.95152 16.757 7.38138 16.0558 7.75221L16.8382 8.95463C17.1394 9.41754 17.0083 10.037 16.5454 10.3382C16.0825 10.6394 15.463 10.5083 15.1618 10.0454L14.1764 8.53088C13.4974 8.73902 12.772 8.88653 12 8.95568V10.5C12 11.0523 11.5523 11.5 11 11.5C10.4477 11.5 10 11.0523 10 10.5V8.95582C9.22537 8.88662 8.5002 8.73881 7.8234 8.53128L6.8382 10.0454C6.53699 10.5083 5.91755 10.6394 5.45463 10.3382C4.99171 10.037 4.86062 9.41754 5.16183 8.95463L5.94423 7.75218C5.24411 7.38164 4.61252 6.95179 4.04752 6.49556L3.20712 7.33596C2.8166 7.72648 2.18343 7.72648 1.79291 7.33596C1.40238 6.94543 1.40238 6.31227 1.79291 5.92174L2.59035 5.1243C1.74536 4.20455 1.12778 3.29225 0.718847 2.60525C0.509658 2.25381 0.35351 1.9587 0.248166 1.74801C0.195456 1.64259 0.155351 1.55808 0.127582 1.49796C0.113695 1.46789 0.102881 1.4439 0.0951097 1.42643L0.085725 1.40514L0.082733 1.39826L0.0816605 1.39577L0.08123 1.39477C0.081044 1.39434 0.0808698 1.39393 1.00001 1.00001L0.08123 1.39477C-0.136326 0.887141 0.0984657 0.298423 0.606096 0.0808672Z"
                  fill="#637381"
                />
              </svg>
            ) : (
              <svg
                onClick={onClick}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.606096 0.0808672C1.11373 -0.136688 1.7016 0.0984632 1.91916 0.606093L1.00001 1.00001C1.91916 0.606093 1.9193 0.606419 1.91916 0.606093L1.91864 0.604892C1.91836 0.604244 1.91857 0.604717 1.91864 0.604892L1.92256 0.613759C1.92657 0.622772 1.93345 0.63809 1.94325 0.659293C1.96284 0.701714 1.99403 0.767593 2.03702 0.85358C2.12308 1.0257 2.256 1.27747 2.43743 1.58228C2.80143 2.1938 3.35445 3.00825 4.10781 3.81956C4.28538 4.01079 4.4733 4.2011 4.67179 4.38806C4.68009 4.3956 4.68829 4.40331 4.6964 4.41117C6.18108 5.80141 8.25233 7.00001 11 7.00001C12.209 7.00001 13.2784 6.7692 14.2209 6.3982C15.447 5.91563 16.4746 5.18913 17.3156 4.39972C18.2653 3.50839 18.9628 2.55005 19.4233 1.81101C19.6526 1.44292 19.8207 1.13319 19.9299 0.9191C19.9845 0.812168 20.0241 0.729438 20.0492 0.67562C20.0617 0.648721 20.0706 0.62908 20.0759 0.617286L20.0809 0.606093C20.2986 0.0987399 20.8864 -0.136631 21.3939 0.0808672C21.9016 0.298423 22.1367 0.886302 21.9192 1.39393L21 1.00001C21.9192 1.39393 21.9193 1.3937 21.9192 1.39393L21.917 1.39895L21.9134 1.40718L21.902 1.43302C21.8925 1.45435 21.8791 1.48378 21.8619 1.52072C21.8274 1.59458 21.7775 1.69856 21.7116 1.82775C21.5799 2.08591 21.384 2.44609 21.1207 2.86869C20.7181 3.51484 20.1521 4.31621 19.4097 5.1243L20.2071 5.92174C20.5976 6.31227 20.5976 6.94543 20.2071 7.33596C19.8166 7.72648 19.1834 7.72648 18.7929 7.33596L17.9527 6.49578C17.3885 6.95152 16.757 7.38138 16.0558 7.75221L16.8382 8.95463C17.1394 9.41754 17.0083 10.037 16.5454 10.3382C16.0825 10.6394 15.463 10.5083 15.1618 10.0454L14.1764 8.53088C13.4974 8.73902 12.772 8.88653 12 8.95568V10.5C12 11.0523 11.5523 11.5 11 11.5C10.4477 11.5 10 11.0523 10 10.5V8.95582C9.22537 8.88662 8.5002 8.73881 7.8234 8.53128L6.8382 10.0454C6.53699 10.5083 5.91755 10.6394 5.45463 10.3382C4.99171 10.037 4.86062 9.41754 5.16183 8.95463L5.94423 7.75218C5.24411 7.38164 4.61252 6.95179 4.04752 6.49556L3.20712 7.33596C2.8166 7.72648 2.18343 7.72648 1.79291 7.33596C1.40238 6.94543 1.40238 6.31227 1.79291 5.92174L2.59035 5.1243C1.74536 4.20455 1.12778 3.29225 0.718847 2.60525C0.509658 2.25381 0.35351 1.9587 0.248166 1.74801C0.195456 1.64259 0.155351 1.55808 0.127582 1.49796C0.113695 1.46789 0.102881 1.4439 0.0951097 1.42643L0.085725 1.40514L0.082733 1.39826L0.0816605 1.39577L0.08123 1.39477C0.081044 1.39434 0.0808698 1.39393 1.00001 1.00001L0.08123 1.39477C-0.136326 0.887141 0.0984657 0.298423 0.606096 0.0808672Z"
                  fill="#637381"
                />
              </svg>
            )}
          </>
        )}
      </div>
    </>
  );
}

interface LabelInputProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name: string;
  className?: string;
  type: string;
  placeholder?: string;
  label: string;
  readOnly?: boolean;
  required?: boolean;
  maxLength? : number
}

export function LabelInputComponent({
  onChange,
  value,
  name,
  className,
  type = "text",
  label,
  readOnly,
  maxLength,
  required,
}: LabelInputProps) {
  return (
    <>
      <div className="relative w-full mt-6"> 
      <input
        type={type}
        name={name}
        placeholder=""
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        className="peer w-full rounded-lg px-4 pt-6 pb-2 text-base text-gray-900 outline-none bg-gray-100"
      />
      <label className="absolute left-4 top-2 text-gray-600 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:top-2  ">
        {label}
      </label>
      </div>
    </>
  );
}

export function LabelTextareaComponent({
  onChange,
  value,
  name,
  className,
  label,
  readOnly,
  required,
}: {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  name: string;
  className?: string;
  label: string;
  readOnly?: boolean;
  required?: boolean;
}) {
  return (
    <div className="relative w-full">
      <div className="w-full bg-gray-100 rounded-t-lg pt-3">
        <label className=" pl-4 text-gray-600 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:top-2">
          {label}
        </label>
      </div>
      <textarea
        name={name}
        placeholder=" "
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        className={`peer w-full rounded-b-lg px-4 pt-0 pb-2 text-base text-gray-900 outline-none bg-gray-100 resize-y ${className}`}
      />
      {/* <label className="absolute left-4 top-2 text-gray-600 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:top-2">
        {label}
      </label> */}
    </div>
  );
}

export function FileInputComponent({
  onChange,
  name,
  label = "Upload File",
  uploadedFile,
  className,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  uploadedFile?: File | null;
  className?: string;
  name: string;
}) {
  const renderFilePreview = () => {
    if (!uploadedFile) return null;
    if (uploadedFile.type.startsWith("image/")) {
      return (
        <div className="flex flex-col items-center border rounded-lg overflow-hidden">
          <span className=" font-semibold text-lg flex items-center gap-2">
            ✔ Uploaded
          </span>
          <p className="text-gray-600 text-sm mt-2">
            Your file has been uploaded successfully!
          </p>
          {/* <img
           src={URL.createObjectURL(uploadedFile)}
           alt="Uploaded"
           className="w-32 h-32 object-cover rounded-lg"
         /> */}
        </div>
      );
    } else if (uploadedFile.type === "application/pdf") {
      return (
        <div className="flex flex-col items-center border rounded-lg overflow-hidden">
          <span className=" font-semibold text-lg flex items-center gap-2">
            ✔ Uploaded
          </span>
          <p className="text-gray-600 text-sm mt-2">
            Your file has been uploaded successfully!
          </p>
          {/* <object
            data={URL.createObjectURL(uploadedFile)}
            title="PDF Preview"
            className="w-full h-full"
          ></object> */}
        </div>
      );
    } else {
      // Fallback for unsupported types
      return (
        <div className="flex flex-col items-center border rounded-lg overflow-hidden">
          <span className=" font-semibold text-lg flex items-center gap-2">
            ✔ Uploaded
          </span>
          <p className="text-gray-600 text-sm mt-2">
            Your file has been uploaded successfully!
          </p>
        </div>
        // <div className="flex flex-col items-center justify-center w-32 h-32 bg-gray-200 rounded-lg">
        //   {/* <p className="text-gray-500 text-sm">Unsupported File</p> */}

        //   <p className="text-gray-600 text-xs">{uploadedFile.name}</p>
        // </div>
      );
    }
  };
  return (
    <div
      className={`relative w-full bg-gray-100 rounded-lg p-6 text-center ${className}`}
    >
      {uploadedFile ? (
        <div className="flex flex-col items-center">
          {renderFilePreview()}

          {/* Display File Name */}
          <p className="mt-2 text-gray-600 text-sm">{uploadedFile.name}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-4 text-gray-500">
            <UploadIcon />
          </div>
          <label
            htmlFor="file-input"
            className="block text-gray-600 text-base font-medium cursor-pointer"
          >
            {label}
          </label>
          <p className="text-gray-500 text-sm mt-2">
            Click to upload or drag and drop
          </p>
          <p className="text-gray-500 text-sm mt-2">
            SVG, PNG, JPG, or GIF (max. 800x400px)
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        name={name}
        type="file"
        id="file-input"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onChange}
      />
    </div>
  );
}

{
  /* <div className="flex flex-col items-center">
        <div className="mb-4 text-gray-500">
          <UploadIcon />
        </div>
        <label
          htmlFor="file-input"
          className="block text-gray-600 text-base font-medium cursor-pointer"
        >
          {label}
        </label>

        <p className="text-gray-500 text-sm mt-2">
          Click to upload or or drag and drop
        </p>
        <p className="text-gray-500 text-sm mt-2">
          SVG, PNG, JPG or GIF (max. 800x400px)
        </p>
      </div> */
}
