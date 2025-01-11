const captainSchemaModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  firstName,
  lastName,
  password,
  email,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  try {
    const missingFields = [];
    if (!firstName) missingFields.push("firstName");
    if (!email) missingFields.push("email");
    if (!color) missingFields.push("color");
    if (!plate) missingFields.push("plate");
    if (!capacity) missingFields.push("capacity");
    if (!vehicleType) missingFields.push("vehicleType");

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const captain = await captainSchemaModel.create({
      fullname: {
        firstName: firstName,
        lastName: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: color,
        plate: plate,
        capacity: capacity,
        vehicleType: vehicleType,
      },
    });
    return captain;
  } catch (e) {
    console.error("Error creating captain:", e.message);
    throw e; // Re-throw the error to handle it in the calling function
  }
};
