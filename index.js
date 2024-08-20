const { ApolloServer, gql } = require('apollo-server');
const neo4j = require('neo4j-driver');

const typeDefs = gql`
  type Patient {
    patient_ID: ID!
    name: String!
    age: Int!
    medical_history: String!
  }

  type HealthcareProvider {
    provider_ID: ID!
    name: String!
    specialization: String!
    location: String!
  }

  type MedicalService {
    service_ID: ID!
    name: String!
    description: String!
    associated_costs: String!
  }

  type Query {
    patients: [Patient]
    healthcareProviders: [HealthcareProvider]
    medicalServices: [MedicalService]
  }
`;

const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'Wije@2001'));

const resolvers = {
  Query: {
    patients: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (p:Patient) RETURN p');
      session.close();
      return result.records.map(record => record.get('p').properties);
    },
    healthcareProviders: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (h:Healthcare_providers) RETURN h');
      session.close();
      return result.records.map(record => record.get('h').properties);
    },
    medicalServices: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (m:Medical_Services) RETURN m');
      session.close();
      return result.records.map(record => record.get('m').properties);
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});