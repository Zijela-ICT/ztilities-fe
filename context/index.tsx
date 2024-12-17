"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface ContextType {
  user: AuthUser | null;
  userPermissions: Permission[]; // Permissions should be an array
  setUser: (user: AuthUser | null) => void;
  setUserPermissions: (permissions: Permission[]) => void;
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
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]); // Permissions start as an empty array

  return (
    <DataPermissionContext.Provider
      value={{ user, userPermissions, setUser, setUserPermissions }}
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
