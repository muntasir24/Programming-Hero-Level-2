import type { IncomingMessage } from "node:http";

export const parseBody = (req:IncomingMessage):Promise<any> => {
    //data came in chunks, so we need to listen to the 'data' event of the request object to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //data have certain time to come, so we need to listen to the 'end' event of the request object to know when the data has been completely received from the client and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //3 parameters are there in the request object, first one is 'data' event, second one is 'end' event and third one is 'error' event. We need to listen to all these events to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //resolve the promise when the data is completely received from the client and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
    //reject the promise if there is an error while receiving the data from the client and then we can send a response to the client saying that there is an error while receiving the data from the client.

    return new Promise((resolve, reject) => {
        let body = "";
        // req.on allows us to listen to the events of the request object, so we can listen to the 'data' event to get the data sent by the client in the request body and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
        req.on("data", (chunk) => {
            body += chunk;
        });
        //we need to listen to the 'end' event of the request object to know when the data has been completely received from the client and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
        req.on("end", () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
                //we need to resolve the promise when the data is completely received from the client and then we can use JSON.parse() method to parse the data to JSON format and then we can use it in our controller to perform some operations and then send a response to the client.
                //otherwise, if we not resolve the promise when the data is completely received from the client, then we will not be able to use the parsed data in our controller to perform some operations and then send a response to the client.
            } catch (error) {
                reject(error);
            }
        });
        //we need to listen to the 'error' event of the request object to know if there is an error while receiving the data from the client and then we can send a response to the client saying that there is an error while receiving the data from the client.
        req.on("error", (error) => {
            reject(error);
        }); 
     })
}