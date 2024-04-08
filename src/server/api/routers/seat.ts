import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { Status } from "~/server/db";
import { fetchAllRoomSeats,fetchSpecifiedSeat,createSeat,deleteSeat } from "~/server/db";

const StatusValues = [Status.Available, Status.Booked] as const;
export const seatRouter=createTRPCRouter({
    getAllScreeningSeats:publicProcedure.input(z.string()).query(async(obj)=>{
        const roomSeatsDbArray=await fetchAllRoomSeats(obj.input)
        return { message: "All screening seats have been fetched(TRPC).", data: roomSeatsDbArray };
    }),
    createSeat:publicProcedure.input(z.object({roomId:z.string(),number:z.string(), status: z.union([z.literal(StatusValues[0]), z.literal(StatusValues[1])])}))
    .mutation(async(obj)=>{
        const newSeat=await createSeat({roomId:obj.input.roomId,number:obj.input.number,status:obj.input.status as Status})
        return {message:'Seat added to database(TRPC).',data:newSeat}
    }),
    getSpecifiedSeat: publicProcedure.input(z.string()).query(async (arg) => {
        const specifiedSeat= await fetchSpecifiedSeat(arg.input);
        return { message: "Seat has been fetched(TRPC).", data: specifiedSeat };
      }),
      deleteSeat:publicProcedure.input(z.string()).mutation(async(obj)=>{
         const deletedSeat= await deleteSeat(obj.input)
          return { message: "Seat has been deleted(TRPC).", data:deletedSeat };
      })
    });
