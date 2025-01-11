import React, { createContext } from "react";

export const UserDataContext = createContext();
const UserContext = ({ children }) => {
  const [userData, setUserData] = React.useState({
    email: "",
    fullname: {
      firstName: "",
      lastName: "",
    },
  });

  return (
    <div>
      <UserDataContext.Provider value={[userData, setUserData]}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
