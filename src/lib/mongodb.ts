import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable')
}

const options = {}

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // In production, it's better to create a new connection each time
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise