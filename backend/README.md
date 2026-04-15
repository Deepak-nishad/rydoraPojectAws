# 🚗 Rydora – Driver Connect Backend

## Tech Stack
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Lombok

---

## ✅ Setup Steps

### Step 1 – MySQL Setup
Open MySQL and run:
```sql
CREATE DATABASE rydora_db;
```

### Step 2 – Update application.properties
Open: src/main/resources/application.properties
Change your MySQL password:
```
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3 – Run the project
Run RydoraApplication.java
Spring Boot will auto-create all tables.

### Step 4 – Insert Admin User
After tables are created, open MySQL and run:
```sql
USE rydora_db;

INSERT INTO users (name, email, password, phone, role, created_at)
VALUES (
  'Admin',
  'admin@rydora.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkCfOJyoqKe',
  '9999999999',
  'ADMIN',
  NOW()
);
```
Admin password is: admin123

---

## 🔗 All API Endpoints

### Auth (Public)
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register user or driver |
| POST | /api/auth/login | Login |

### Driver (USER role)
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/drivers/available | Search available drivers |
| GET | /api/drivers/{id} | Get driver by ID |
| GET | /api/drivers/profile | Driver sees own profile |

### Requests (USER role)
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/requests/send | Send request to driver |
| GET | /api/requests/my-requests | User sees their requests |
| PUT | /api/requests/{id}/cancel | Cancel request |

### Requests (DRIVER role)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/requests/pending | See pending requests |
| PUT | /api/requests/{id}/accept | Accept request |
| PUT | /api/requests/{id}/reject | Reject request |

### Bookings (USER role)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/bookings/my-bookings | User sees bookings |

### Bookings (DRIVER role)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/bookings/driver-bookings | Driver sees bookings |
| PUT | /api/bookings/{id}/start-trip | Enter start KM |
| PUT | /api/bookings/{id}/end-trip | Enter end KM + fare |

### Reviews
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/reviews/add/{bookingId} | Add review (USER) |
| GET | /api/reviews/driver/{id} | Get driver reviews |
| GET | /api/reviews/my-reviews | User's given reviews |

### Admin (ADMIN role)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/admin/dashboard | Stats and counts |
| GET | /api/admin/users | All users |
| GET | /api/admin/drivers | All drivers |
| GET | /api/admin/drivers/pending | Pending approvals |
| PUT | /api/admin/drivers/{id}/approve | Approve driver |
| PUT | /api/admin/drivers/{id}/reject | Reject driver |
| GET | /api/admin/bookings | All bookings |

---

## 💡 Fare Calculation
```
Fare = (End KM - Start KM) x ₹10
Example: End 45150 - Start 45000 = 150 km x ₹10 = ₹1500
```

## 🔐 Test Credentials
```
Admin  : admin@rydora.com  / admin123
User   : Register via /api/auth/register with role USER
Driver : Register via /api/auth/register with role DRIVER
         (Driver needs admin approval before login)
```

---

## 📝 Postman Test Flow
1. Register a USER
2. Register a DRIVER
3. Login as ADMIN → approve the driver
4. Login as USER → search available drivers
5. Send request to driver
6. Login as DRIVER → accept request
7. Start trip (enter start KM)
8. End trip (enter end KM) → fare auto calculated
9. Login as USER → add review
