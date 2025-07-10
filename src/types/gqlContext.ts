import { JwtPayload } from "jsonwebtoken"
import { DB } from "./db"

export type GQLContext = {
    user?: JwtPayload
    db: DB
}