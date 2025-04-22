import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const tokenExtract = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id; // Changed from userId to id to match login token data
    } catch (error: any) {
        throw new Error(error.message);
    }
}
