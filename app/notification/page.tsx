"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout-component";
import withPermissions from "@/components/auth/permission-protected-routes";
import createAxiosInstance from "@/utils/api";

interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

function NotificationPage() {
  const axiosInstance = createAxiosInstance();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const dummyNotifications: Notification[] = [
      {
        id: 1,
        title: "Your order has been shipped",
        time: "Feb 27, 2025 10:00 AM",
        read: false,
      },
      {
        id: 2,
        title: "Password successfully changed",
        time: "Feb 27, 2025 11:00 AM",
        read: false,
      },
      {
        id: 3,
        title: "New login from Chrome",
        time: "Feb 27, 2025 02:00 PM",
        read: false,
      },
      {
        id: 4,
        title: "Subscription expiring soon",
        time: "Feb 26, 2025 06:00 PM",
        read: false,
      },
      {
        id: 5,
        title: "Message from support",
        time: "Feb 26, 2025 11:00 AM",
        read: false,
      },
      {
        id: 6,
        title: "Weekly newsletter",
        time: "Feb 25, 2025 09:00 AM",
        read: false,
      },
      {
        id: 7,
        title: "Discount offer available",
        time: "Feb 25, 2025 12:00 PM",
        read: false,
      },
      {
        id: 8,
        title: "Update your profile",
        time: "Feb 24, 2025 03:00 PM",
        read: false,
      },
      {
        id: 9,
        title: "Security alert",
        time: "Feb 24, 2025 05:00 PM",
        read: false,
      },
      {
        id: 10,
        title: "New comment on your post",
        time: "Feb 23, 2025 08:00 AM",
        read: false,
      },
      {
        id: 11,
        title: "Your subscription renewed",
        time: "Feb 23, 2025 10:00 AM",
        read: false,
      },
      {
        id: 12,
        title: "Event reminder",
        time: "Feb 22, 2025 02:00 PM",
        read: false,
      },
      {
        id: 13,
        title: "Friend request accepted",
        time: "Feb 22, 2025 04:00 PM",
        read: false,
      },
      {
        id: 14,
        title: "Password reset request",
        time: "Feb 21, 2025 09:30 AM",
        read: false,
      },
      {
        id: 15,
        title: "New feature available",
        time: "Feb 21, 2025 11:00 AM",
        read: false,
      },
      {
        id: 16,
        title: "Account activity report",
        time: "Feb 20, 2025 01:00 PM",
        read: false,
      },
      {
        id: 17,
        title: "Feedback request",
        time: "Feb 20, 2025 03:00 PM",
        read: false,
      },
      {
        id: 18,
        title: "Security update",
        time: "Feb 19, 2025 10:00 AM",
        read: false,
      },
      {
        id: 19,
        title: "Maintenance notice",
        time: "Feb 19, 2025 12:00 PM",
        read: false,
      },
      {
        id: 20,
        title: "Survey invitation",
        time: "Feb 18, 2025 04:00 PM",
        read: false,
      },
    ];
    setNotifications(dummyNotifications);
  }, []);

  // Group notifications by day 
  const groupedNotifications = notifications.reduce(
    (acc: Record<string, Notification[]>, notification) => {
      const dateKey = new Date(notification.time).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(notification);
      return acc;
    },
    {}
  );

  // Mark a notification as read when hovered.
  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Sort dates,  so that eh, the latest day appears first.
  const sortedDates = Object.keys(groupedNotifications).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <DashboardLayout title="Notifications" detail="All Notifications">
      <div className="relative bg-white rounded-2xl p-8">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div key={date} className="mb-6">
              <h3 className="text-md font-semibold mb-2">{date}</h3>
              <ul>
                {groupedNotifications[date].map((notification) => (
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
                      <div className="text-sm font-medium">
                        {notification.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {notification.time}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No notifications</p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default withPermissions(NotificationPage, ["notifications"]);
