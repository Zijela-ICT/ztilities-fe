"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface ContextType {
  user: AuthUser | null;
  userPermissions: Permission[];
  userRoles: any[]; // Permissions should be an array
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
  >
}

// Create context with initial values
const DataPermissionContext = createContext<ContextType | undefined>(undefined);

// Provider component
export const DataPermissionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null); // User starts as null
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]); // Permissions start as an empty array
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

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
