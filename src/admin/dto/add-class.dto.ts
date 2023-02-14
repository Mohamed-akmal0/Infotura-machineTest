import mongoose from "mongoose";

export interface AddClassDto {
  className: string;
  course:string;
  date: string;
  user: string;
}
