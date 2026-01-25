const User = require('../models/userModel');
const ListItem = require('../models/listItemModel');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');

// @desc    Upload CSV/Excel and distribute lists
// @route   POST /api/upload
// @access  Private/Admin
const uploadAndDistribute = async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const filePath = req.file.path;
    const agents = await User.find({ role: 'agent' });

    if (agents.length === 0) {
        res.status(400);
        throw new Error('No agents found to distribute tasks');
    }

    let results = [];

    if (req.file.originalname.endsWith('.csv')) {
        // Parse CSV
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    validateHeaders(results);
                    await processAndDistribute(results, agents, res);
                } catch (error) {
                    fs.unlinkSync(filePath);
                    if (!res.headersSent) {
                        res.status(400);
                        res.json({ message: error.message });
                    }
                }
            });
    } else {
        // Parse Excel
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        results = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        try {
            validateHeaders(results);
            await processAndDistribute(results, agents, res);
        } catch (error) {
            fs.unlinkSync(filePath); // Cleanup
            res.status(400);
            throw error;
        }
    }
};

const validateHeaders = (data) => {
    // No longer enforce specific column headers; any CSV/Excel file is accepted as long as it's not empty.
    if (data.length === 0) {
        throw new Error('File is empty');
    }
    // Previously required columns FirstName, Phone, Notes have been removed per user request.
};

const validateRowData = (row) => {
    // Helper to find key ignoring case
    const getValue = (obj, key) => {
        const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
        return foundKey ? obj[foundKey] : undefined;
    };

    const phone = getValue(row, 'phone');
    if (phone && isNaN(Number(phone))) {
        // This is a strict check. "Phone - Number"
        // However, phone numbers might have +, -, etc.
        // Let's assume regex validation for digits is safer or just basic isNaN check if plain number.
        // Given "1234" in valid.csv, isNaN works. 
        // If "123-456", isNaN is true.
        // Let's use a regex that allows digits, spaces, -, +
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(phone)) {
            throw new Error(`Invalid phone number format for ${getValue(row, 'firstname')}`);
        }
    }
};

const processAndDistribute = async (items, agents, res) => {
    // Distribute items to agents in a round-robin fashion, persisting order across uploads.

    // 1. Find the last assigned agent from the DB to determine where to start.
    // We sort by createdAt descending to get the very last item distributed.
    const lastItem = await ListItem.findOne().sort({ createdAt: -1 });
    let lastAgentId = lastItem ? lastItem.assignedTo.toString() : null;

    let startIndex = 0;
    if (lastAgentId) {
        const lastAgentIndex = agents.findIndex(a => a._id.toString() === lastAgentId);
        if (lastAgentIndex !== -1) {
            // Start from the next agent after the last one
            startIndex = (lastAgentIndex + 1) % agents.length;
        }
    }

    const distributedItems = [];
    let agentIdx = startIndex;

    for (const item of items) {
        // Validate each row's data.
        validateRowData(item);
        // Helper to get value case-insensitively.
        const getValue = (obj, key) => {
            const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
            return foundKey ? obj[foundKey] : undefined;
        };
        distributedItems.push({
            firstName: getValue(item, 'firstname') || 'N/A',
            phone: getValue(item, 'phone') || '0000000000',
            notes: getValue(item, 'notes') || '',
            assignedTo: agents[agentIdx]._id,
        });
        // Move to next agent, wrap around.
        agentIdx = (agentIdx + 1) % agents.length;
    }
    try {
        // Insert all distributed items.
        await ListItem.insertMany(distributedItems);
        res.status(201).json({ message: 'List distributed successfully', count: distributedItems.length });
    } catch (error) {
        res.status(500);
        throw new Error('Error saving distributed lists');
    }
};

// @desc    Get distributed lists for all agents
// @route   GET /api/upload/lists
// @access  Private/Admin
const getAllLists = async (req, res) => {
    const lists = await ListItem.find({}).populate('assignedTo', 'name email');
    res.json(lists);
};

// @desc    Get items for a specific agent
// @route   GET /api/upload/agent-list/:id
// @access  Private
const getAgentList = async (req, res) => {
    const list = await ListItem.find({ assignedTo: req.params.id });
    res.json(list);
};

// @desc    Update list item status
// @route   PUT /api/upload/item/:id
// @access  Private
const updateListItemStatus = async (req, res) => {
    const { status } = req.body;
    const item = await ListItem.findById(req.params.id);

    if (item) {
        item.status = status || item.status;
        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
};

// @desc    Clear all distributed lists
// @route   DELETE /api/upload/lists
// @access  Private/Admin
const clearAllLists = async (req, res) => {
    await ListItem.deleteMany({});
    res.json({ message: 'All lists cleared' });
};

// @desc    Delete list item
// @route   DELETE /api/upload/item/:id
// @access  Private/Admin
const deleteListItem = async (req, res) => {
    const item = await ListItem.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
};

module.exports = {
    uploadAndDistribute,
    getAllLists,
    getAgentList,
    updateListItemStatus,
    clearAllLists,
    deleteListItem,
    processAndDistribute, // Exported for testing
};
