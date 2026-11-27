# SupportDesk – Database Design

## 1. User Table

Stores information about users.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | Int | Primary Key | Unique user ID |
| name | String | - | User name |
| email | String | Unique | User email |
| password | String | - | Hashed password |
| createdAt | DateTime | - | Account creation date |

## 2. Ticket Table

Stores problems reported by users.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | Int | Primary Key | Unique ticket ID |
| title | String | - | Ticket title |
| description | String | - | Problem details |
| status | String | - | Open, In Progress, Closed |
| priority | String | - | High, Medium, Low |
| userId | Int | Foreign Key | Ticket owner's ID |
| createdAt | DateTime | - | Ticket creation date |

## 3. Comment Table

Stores comments added to tickets.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | Int | Primary Key | Unique comment ID |
| message | String | - | Comment text |
| ticketId | Int | Foreign Key | Related ticket ID |
| userId | Int | Foreign Key | Commenter's ID |
| createdAt | DateTime | - | Comment date |

## 4. Tag Table

Stores ticket labels or categories.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | Int | Primary Key | Unique tag ID |
| name | String | Unique | Tag name |

## 5. Attachment Table

Stores uploaded file information.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | Int | Primary Key | Unique attachment ID |
| fileName | String | - | Uploaded file name |
| filePath | String | - | File storage path |
| ticketId | Int | Foreign Key | Related ticket ID |
| createdAt | DateTime | - | Upload date |

## 6. AuditLog Table

Stores records of activities performed in the system.

| Column | Data Type | Key | Description |
|---|---|---|---|
| id | Int | Primary Key | Unique log ID |
| action | String | - | Activity performed |
| userId | Int | Foreign Key | User who performed the action |
| createdAt | DateTime | - | Activity date |

## 7. Table Relationships

1. One User can create many Tickets.
2. One Ticket can have many Comments.
3. One User can write many Comments.
4. One Ticket can have many Attachments.
5. One Ticket can have many Tags.
6. One Tag can belong to many Tickets.
7. One User can have many AuditLogs.

## 8. Indexes

- User: email
- Ticket: userId, status
- Comment: ticketId
- Attachment: ticketId
- AuditLog: userId

## 9. Why This Database Design?

- Stores information in an organized way.
- Reduces duplicate data.
- Connects related tables.
- Makes searching faster using indexes.
- Supports the requirements of the SupportDesk project.