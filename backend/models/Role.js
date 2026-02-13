const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a role name'],
        unique: true,
        trim: true,
    },
    permissions: [{
        type: String,
        trim: true,
    }],
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Role', roleSchema);
