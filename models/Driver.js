const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const DriverSchema = Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        licensePlate: {
            type: String
        },
        CCCD: [
            {
                type: {
                    type: String, 
                    enum: ['front', 'back']
                },
                url: {
                    type: String
                }
            }
        ],
        status: {
            type: Boolean
        }
    },
    {
        timeStamp: true
    }
);

module.exports = mongoose.model("Driver", DriverSchema)