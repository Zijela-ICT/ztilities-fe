import { useEffect, useState, useRef, JSX } from "react";
import Link from "next/link";
import createAxiosInstance from "@/utils/api";
import moment from "moment";
import ModalCompoenent from "./modal-component";

interface Notification {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  updatedAt: string;
}

interface NotificationCardProps {
  onClose?: () => void;
}

export default function NotificationCard({ onClose }: NotificationCardProps) {
  const axiosInstance = createAxiosInstance();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [centralState, setCentralState] = useState<string>();
  const containerRef = useRef<HTMLDivElement>(null);

  const getNotifications = async () => {
    const response = await axiosInstance.get(
      `/notifications/my-notifications/all/unread`
    );
    setNotifications(response.data.data);
  };

  useEffect(() => {
    getNotifications();
  }, [centralState]);

  const latestNotifications = notifications?.slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const [notification, setANotification] = useState<Notification>();
  const getANotif = async () => {
    const response = await axiosInstance.get(`/notifications/${activeRowId}`);
    setANotification(response.data.data || {});
  };

  useEffect(() => {
    if (centralState === "viewNotif") {
      getANotif();
    }
  }, [centralState]);

  const componentMap: Record<string, JSX.Element> = {
    viewNotif: (
      <div className="bg-white rounded-lg p-2 pb-8 transition m-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">
            {notification?.content}
          </div>
        </div>
        <div className="mt-2 text-sm text-green-700">
          <span className="font-medium">Read at: </span>
          {notification
            ? moment.utc(notification.updatedAt).format("llll")
            : ""}
        </div>
      </div>
    ),
  };

  return (
    <>
      <ModalCompoenent
        title={"Notification"}
        detail={"Read Notification"}
        modalState={centralState}
        setModalState={() => {
          setCentralState("");
          setActiveRowId(null);
        }}
      >
        {componentMap[centralState]}
      </ModalCompoenent>

      <div
        ref={containerRef}
        className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-2xl p-4 z-50 "
      >
        <h2 className="text-lg font-bold mb-2">Notifications</h2>
        {latestNotifications.length > 0 ? (
          <ul>
            {latestNotifications.map((notification) => (
              <li
                key={notification.id}
                className="flex items-center border-b py-2 "
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 mr-2 transition-colors duration-300 ${
                    notification.isRead ? "bg-green-500" : "bg-blue-500"
                  }`}
                ></span>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {notification.content}
                  </div>
                  <div className="text-xs text-gray-500">
                    {moment.utc(notification.createdAt).format("ll")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No notifications</p>
        )}

        {latestNotifications.length > 0 && (
          <div className="mt-2 text-center">
            <Link href="/notification">
              <p className="text-[#A8353A] ">Read notifications</p>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
