## ToDo

- [ ] Filters for ticket
- [ ] Fix Type problems 
  - [X] preValidation
- [ ] Improve pagination
- [X] Token Bypass
- [X] Create chats validations
- [ ] Handle with files
  - [ ] - Deletion
- [ ] Add code coverage
  - [ ] Need to fix bug with categories name on tickets test
- [X] Fix any prisma dependency in repos
- [X] Rollback all email builder -> back to publish direct to rabbitmq queue and let mail ms handle it
- [X] Finish `EventQueueService` - factory, tests...
- [] Assure that messages wont be deleted if the ticket not exists already