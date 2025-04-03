const Charger = require('../models/Charger');
const ChargerStatus = require('../models/ChargerStatus');

const getRandomValue = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getRandomStatus = () => {
    const statuses = ["idle", "charging", "fault", "maintenance"];
    return statuses[Math.floor(Math.random() * statuses.length)];
};
const getRandomPastDate = (daysBack) => {
    const date = new Date();
    date.setDate(date.getDate() - getRandomInt(1, daysBack));
    return date.toISOString();
};

// 📌 Update Charger Status Every 4 Hours
const updateChargerStatus = async () => {
    try {
        const chargers = await Charger.find().populate("productId");

        for (const charger of chargers) {
            const energyDelivered = getRandomValue(10, 100); // kWh
            const chargingSessions = getRandomInt(1, 10);
            const uptimePercentage = getRandomValue(85, 99.9);
            const temperature = getRandomValue(25, 45);
            const voltage = getRandomValue(210, 250);
            const lastMaintenance = getRandomPastDate(90);

            const dailySurplus = ((charger.productId.surplusAmount / 12) / 30).toFixed(2);

            const adjustedSurplus = (
                (energyDelivered / 50) * dailySurplus * (1 + chargingSessions / 10)
            ).toFixed(2);

            // Update or Create ChargerStatus
            await ChargerStatus.findOneAndUpdate(
                { chargerId: charger._id },
                {
                    chargingStatus: getRandomStatus(),
                    energyDelivered,
                    chargingSessions,
                    uptimePercentage,
                    lastMaintenance,
                    temperature,
                    voltage,
                    adjustedSurplus,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );
        }

        console.log("✅ Charger statuses updated successfully");
    } catch (error) {
        console.error("❌ Error updating charger statuses:", error);
    }
};

// Run the job every 4 hours
setInterval(updateChargerStatus, 1 * 60 * 60 * 1000); // 4 hours in milliseconds

module.exports = updateChargerStatus;
