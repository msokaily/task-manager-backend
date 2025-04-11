require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const authenticateToken = require('./middleware/auth').authenticateToken;
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const commentRoutes = require('./routes/comment');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');
const logRoutes = require('./routes/log');
const cors = require('cors');
require('./cron');

const prisma = new PrismaClient();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    // origin: 'http://localhost:5000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to PostgreSQL using Prisma
prisma.$connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('PostgreSQL connection error:', err));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GraphQL setup
app.use('/graphql', authenticateToken, graphqlHTTP({
    schema,
    graphiql: true,
}));

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/tasks', authenticateToken, commentRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/logs', authenticateToken, logRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});