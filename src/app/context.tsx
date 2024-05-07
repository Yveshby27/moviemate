"use client";
import { ReactNode, createContext, useContext, useState } from "react";

interface Props {
  children: ReactNode;
}
export interface UserContextProps {
  currentUserId: string;
  setCurrentUser(user_id: string): void;
  selectedMovieId: string;
  setSelectedMovie(movie_id: string): void;
  currentAdminId: string;
  setCurrentAdmin(admin_id: string): void;
}

const UserContext = createContext<UserContextProps>({
  currentUserId: "",
  selectedMovieId: "",
  currentAdminId: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser(user_id: string) {},
  setSelectedMovie(movie_id: string) {},
  setCurrentAdmin(admin_id: string) {},
});

export const UserContextProvider = ({ children }: Props) => {
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [currentAdminId, setCurrentAdminId] = useState("");
  const setCurrentUser = (userId: string) => {
    setCurrentUserId(userId);
  };
  const setSelectedMovie = (movieId: string) => {
    setSelectedMovieId(movieId);
  };
  const setCurrentAdmin = (adminId: string) => {
    setCurrentAdminId(adminId);
  };

  return (
    <>
      <UserContext.Provider
        value={{
          currentUserId,
          setCurrentUser,
          selectedMovieId,
          setSelectedMovie,
          currentAdminId,
          setCurrentAdmin,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export const useUserContext = () => useContext(UserContext);
