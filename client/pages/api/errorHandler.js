export function errorHandler(err, res) {
    //api/backend
    console.error(err);
    return res.status(500).json({ message: err?.message});
    
}