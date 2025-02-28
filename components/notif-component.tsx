import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

interface NotificationCardProps {
  onClose?: () => void;
}

export default function NotificationCard({ onClose }: NotificationCardProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // For demo purposes, we set dummy notifications.
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "Your order has been shipped",
        time: "Feb 27, 2025 10:00 AM",
        read: false,
      },
      {
        id: 2,
        title: "Password successfully changed",
        time: "Feb 26, 2025 08:00 AM",
        read: false,
      },
      {
        id: 3,
        title: "New login from Chrome",
        time: "Feb 25, 2025 02:00 PM",
        read: false,
      },
      {
        id: 4,
        title: "Subscription expiring soon",
        time: "Feb 24, 2025 06:00 PM",
        read: false,
      },
      {
        id: 5,
        title: "Message from support",
        time: "Feb 23, 2025 11:00 AM",
        read: false,
      },
    ]);
  }, []);

  // Display only the latest five notifications.
  const latestNotifications = notifications.slice(0, 5);

  // Mark notification as read when hovered.
  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

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

  return (
    <div
      ref={containerRef}
      className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-2xl p-4 z-50"
    >
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {latestNotifications.length > 0 ? (
        <ul>
          {latestNotifications.map((notification) => (
            <li
              key={notification.id}
              className="flex items-center border-b py-2"
              onMouseEnter={() => markNotificationAsRead(notification.id)}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 transition-colors duration-300 ${
                  notification.read ? "bg-green-500" : "bg-blue-500"
                }`}
              ></span>
              <div>
                <div className="text-sm font-medium">{notification.title}</div>
                <div className="text-xs text-gray-500">{notification.time}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No notifications</p>
      )}
      <div className="mt-2 text-center">
        <Link href="/notification">
          <p className="text-[#A8353A] ">See all notifications</p>
        </Link>
      </div>
    </div>
  );
}
