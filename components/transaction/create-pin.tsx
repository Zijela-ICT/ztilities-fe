import { FormEvent, useEffect, useState } from "react";
import { LabelInputComponent } from "../input-container";
import createAxiosInstance from "@/utils/api";
import { MyLoaderFinite } from "../loader-components";
import { toast } from "react-toastify"; // Make sure react-toastify is installed
import { useDataPermission } from "@/context";

interface ManagePinProps {
  setModalState: (state: any) => void;
  activeRowId?: number | string;
  setSuccessState?: (state: any) => void;
  type?: string;
}

type Method = "create" | "change" | "forgot";

export default function ManagePin({
  setModalState,
  activeRowId,
  setSuccessState,
  type,
}: ManagePinProps) {
  const axiosInstance = createAxiosInstance();
  const { user } = useDataPermission();
  const [selectedMethod, setSelectedMethod] = useState<Method>(
    user.hasPin === false ? "create" : "change"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [forgotPinSuccess, setForgotPinSuccess] = useState<boolean>(false);

  // Common form state for all PIN methods.
  // Only relevant fields will be used based on selectedMethod.
  const [formData, setFormData] = useState({
    // For creating a PIN
    pin: "",
    confirmPin: "",
    // For changing a PIN
    oldPin: "",
    newPin: "",
    confirmNewPin: "",
    // For forgot PIN
    email: "",
    forgotNewPin: "",
    token: "",
  });

  useEffect(() => {
    setFormData({ ...formData, email: user.email });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation: Check if PIN and its confirmation match
    if (selectedMethod === "create" && formData.pin !== formData.confirmPin) {
      toast.warning("PINs do not match");
      return;
    }

    if (
      selectedMethod === "change" &&
      formData.newPin !== formData.confirmNewPin
    ) {
      toast.warning("New PINs do not match");
      return;
    }

    setLoading(true);

    try {
      if (selectedMethod === "create") {
        const payload = {
          pin: formData.pin,
        };
        await axiosInstance.patch(`/users/pin/add`, payload);
        setSuccessState?.({
          title: "Successful",
          detail: `Pin created successfully`,
          status: true,
        });
        setModalState("");
      } else if (selectedMethod === "change") {
        const payload = {
          oldPin: formData.oldPin,
          pin: formData.newPin,
        };
        await axiosInstance.patch(`/users/pin/change`, payload);
        setSuccessState?.({
          title: "Successful",
          detail: `Pin changed successfully`,
          status: true,
        });
        setModalState("");
      } else if (selectedMethod === "forgot") {
        if (forgotPinSuccess) {
          // Payload for recovering a forgotten PIN
          const payload = {
            pin: formData.forgotNewPin,
            token: formData.token,
          };
          const response = await axiosInstance.patch(
            `/users/pin/reset`,
            payload
          );

          setSuccessState?.({
            title: "Successful",
            detail: `${response.data.message}`,
            status: true,
          });
          setModalState("");
        } else {
          const response = await axiosInstance.patch(`/users/pin/forget`);
          setForgotPinSuccess(true);
          setSuccessState?.({
            title: "Successful",
            detail: `${response.data.message}`,
            status: true,
          });
        }
      }
    } catch (error) {
      console.error(error);
      // Optionally, you could show another toast for the error.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <MyLoaderFinite height="h-[50vh]" />
      ) : (
        <>
          {/* Navigation Tabs */}
          <div className="flex my-4 px-6 space-x-4">
            {user.hasPin === false && (
              <button
                type="button"
                onClick={() => setSelectedMethod("create")}
                className={`px-4 py-2 rounded-md ${
                  selectedMethod === "create"
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Create PIN
              </button>
            )}

            {user.hasPin === true && (
              <button
                type="button"
                onClick={() => setSelectedMethod("change")}
                className={`px-4 py-2 rounded-md ${
                  selectedMethod === "change"
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Change PIN
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedMethod("forgot")}
              className={`px-4 py-2 rounded-md ${
                selectedMethod === "forgot"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Forgot PIN
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 px-6 max-w-full pb-12">
            {selectedMethod === "create" && user.hasPin === false && (
              <>
                <LabelInputComponent
                  type="password"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  label="Enter New PIN"
                  maxLength={4}
                  required
                />
                <LabelInputComponent
                  type="password"
                  name="confirmPin"
                  value={formData.confirmPin}
                  onChange={handleChange}
                  label="Confirm New PIN"
                  maxLength={4}
                  required
                />
              </>
            )}

            {selectedMethod === "change" && user.hasPin === true && (
              <>
                <LabelInputComponent
                  type="password"
                  name="oldPin"
                  value={formData.oldPin}
                  onChange={handleChange}
                  label="Old PIN"
                  maxLength={4}
                  required
                />
                <LabelInputComponent
                  type="password"
                  name="newPin"
                  value={formData.newPin}
                  onChange={handleChange}
                  label="New PIN"
                  maxLength={4}
                  required
                />
                <LabelInputComponent
                  type="password"
                  name="confirmNewPin"
                  value={formData.confirmNewPin}
                  onChange={handleChange}
                  label="Confirm New PIN"
                  maxLength={4}
                  required
                />
              </>
            )}

            {selectedMethod === "forgot" && (
              <>
                <LabelInputComponent
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Enter your Email"
                  readOnly
                  required
                />

                {forgotPinSuccess && (
                  <>
                    <LabelInputComponent
                      type="password"
                      name="forgotNewPin"
                      value={formData.forgotNewPin}
                      onChange={handleChange}
                      label="New PIN"
                      maxLength={4}
                      required
                    />
                    <LabelInputComponent
                      type="text"
                      name="token"
                      value={formData.token}
                      onChange={handleChange}
                      label="Enter token you got from your email"
                      required
                    />
                  </>
                )}
              </>
            )}

            <div className="mt-10 flex w-full justify-end">
              <button
                type="submit"
                className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
              >
                {selectedMethod === "change"
                  ? "Change PIN"
                  : selectedMethod === "create"
                  ? "Create PIN"
                  : "Recover PIN"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
