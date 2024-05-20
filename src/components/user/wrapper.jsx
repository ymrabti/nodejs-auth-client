import { useState, createContext, useContext, useEffect } from "react";
// import { currentUser } from "../../api";

export const UserContext = createContext([]);

export const useUser = () => useContext(UserContext);

export const UserWrapper = ({ children }) => {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const refreshToken = async () => {
            //   const { data, status } = await currentUser();
            setUser(/* status === 200 ? data : */ null)
        };
        refreshToken();

    }, [user]);
    return (
        <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
    );
};
