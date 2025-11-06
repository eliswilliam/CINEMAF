const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI n'est pas définie dans les variables d'environnement");
    }
    
    console.log("🔄 Tentative de connexion à MongoDB Atlas...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connecté à Atlas !");
    console.log("📊 Base de données:", mongoose.connection.name);
    
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error.message);
    console.error("🔍 MONGO_URI (partiellement masqué):", 
      process.env.MONGO_URI ? 
      process.env.MONGO_URI.substring(0, 20) + "..." : 
      "Non défini");
    throw error; // Ne pas faire process.exit pour permettre au serveur de démarrer
  }
};

module.exports = connectDB;
