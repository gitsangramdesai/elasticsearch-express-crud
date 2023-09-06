// Import required modules
const elasticsearch = require('elasticsearch');
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Elasticsearch client
const esClient = new elasticsearch.Client({
    host: process.env.ELASTICSEARCH_HOST,
    log: 'trace',
});

// Initialize Express app
const app = express();
app.use(express.json());

// Test Elasticsearch connection
(async () => {
    try {
        await esClient.ping();
        console.log('Elasticsearch connected');
    } catch (error) {
        console.error('Error connecting to Elasticsearch:', error);
    }
})();

// Create an Elasticsearch index
app.post('/createIndex/:indexName', async (req, res) => {
    const { indexName } = req.params;

    try {
        const response = await esClient.indices.create({ index: indexName });
        res.status(200).json({ message: `Index '${indexName}' created`, data: response });
    } catch (error) {
        res.status(500).json({ message: `Error creating index '${indexName}'`, error });
    }
});

// Index a document in Elasticsearch
app.post('/indexDocument/:indexName', async (req, res) => {
    const { indexName } = req.params;
    const document = req.body;

    try {
        const response = await esClient.index({ index: indexName, body: document });
        res.status(200).json({ message: `Document indexed in '${indexName}'`, data: response });
    } catch (error) {
        res.status(500).json({ message: `Error indexing document in '${indexName}'`, error });
    }
});

// Search for documents in Elasticsearch
app.post('/searchDocuments/:indexName', async (req, res) => {
    const { indexName } = req.params;
    const body = {
        query: {
            match: req.body
        }
    }

    try {
        const response = await esClient.search({
            index: indexName,
            body: body
        });
        res.status(200).json({ message: `Search results for '${indexName}'`, data: response.hits.hits });
    } catch (error) {
        res.status(500).json({ message: `Error searching documents in '${indexName}'`, error });
    }
});

// Update a document in Elasticsearch
app.put('/updateDocument/:indexName/:documentId', async (req, res) => {
    const { indexName } = req.params;
    const { documentId } = req.params;
    const resource = {
        doc: req.body
    }

    try {
        const response = await esClient.update({
            index: indexName, id: documentId, body: resource
        });

        res.status(200).json({ message: `Document updated in '${indexName}'`, data: response });
    } catch (error) {
        res.status(500).json({ message: `Error updating document in '${indexName}'`, error });
    }
});

// Delete a document in Elasticsearch
app.delete('/deleteDocument/:indexName/:documentId', async (req, res) => {
    const { indexName } = req.params;
    const { documentId } = req.params;

    try {
        const response = await esClient.delete({ index: indexName, id: documentId });
        res.status(200).json({ message: `Document deleted from '${indexName}'`, data: response });
    } catch (error) {
        res.status(500).json({ message: `Error deleting document from '${indexName}'`, error });
    }
});

// Delete an index in Elasticsearch
app.delete('/deleteIndex/:indexName', async (req, res) => {
    const { indexName } = req.params;

    try {
        const response = await esClient.indices.delete({ index: indexName });
        res.status(200).json({ message: `Index '${indexName}' deleted successfully`, data: response });
    } catch (error) {
        res.status(500).json({ message: `Error deleting index '${indexName}'`, error });
    }
});

// Start Express server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});