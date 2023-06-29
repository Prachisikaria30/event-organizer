## Create an Event

Create a new event by sending a POST request to `/api/v3/app/events`.

### Request

- Method: POST
- URL: `/api/v3/app/events`
- Headers:
  - Content-Type: application/json
- Body Parameters:
  - name (string, required): The name of the event.
  - tagline (string, required): A brief tagline or description of the event.
  - schedule (string, required): The schedule or date of the event.
  - description (string, required): The description or details of the event.
  - moderator (string, required): The name of the event moderator.
  - category (string, required): The category of the event.
  - sub_category (string, required): The sub-category of the event.
  - rigor_rank (number, required): The rigor rank of the event.
  - image (file, optional): An image file associated with the event.

### Response

- Status: 200 OK
- Body: The inserted document ID of the created event.

---

## Delete an Event

Delete an existing event by sending a DELETE request to `/api/v3/app/events/:id`, where `:id` is the ID of the event to delete.

### Request

- Method: DELETE
- URL: `/api/v3/app/events/:id`
- Parameters:
  - id (string, required): The ID of the event to delete.

### Response

- Status: 200 OK
- Body: "Event deleted successfully" if the event was deleted successfully.

---

## Update an Event

Update an existing event by sending a PUT request to `/api/v3/app/events/:id`, where `:id` is the ID of the event to update.

### Request

- Method: PUT
- URL: `/api/v3/app/events/:id`
- Headers:
  - Content-Type: application/json
- Parameters:
  - id (string, required): The ID of the event to update.
- Body Parameters:
  - name (string, optional): The updated name of the event.
  - tagline (string, optional): The updated tagline of the event.
  - schedule (string, optional): The updated schedule of the event.
  - description (string, optional): The updated description of the event.
  - moderator (string, optional): The updated moderator of the event.
  - category (string, optional): The updated category of the event.
  - sub_category (string, optional): The updated sub-category of the event.
  - rigor_rank (number, optional): The updated rigor rank of the event.
  - image (file, optional): An updated image file associated with the event.

### Response

- Status: 200 OK
- Body: "Event updated successfully" if the event was updated successfully.

---

## Get an Event

Retrieve details of a specific event by sending a GET request to `/api/v3/app/events/:id`, where `:id` is the ID of the event.

### Request

- Method: GET
- URL: `/api/v3/app/events/:id`
- Parameters:
  - id (string, required): The ID of the event to retrieve.

### Response

- Status: 200 OK
- Body: JSON object containing the event details.

---

## Get Events

Retrieve a list of events based on specific criteria by sending a GET request to `/api/v3/app/events`.

### Request

- Method: GET
- URL: `/api/v3/app/events`
- Query Parameters:
  - type (string, optional): The type of events to fetch (e.g., "latest").


  - limit (number, optional): The maximum number of events to fetch per page.
  - page (number, optional): The page number of the events to fetch.

### Response

- Status: 200 OK
- Body: JSON array containing the list of events.
