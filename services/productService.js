const fileSystem = require('fs/promises');
const pathTools = require('path');

const storagePath = pathTools.join(__dirname, '../database/data.json');

async function readFile() {
    const fileContents = await fileSystem.readFile(storagePath, 'utf-8');
    return JSON.parse(fileContents);
}

async function writeFile(fileContents) {
    await fileSystem.writeFile(storagePath, JSON.stringify(fileContents, null, 2), 'utf-8');
}

async function readFileDelay() {
    await new Promise((finishDelay) => setTimeout(finishDelay, 1500));
    return await readFile();
}

const getAllProducts = async () => {
    return await readFileDelay();
};

const getProductById = async (productId) => {
    const productRecords = await readFileDelay();
    return productRecords.find((record) => record.id === productId);
};

const createProduct = async (productPayload) => {
    const productRecords = await readFile();
    const nextProductId = productRecords.length > 0 ? productRecords[productRecords.length - 1].id + 1 : 1;
    const createdRecord = { id: nextProductId, ...productPayload };
    productRecords.push(createdRecord);
    await writeFile(productRecords);
    return createdRecord;
};

const updateProduct = async (productId, productPayload) => {
    const productRecords = await readFile();
    const recordIndex = productRecords.findIndex((record) => record.id === productId);
    if (recordIndex === -1) return null;
    productRecords[recordIndex] = { id: productId, ...productPayload };
    await writeFile(productRecords);
    return productRecords[recordIndex];
};

const patchProduct = async (productId, productPayload) => {
    const productRecords = await readFile();
    const recordIndex = productRecords.findIndex((record) => record.id === productId);
    if (recordIndex === -1) return null;
    productRecords[recordIndex] = { ...productRecords[recordIndex], ...productPayload, id: productId };
    await writeFile(productRecords);
    return productRecords[recordIndex];
};

const deleteProduct = async (productId) => {
    const productRecords = await readFile();
    const recordIndex = productRecords.findIndex((record) => record.id === productId);
    if (recordIndex === -1) return null;
    const [removedRecord] = productRecords.splice(recordIndex, 1);
    await writeFile(productRecords);
    return removedRecord;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
};
