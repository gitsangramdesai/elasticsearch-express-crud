

//Search
curl --location 'localhost:3002/searchDocuments/country' \
--header 'Content-Type: application/json' \
--data '{
    "name":"bharat"
}'

//Update
curl --location --request PUT 'localhost:3002/updateDocument/country/vf0Ra4oBnZFTH2Sz7igj' \
--header 'Content-Type: application/json' \
--data '{
    "name":"bharat",
    "capital":"delhi"
}'

//insert
curl --location 'localhost:3002/indexDocument/country' \
--header 'Content-Type: application/json' \
--data '{
    "name":"india",
    "capital":"mumbai",
    "isd":"91"
}'

//create index
 curl --location --request POST 'localhost:3002/createIndex/country'

 //delete
 curl --location --request DELETE 'localhost:3002/deleteDocument/country/vv0da4oBnZFTH2Sz9Sgd'

 