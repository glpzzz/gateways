const mongoose = require('mongoose');
const isIp = require('is-ip');

module.exports = mongoose.model('Peripheral', new mongoose.Schema({
    uid: {
        type: Number,
        unique: true,
        required: true,
    },
    vendor: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value === 'online' || value === 'offline';
            },
            message: "Status must be `online` or `offline`."
        }
    },
    gateway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gateway',
    },
}, {
    timestamps: true
}));
