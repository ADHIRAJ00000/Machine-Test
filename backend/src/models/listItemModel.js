const mongoose = require('mongoose');

const listItemSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Called', 'Interested', 'Not Interested'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const ListItem = mongoose.model('ListItem', listItemSchema);

module.exports = ListItem;
