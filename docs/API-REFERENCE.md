# API Reference — Car Importers

## VEHICA Endpoints

### GET /vehica/v1/cars
Returns all vehicle listings.

**Response:**
```json
{
  "resultsCount": 11,
  "results": [
    {
      "id": 123,
      "name": "2023 BMW 3 Series",
      "slug": "2023-bmw-3-series",
      "link": "https://carimporters.co.uk/car/2023-bmw-3-series/",
      "date": "2024-01-15T10:30:00",
      "featured": true,
      "attributes": [
        { "id": 6659, "name": "Make", "value": "", "values": [{ "term_id": 1, "name": "BMW", "slug": "bmw" }] },
        { "id": 6656, "name": "Price", "value": "25000" }
      ],
      "gallery": [
        { "url": "https://carimporters.co.uk/wp-content/uploads/full.jpg", "thumb": "https://carimporters.co.uk/wp-content/uploads/thumb.jpg" }
      ],
      "location": { "address": "London, UK", "lat": 51.5, "lng": -0.12 }
    }
  ]
}
```

**Filter parameters** (query string):
- `vehica_6659` — Make slug
- `vehica_6660` — Model slug
- `vehica_6655` — Body type slug
- `vehica_6656_from` / `vehica_6656_to` — Price range
- `vehica_14696_from` / `vehica_14696_to` — Year range
- `slug` — Get single car by slug
- `limit` — Max results

### GET /wp/v2/vehica_XXXX
Taxonomy terms for filter dropdowns.

| Endpoint | Returns |
|----------|---------|
| `/wp/v2/vehica_6659` | Makes |
| `/wp/v2/vehica_6660` | Models |
| `/wp/v2/vehica_6655` | Body Types |
| `/wp/v2/vehica_6663` | Fuel Types |
| `/wp/v2/vehica_6662` | Transmissions |
| `/wp/v2/vehica_6661` | Drive Types |
| `/wp/v2/vehica_6666` | Colors |
| `/wp/v2/vehica_6654` | Conditions |

Each returns:
```json
[
  { "id": 1, "name": "BMW", "slug": "bmw", "count": 3, "parent": 0 }
]
```

## Attribute IDs

| ID | Attribute | Type |
|----|-----------|------|
| 6659 | Make | Taxonomy |
| 6660 | Model | Taxonomy |
| 6655 | Body Type | Taxonomy |
| 6656 | Price | Number |
| 6663 | Fuel Type | Taxonomy |
| 6662 | Transmission | Taxonomy |
| 6661 | Drive Type | Taxonomy |
| 6665 | Engine Size | Text |
| 6666 | Color | Taxonomy |
| 14696 | Year | Number |
| 6654 | Condition | Taxonomy |
| 12770 | Doors | Number |
| 6664 | Mileage | Text |

## Authentication Flow

### POST /jwt-auth/v1/token
Login and get JWT token.

**Request:** `{ "username": "user", "password": "pass" }`
**Response:** `{ "token": "eyJ...", "user_email": "...", "user_display_name": "..." }`

### POST /jwt-auth/v1/token/validate
Validate existing token.

**Headers:** `Authorization: Bearer <token>`
**Response:** `{ "code": "jwt_auth_valid_token", "data": { "status": 200 } }`

### GET /wp/v2/users/me
Get current user (requires JWT in Authorization header).

## ISR Revalidation

### POST /api/revalidate
Webhook endpoint for WordPress to trigger cache revalidation.

**Headers:** `x-webhook-secret: <WORDPRESS_WEBHOOK_SECRET>`
**Body:** `{ "contentType": "vehica_car", "contentId": 123 }`

Supported content types: `post`, `page`, `category`, `tag`, `vehica_car`

## WordPress REST API

Standard WP endpoints used:
- `GET /wp/v2/posts` — Blog posts
- `GET /wp/v2/pages` — Static pages
- `GET /wp/v2/categories` — Post categories
- `GET /wp/v2/tags` — Post tags
- `GET /wp/v2/users` — Authors
- `POST /contact-form-7/v1/contact-forms/1/feedback` — Contact form
