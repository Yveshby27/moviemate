import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;


const user=db.user
const cinema=db.cinema
const room=db.room
const movie=db.movie
const screening=db.screening
const seat=db.seat
const reservation=db.reservation
const layout=db.layout

//USER DB FUNCTIONS
export const fetchAllUsers=async()=>{
  try{
  const allUsers=await user.findMany()
  console.log('Users fetched from database:',allUsers)
  return allUsers
  }
  catch(error){
    console.log('An error occured while fetching users(database error):',error)
  }
}

export const fetchSpecifiedUser=async(userId:string)=>{
try{
  const specifiedUser=await user.findUnique({where:{id:userId}})
  console.log('User fetched from database:',specifiedUser)
  return specifiedUser
}
catch(error){
  console.log('An error occured while fetching user(database error):',error)
}
}

export interface UserCreateInfo{
newUserId:string,
email:string,
password:string,
isAdmin:boolean
}

export const createUser=async({newUserId,email,password,isAdmin}:UserCreateInfo)=>{
try{
  const newUser=await user.create({data:{id:newUserId,email,password,is_admin:isAdmin}})
  console.log('User created in database:',newUser)
  return newUser 
}catch(error){
  console.log('An error occured while creating user(database error):',error)
}
}

export const deleteUser=async(userId:string)=>{
  try{
const deletedUser=await user.delete({where:{id:userId}})
console.log('User deleted from database:',deletedUser)
return deletedUser
  }catch(error){
    console.log('An error occured while deleting user(database error):',error)
  }
}

//CINEMA DB FUNCTIONS

export const fetchAllCinemas=async()=>{
  try{
  const allCinemas=await cinema.findMany()
  console.log('Cinemas fetched from database:',allCinemas)
  return allCinemas
  }
  catch(error){
    console.log('An error occured while fetching cinemas(database error):',error)
  }
}

export const fetchSpecifiedCinema=async(cinemaId:string)=>{
try{
  const specifiedCinema=await cinema.findUnique({where:{id:cinemaId}})
  console.log('Cinema fetched from database:',specifiedCinema)
  return specifiedCinema
}
catch(error){
  console.log('An error occured while fetching cinema(database error):',error)
}
}

export interface CinemaCreateInfo{
name:string,
numberOfRooms:number
}

export const createCinema=async({name,numberOfRooms}:CinemaCreateInfo)=>{
try{
  const newCinema=await cinema.create({data:{name,number_of_rooms:numberOfRooms}})
  console.log('Cinema created in database:',newCinema)
  return newCinema
}catch(error){
  console.log('An error occured while creating cinema(database error):',error)
}
}

export const deleteCinema=async(cinemaId:string)=>{
  try{
const deletedCinema=await cinema.delete({where:{id:cinemaId}})
console.log('Cinema deleted from database:',deletedCinema)
return deletedCinema
  }catch(error){
    console.log('An error occured while deleting cinema(database error):',error)
  }
}


//ROOM DB FUNCTIONS

export const fetchAllCinemaRooms=async(cinemaId:string)=>{
  try{
    const allCinemaRooms=await room.findMany({where:{cinemaId}})
    console.log(`Rooms fetched from database:`,allCinemaRooms)
    return allCinemaRooms
  }
  catch(error){
    console.log('An error occured while fetching rooms(database error):',error)
  }
}
export const fetchSpecifiedRoom=async(roomId:string)=>{
  try{
    const specifiedRoom=await room.findUnique({where:{id:roomId}})
    console.log('Room fetched from database:',specifiedRoom)
    return specifiedRoom
  }
  catch(error){
    console.log('An error occured while fetching room(database error):',error)
  }
  }
  
  export interface RoomCreateInfo{
  cinemaId:string,
  capacity:number,
  roomNumber:string,
  layoutId:string
  }
  
  export const createRoom=async({cinemaId,capacity,roomNumber,layoutId}:RoomCreateInfo)=>{
  try{
    const newRoom=await room.create({data:{cinemaId,capacity,number:roomNumber,layoutId}})
    console.log('Room created in database:',newRoom)
    return newRoom
  }catch(error){
    console.log('An error occured while creating room(database error):',error)
  }
  }
  
  export const deleteRoom=async(roomId:string)=>{
    try{
  const deletedRoom=await room.delete({where:{id:roomId}})
  console.log('Room deleted from database:',deletedRoom)
  return deletedRoom
    }catch(error){
      console.log('An error occured while deleting room(database error):',error)
    }
  }

//MOVIE DB FUNCTIONS 

export const fetchAllMovies=async()=>{
  try{
    const allMovies=await movie.findMany()
    console.log(`Movies fetched from database:`,allMovies)
    return allMovies
  }
  catch(error){
    console.log('An error occured while fetching movies(database error):',error)
  }
}
export const fetchSpecifiedMovie=async(movieId:string)=>{
  try{
    const specifiedMovie=await movie.findUnique({where:{id:movieId}})
    console.log('Movie fetched from database:',specifiedMovie)
    return specifiedMovie
  }
  catch(error){
    console.log('An error occured while fetching movie(database error):',error)
  }
  }
  
  export interface MovieCreateInfo{
  title:string,
  length:number,
releaseDate:string
  }
  
  export const createMovie=async({title,length,releaseDate}:MovieCreateInfo)=>{
  try{
    const newMovie=await movie.create({data:{title,length,release_date:releaseDate}})
    console.log('Movie created in database:',newMovie)
    return newMovie
  }catch(error){
    console.log('An error occured while creating movie(database error):',error)
  }
  }
  
  export const deleteMovie=async(movieId:string)=>{
    try{
  const deletedMovie=await movie.delete({where:{id:movieId}})
  console.log('Room deleted from database:',deletedMovie)
  return deletedMovie
    }catch(error){
      console.log('An error occured while deleting movie(database error):',error)
    }
  }


  //SCREENING DB FUNCTIONS

  export const fetchAllRoomScreenings=async(roomId:string)=>{
    try{
      const allRoomScreenings=await screening.findMany({where:{roomId}})
      console.log(`Screenings fetched from database:`,allRoomScreenings)
      return allRoomScreenings
    }
    catch(error){
      console.log('An error occured while fetching screenings(database error):',error)
    }
  }
  export const fetchSpecifiedScreening=async(screeningId:string)=>{
    try{
      const specifiedScreening=await room.findUnique({where:{id:screeningId}})
      console.log('Screening fetched from database:',specifiedScreening)
      return specifiedScreening
    }
    catch(error){
      console.log('An error occured while fetching screening(database error):',error)
    }
    }
    
    export interface ScreeningCreateInfo{
    roomId:string,
    movieId:string,
  availableSeats:number,
screeningTime:string
    }
    
    export const createScreening=async({roomId,movieId,availableSeats,screeningTime}:ScreeningCreateInfo)=>{
    try{
      const newScreening=await screening.create({data:{roomId,movieId,available_seats:availableSeats,screening_time:screeningTime}})
      console.log('Screening created in database:',newScreening)
      return newScreening
    }catch(error){
      console.log('An error occured while creating screening(database error):',error)
    }
    }
    
    export const deleteScreening=async(screeningId:string)=>{
      try{
    const deletedScreening=await screening.delete({where:{id:screeningId}})
    console.log('Screening deleted from database:',deletedScreening)
    return deletedScreening
      }catch(error){
        console.log('An error occured while deleting screening(database error):',error)
      }
    }


    //SEAT DB FUNCTIONS
    export const fetchAllRoomSeats=async(roomId:string)=>{
      try{
        const allRoomSeats=await seat.findMany({where:{roomId}})
        console.log(`Seats fetched from database:`,allRoomSeats)
        return allRoomSeats
      }
      catch(error){
        console.log('An error occured while fetching seats(database error):',error)
      }
    }
    export const fetchSpecifiedSeat=async(seatId:string)=>{
      try{
        const specifiedSeat=await seat.findUnique({where:{id:seatId}})
        console.log('Seat fetched from database:',specifiedSeat)
        return specifiedSeat
      }
      catch(error){
        console.log('An error occured while fetching seat(database error):',error)
      }
      }

      export enum Status{
        Available='Available',
        Booked='Booked'
      }
      
     export interface SeatCreateInfo{
roomId:string,
  number:string,
status:Status
      }
      
      export const createSeat=async({roomId,number,status}:SeatCreateInfo)=>{
      try{
        const newSeat=await seat.create({data:{roomId,number,status}})
        console.log('Seat created in database:',newSeat)
        return newSeat
      }catch(error){
        console.log('An error occured while creating seat(database error):',error)
      }
      }
      
      export const deleteSeat=async(seatId:string)=>{
        try{
      const deletedSeat=await room.delete({where:{id:seatId}})
      console.log('Seat deleted from database:',deletedSeat)
      return deletedSeat
        }catch(error){
          console.log('An error occured while deleting seat(database error):',error)
        }
      }
    
      //RESERVATION DB FUNCTIONS
      export const fetchAllUserReservations=async(userId:string)=>{
        try{
          const allUserReservations=await reservation.findMany({where:{userId}})
          console.log(`Reservations fetched from database:`,allUserReservations)
          return allUserReservations
        }
        catch(error){
          console.log('An error occured while fetching reservations(database error):',error)
        }
      }
      export const fetchSpecifiedReservation=async(reservationId:string)=>{
        try{
          const specifiedReservation=await reservation.findUnique({where:{id:reservationId}})
          console.log('Reservation fetched from database:',specifiedReservation)
          return specifiedReservation
        }
        catch(error){
          console.log('An error occured while fetching reservation(database error):',error)
        }
        }
        
        export interface ReservationCreateInfo{
userId:string,
screeningId:string,
totalAmount:number
        }
        
        export const createReservation=async({userId,screeningId,totalAmount}:ReservationCreateInfo)=>{
        try{
          const newReservation=await reservation.create({data:{userId,screeningId,total_amount:totalAmount}})
          console.log('Reservation created in database:',newReservation)
          return newReservation
        }catch(error){
          console.log('An error occured while creating reservation(database error):',error)
        }
        }
        
        export const deleteReservation=async(seatId:string)=>{
          try{
        const deletedSeat=await room.delete({where:{id:seatId}})
        console.log('Seat deleted from database:',deletedSeat)
        return deletedSeat
          }catch(error){
            console.log('An error occured while deleting seat(database error):',error)
          }
        }

        //LAYOUT DB FUNCTIONS
        export const fetchAllLayouts=async()=>{
          try{
          const allLayouts=await layout.findMany()
          console.log('Layouts fetched from database:',allLayouts)
          return allLayouts
          }
          catch(error){
            console.log('An error occured while fetching layouts(database error):',error)
          }
        }
        
        export const fetchSpecifiedLayout=async(layoutId:string)=>{
        try{
          const specifiedLayout=await layout.findUnique({where:{id:layoutId}})
          console.log('Cinema fetched from database:',specifiedLayout)
          return specifiedLayout
        }
        catch(error){
          console.log('An error occured while fetching cinema(database error):',error)
        }
        }
        
        export interface LayoutCreateInfo{
        name:string,
        rows:number,
        columns:number,
        totalSeats:number,
        seatMap:string[][]
        }
        
        export const createLayout=async({name,rows,columns,totalSeats,seatMap}:LayoutCreateInfo)=>{
        try{
          const newLayout=await layout.create({data:{name,rows,columns,total_seats:totalSeats,seat_map:seatMap}})
          console.log('Cinema created in database:',newLayout)
          return newLayout
        }catch(error){
          console.log('An error occured while creating layout(database error):',error)
        }
        }
        
        export const deleteLayout=async(layoutId:string)=>{
          try{
        const deletedLayout=await layout.delete({where:{id:layoutId}})
        console.log('Layout deleted from database:',deletedLayout)
        return deletedLayout
          }catch(error){
            console.log('An error occured while deleting layout(database error):',error)
          }
        }
        
        
