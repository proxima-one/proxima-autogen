# 1. git clone the data vertex node, ...

# 2. migrate the schema and config files ... import these  into the correct system

# 3. gql get or init, go install or get dependencies

# 4. gql build with the correct config files for gql.yml
go run github.com/99designs/gqlgen -v

# 5. db table build from schema (index file run)
    # db client
    # db tables
    # using the db config
node ../src/database/index.js

# 6. Resolvers update w/ dataloader (index file from resolvers)
  # reference dataloader
  # reference default query inputs
  # resolver creator main
node ../src/resolvers/index.js

node ../src/queryInputs
node ../src/databaseOperations  

# 7. Dataloader create (index file, proxima cli I think)
  # Create  main
  # Create individual dataloaders
node ../src/dataloaders/index.js

## local (if statements required)
# 8. go bin build the server
go build -o -i main .

## non-local (if statements required)
# dockerfile build . (build)
# docker-compose.yml (run)
