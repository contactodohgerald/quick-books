
export const ReturnRequest = (res: any, status: any, message: any, data: Record<string, any>) => {
    return res.status(status).json({message, data});
}