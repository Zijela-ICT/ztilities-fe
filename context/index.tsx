// "use client";

// import React, { createContext, useContext, useState, ReactNode } from "react";

// // Define the context type
// interface ContextType {
//   user: AuthUser | null;
//   userPermissions: Permission[];
//   userRoles: any[]; // Permissions should be an array
//   loading: boolean;
//   setUser: (user: AuthUser | null) => void;
//   setUserPermissions: (permissions: Permission[]) => void;
//   setUserRoles: (roles: any[]) => void;
//   setLoading: (state: boolean) => void;
//   pagination: {
//     currentPage: number;
//     pageSize: number;
//     total: number;
//     totalPages: number;
//   };
//   setPagination: React.Dispatch<
//     React.SetStateAction<{
//       currentPage: number;
//       pageSize: number;
//       total: number;
//       totalPages: number;
//     }>
//   >
// }

// // Create context with initial values
// const DataPermissionContext = createContext<ContextType | undefined>(undefined);

// // Provider component
// export const DataPermissionProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [user, setUser] = useState<AuthUser | null>(null); // User starts as null
//   const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
//   const [userRoles, setUserRoles] = useState<any[]>([]); // Permissions start as an empty array
//   const [loading, setLoading] = useState<boolean>(false);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     pageSize: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   return (
//     <DataPermissionContext.Provider
//       value={{
//         user,
//         userPermissions,
//         userRoles,
//         setUser,
//         setUserPermissions,
//         setUserRoles,
//         loading,
//         setLoading,
//         pagination,
//         setPagination,
//       }}
//     >
//       {children}
//     </DataPermissionContext.Provider>
//   );
// };

// // Custom hook for consuming the context
// export const useDataPermission = () => {
//   const context = useContext(DataPermissionContext);
//   if (!context) {
//     throw new Error(
//       "useDataPermission must be used within a DataPermissionProvider"
//     );
//   }
//   return context;
// };

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the types
interface ContextType {
  user: AuthUser | null;
  userPermissions: Permission[];
  userRoles: any[];
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setUserPermissions: (permissions: Permission[]) => void;
  setUserRoles: (roles: any[]) => void;
  setLoading: (state: boolean) => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      currentPage: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }>
  >;
}

// Create context
const DataPermissionContext = createContext<ContextType | undefined>(undefined);

// Provider component
export const DataPermissionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hydrated, setHydrated] = useState(false); // NEW: Prevent hydration mismatch
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);

  // Keep loading and pagination in memory (do not persist)
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Load persisted data on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedPermissions = localStorage.getItem("userPermissions");
      const storedRoles = localStorage.getItem("userRoles");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedPermissions) setUserPermissions(JSON.parse(storedPermissions));
      if (storedRoles) setUserRoles(JSON.parse(storedRoles));

      setHydrated(true); // NEW: Mark hydration as complete
    }
  }, []);

  // Persist data in localStorage whenever state changes
  useEffect(() => {
    if (hydrated) {
      if (user !== null) localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("userPermissions", JSON.stringify(userPermissions));
    }
  }, [userPermissions, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("userRoles", JSON.stringify(userRoles));
    }
  }, [userRoles, hydrated]);

  if (!hydrated) return null; // NEW: Avoid SSR mismatch by skipping the initial render

  return (
    <DataPermissionContext.Provider
      value={{
        user,
        userPermissions,
        userRoles,
        setUser,
        setUserPermissions,
        setUserRoles,
        loading,
        setLoading,
        pagination,
        setPagination,
      }}
    >
      {children}
    </DataPermissionContext.Provider>
  );
};

// Custom hook for consuming the context
export const useDataPermission = () => {
  const context = useContext(DataPermissionContext);
  if (!context) {
    throw new Error(
      "useDataPermission must be used within a DataPermissionProvider"
    );
  }
  return context;
};
