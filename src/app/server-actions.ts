'use server'
import { api} from "~/trpc/server"
import type { UserCreateInfo,CinemaCreateInfo,MovieCreateInfo,ReservationCreateInfo,
    RoomCreateInfo,ScreeningCreateInfo,SeatCreateInfo,LayoutCreateInfo } from "~/server/db";
   
export const createUser = async ({newUserId, email, password,isAdmin }: UserCreateInfo) => {
    const newUser=await api.user.createUser.mutate({
      newUserId,
      email,
      password,
      isAdmin
    });
    return newUser
  };
  
  export const getAllUsers = async () => {
    const allUsers = (await api.user.getAllUsers.query()).data;
    if (allUsers === undefined) return;
    return allUsers;
  };
  
  export const getSpecifiedUser = async (userId: string) => {
    const specifiedUser = (await api.user.getSpecifiedUser.query(userId)).data;
    return specifiedUser;
  };
  

 


  export const createCinema = async ({name, numberOfRooms }: CinemaCreateInfo) => {
    const newCinema=await api.cinema.createCinema.mutate({
    name,
    numberOfRooms
    });
    return newCinema
  };

  export const getAllCinemas = async () => {
    const allCinemas = (await api.cinema.getAllCinemas.query()).data;
    if (allCinemas === undefined) return;
    return allCinemas;
  };

  export const getSpecifiedCinema = async (cinemaId: string) => {
    const specifiedCinema = (await api.cinema.getSpecifiedCinema.query(cinemaId)).data;
    return specifiedCinema;
  };
  


  export const createMovie = async ({title,length,releaseDate }: MovieCreateInfo) => {
    const newMovie=await api.movie.createMovie.mutate({
title,
releaseDate,
length
    });
    return newMovie
  };

  export const getAllMovies = async () => {
    const allMovies = (await api.movie.getAllMovies.query()).data;
    if (allMovies === undefined) return;
    return allMovies;
  };

  export const getSpecifiedMovie = async (movieId: string) => {
    const specifiedMovie = (await api.user.getSpecifiedUser.query(movieId)).data;
    return specifiedMovie;
  };
  

  export const createScreening = async ({roomId,movieId,screeningTime,availableSeats }: ScreeningCreateInfo) => {
    const newScreening=await api.screening.createScreening.mutate({
movieId,
roomId,
availableSeats,
screeningTime
    });
    return newScreening
  };

  export const getAllRoomScreenings = async (roomId:string) => {
    const allScreenings = (await api.screening.getAllRoomScreenings.query(roomId)).data;
    if (allScreenings === undefined) return;
    return allScreenings;
  };

  export const getSpecifiedScreening = async (screeningId: string) => {
    const specifiedScreening = (await api.screening.getSpecifiedScreening.query(screeningId)).data;
    return specifiedScreening;
  };
  


  export const createRoom = async ({cinemaId,roomNumber,capacity,layoutId}: RoomCreateInfo) => {
    const newRoom=await api.room.createRoom.mutate({
cinemaId,
roomNumber,
capacity,
layoutId
    });
    return newRoom
  };

  export const getAllCinemaRooms = async (cinemaId:string) => {
    const allCinemaRooms = (await api.room.getAllCinemaRooms.query(cinemaId)).data;
    if (allCinemaRooms === undefined) return;
    return allCinemaRooms;
  };

  export const getSpecifiedRoom = async (roomId: string) => {
    const specifiedRoom = (await api.room.getSpecifiedRoom.query(roomId)).data;
    return specifiedRoom;
  };
  



  export const createSeat = async ({roomId,number,status}: SeatCreateInfo) => {
   const newSeat= await api.seat.createSeat.mutate({
roomId,
number,
status
    });
    return newSeat
  };

  export const getAllScreeningSeats = async (screeningId:string) => {
    const allScreeningSeats = (await api.seat.getAllScreeningSeats.query(screeningId)).data;
    if (allScreeningSeats === undefined) return;
    return allScreeningSeats;
  };

  export const getSpecifiedseat = async (seatId: string) => {
    const specifiedSeat = (await api.seat.getSpecifiedSeat.query(seatId)).data;
    return specifiedSeat;
  };
  

  export const createReservation = async ({screeningId,totalAmount,userId}: ReservationCreateInfo) => {
    const newReservation=await api.reservation.createReservation.mutate({
screeningId,
totalAmount,
userId
    });
    return newReservation
  };

  export const getAllUserReservations = async (userId:string) => {
    const allUserReservations = (await api.reservation.getAllUserReservations.query(userId)).data;
    if (allUserReservations === undefined) return;
    return allUserReservations;
  };

  export const getSpecifiedReservation = async (reservationId: string) => {
    const specifiedReservation = (await api.reservation.getSpecifiedReservation.query(reservationId)).data;
    return specifiedReservation;
  };


   export const createLayout = async ({name, rows,columns,totalSeats,seatMap }: LayoutCreateInfo) => {
    const newLayout=await api.layout.createLayout.mutate({
    name,
    rows,
    columns,
    seatMap,
    totalSeats
    });
    return newLayout
  };

  export const getAllLayouts = async () => {
    const allLayouts = (await api.layout.getAllLayouts .query()).data;
    if (allLayouts === undefined) return;
    return allLayouts;
  };

  export const getSpecifiedLayout = async (layoutId: string) => {
    const specifiedLayout = (await api.layout.getSpecifiedLayout.query(layoutId)).data;
    return specifiedLayout;
  };