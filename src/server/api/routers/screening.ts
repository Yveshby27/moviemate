import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

import { fetchAllRoomScreenings,fetchSpecifiedScreening,createScreening,deleteScreening } from "~/server/db";


export const screeningRouter=createTRPCRouter({
    getAllRoomScreenings:publicProcedure.input(z.string()).query(async(obj)=>{
        const roomScreeningsDbArray=await fetchAllRoomScreenings(obj.input)
        return { message: "All screenings have been fetched(TRPC).", data: roomScreeningsDbArray };
    }),
    createScreening:publicProcedure.input(z.object({roomId:z.string(),movieId:z.string(),availableSeats:z.number(),screeningTime:z.string()}))
    .mutation(async(obj)=>{
        const newScreening=await createScreening({roomId:obj.input.roomId,movieId:obj.input.movieId,availableSeats:obj.input.availableSeats,screeningTime:obj.input.screeningTime})
        return {message:'Screening added to database(TRPC).',data:newScreening}
    }),
    getSpecifiedScreening: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedScreening= await fetchSpecifiedScreening(arg.input);
        return { message: "Screening has been fetched(TRPC).", data: specifiedScreening };
      }),
      deleteScreening:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedScreening= await deleteScreening(obj.input)
          return { message: "Screening has been deleted(TRPC).", data:deletedScreening };
      })
    });
