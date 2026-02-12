const { processAndDistribute } = require('./src/controllers/uploadController');
// Note: processAndDistribute is now exported for testing.
const ListItem = require('./src/models/listItemModel');

// Mock Data
let dbItems = [];
const agents = [
    { _id: 'agentA' },
    { _id: 'agentB' },
    { _id: 'agentC' },
    { _id: 'agentD' },
    { _id: 'agentE' }
];

// Mock ListItem methods
ListItem.findOne = () => ({
    sort: () => dbItems.length > 0 ? dbItems[dbItems.length - 1] : null
});

ListItem.insertMany = async (items) => {
    // Add createdAt timestamp for sorting simulation
    const timestampedItems = items.map(i => ({ ...i, createdAt: Date.now() }));
    dbItems.push(...timestampedItems);
    console.log(`Inserted ${items.length} items.`);

    // Print distribution of this batch
    const counts = {};
    items.forEach(item => {
        const agentId = item.assignedTo.toString();
        counts[agentId] = (counts[agentId] || 0) + 1;
    });
    console.log('Batch Distribution:', counts);
    console.log('Last item assigned to:', items[items.length - 1].assignedTo);
};

// Mock Response
const res = {
    status: function (code) { return this; },
    json: function (payload) { }
};

const runTest = async () => {
    console.log('--- Batch 1: 3 items ---');
    // Expected: A, B, C. Last: C
    await processAndDistribute(
        Array.from({ length: 3 }, (_, i) => ({ FirstName: `B1-${i}`, Phone: '1', Notes: '' })),
        agents, res
    );

    console.log('\n--- Batch 2: 4 items (should start from D) ---');
    // Expected: D, E, A, B. Last: B
    await processAndDistribute(
        Array.from({ length: 4 }, (_, i) => ({ FirstName: `B2-${i}`, Phone: '1', Notes: '' })),
        agents, res
    );

    console.log('\n--- Batch 3: 2 items (should start from C) ---');
    // Expected: C, D. Last: D
    await processAndDistribute(
        Array.from({ length: 2 }, (_, i) => ({ FirstName: `B3-${i}`, Phone: '1', Notes: '' })),
        agents, res
    );
};

runTest().catch(console.error);
