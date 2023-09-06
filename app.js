const express = require('express');
const Elasticsearch = require('elasticsearch');

const app = express();
const port = 3002;

// Configure Elasticsearch client
const esClient = new Elasticsearch.Client({
    host: 'http://localhost:9200',
    log: 'trace',
});

// Test Elasticsearch connection
esClient.ping({ requestTimeout: 30000 }, (error) => {
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Elasticsearch cluster is up and running!');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


async function createIndex(indexName) {
    try {
        const response = await esClient.indices.create({
            index: indexName,
        });
        console.log(`Index '${indexName}' created successfully:`, response);
    } catch (error) {
        console.error(`Error creating index '${indexName}':`, error);
    }
}

async function indexDocument(indexName, document) {
    try {
        const response = await esClient.index({
            index: indexName,
            body: document,
        });
        console.log(`Document indexed in '${indexName}':`, response);
    } catch (error) {
        console.error(`Error indexing document in '${indexName}':`, error);
    }
}

async function searchDocuments(indexName, query) {
    try {
        const response = await esClient.search({
            index: indexName,
            body: {
                query: query,
            },
        });
        console.log(`Search results for '${indexName}':`, response.hits.hits);
    } catch (error) {
        console.error(`Error searching documents in '${indexName}':`, error);
    }
}


// (async () => {
//     const indexName = 'example-index';
//     await createIndex(indexName);
// })();


// (async () => {
//     const indexName = 'example-index';
//     const exampleDocument = {
//       title: 'An Example Document',
//       content: 'This is a sample document for indexing in Elasticsearch.',
//       timestamp: new Date(),
//     };
//     await indexDocument(indexName, exampleDocument);
//   })();


const simpleQueryString = {
    simple_query_string: {
        query: 'example',
    },
};
searchDocuments('example-index', simpleQueryString);


const advancedQuery = {
    bool: {
        must: {
            match: { title: 'example' },
        },
        filter: {
            range: { timestamp: { gte: 'now-1d/d' } },
        },
    },
};
const searchParams = {
    index: 'example-index',
    body: {
        query: advancedQuery,
        sort: [{ timestamp: { order: 'desc' } }],
        from: 0,
        size: 10,
    },
};
searchDocuments(searchParams);


async function updateDocument(indexName, documentId, updateScript) {
    try {
        const response = await esClient.update({
            index: indexName,
            id: documentId,
            body: {
                script: updateScript,
            },
        });
        console.log(`Document updated in '${indexName}':`, response);
    } catch (error) {
        console.error(`Error updating document in '${indexName}':`, error);
    }
}


//   (async () => {
//     const indexName = 'example-index';
//     const documentId = 'uv3PaooBnZFTH2SzQygx';
//     const updateScript = {
//       source: 'ctx._source.title = params.newTitle',
//       lang: 'painless',
//       params: { newTitle: 'Updated Example Document' },
//     };
//     await updateDocument(indexName, documentId, updateScript);
//   })();


// Function to delete a document
async function deleteDocument(indexName, documentId) {
    try {
        const response = await esClient.delete({
            index: indexName,
            id: documentId,
        });
        console.log(`Document deleted from '${indexName}':`, response);
    } catch (error) {
        console.error(`Error deleting document from '${indexName}':`, error);
    }
}

// Function to delete an index
async function deleteIndex(indexName) {
    try {
        const response = await esClient.indices.delete({
            index: indexName,
        });
        console.log(`Index '${indexName}' deleted successfully:`, response);
    } catch (error) {
        console.error(`Error deleting index '${indexName}':`, error);
    }
}


// (async () => {
//     // Example for deleting a document
//     const indexName = 'example-index';
//     const documentId = 'uv3PaooBnZFTH2SzQygx';
//     await deleteDocument(indexName, documentId);

//     // Example for deleting an index
//     // const indexNameToDelete = 'example-index';
//     // await deleteIndex(indexNameToDelete);
//   })();