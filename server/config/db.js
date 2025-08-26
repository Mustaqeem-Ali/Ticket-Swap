
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from your environment variables.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log a confirmation message to the console.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs during connection, log the error message.
    console.error(`Error: ${error.message}`);

    // Exit the Node.js process with a failure code (1) since the app can't run without the database.
    process.exit(1);
  }
};

export default connectDB;