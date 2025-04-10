const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        priority: { type: GraphQLString },
        dueDate: { type: GraphQLString },
    },
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        tasks: {
            type: new GraphQLObjectType({
                name: 'PaginatedTasks',
                fields: {
                    items: { type: new GraphQLList(TaskType) },
                    totalTasks: { type: GraphQLInt },
                    totalPages: { type: GraphQLInt },
                    currentPage: { type: GraphQLInt }
                },
            }),
            args: {
                page: { type: GraphQLInt },
                limit: { type: GraphQLInt }
            },
            async resolve(parent, { page = 1, limit = 10 }, context) {
                try {
                    const skip = (page - 1) * limit;

                    const totalTasks = await prisma.task.count({
                        where: { userId: context.user.userId }
                    });

                    const items = await prisma.task.findMany({
                        where: { userId: context.user.userId },
                        skip,
                        take: limit,
                    });

                    return {
                        items,
                        totalTasks,
                        totalPages: Math.ceil(totalTasks / limit),
                        currentPage: page
                    };
                } catch (error) {
                    throw new Error('Error fetching tasks');
                }
            },
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLInt } },
            async resolve(parent, { id }, context) {
                try {
                    return await prisma.task.findUnique({
                        where: { id, userId: context.user.userId },
                    });
                } catch (error) {
                    throw new Error('Error fetching task');
                }
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
});