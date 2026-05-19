import { pool } from "../../db";

const createProfileintoDB = async(payload:any) => {
   
    const { user_id, bio, address, phone, gender } = payload;
    
         
        const client = await pool.connect();
        const user = await client.query(
           `SELECT * FROM users WHERE id = $1`, [user_id]
        );
        //  console.log(user.rows[0]);
        if (user.rows.length === 0) {
            client.release();
            
            throw new Error("User not found");
        }
        const result = await client.query(
            `INSERT INTO profiles (user_id, bio, address, phone, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, bio, address, phone, gender]
        );
        client.release();
       
        return result.rows[0];  
    
};

export const profileService = {
    createProfileintoDB,
    // Add more profile-related service functions here
};