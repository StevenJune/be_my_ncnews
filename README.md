# Instatllation Requisition

1. Prepare "environment setup file " for database name assignment.
    1.1a create .env.development in project folder with following sample line:
         PGDATABASE=database_name_here
    1.2a create env.test in project folder with following sample line:
         PGDATABASE=database_name_here

2. Seeding data into database.
    2.1a drop/delete database and rebuild its structure by following command(terminal):
         npm run setup-dbs
    2.2a insert the data into the database tables by following command(terminal):
         npm run seed


    
      