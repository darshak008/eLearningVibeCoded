# Demo Credentials

All demo accounts use the password: `password123`

## Accounts

| Role      | Email               | Password     | Description                     |
|-----------|---------------------|--------------|---------------------------------|
| Admin     | admin@demo.com      | password123  | Platform administrator          |
| Instructor| instructor@demo.com | password123  | Sarah Johnson - Web Dev Expert  |
| Instructor| instructor2@demo.com| password123  | Michael Chen - Data Science     |
| Student   | student@demo.com    | password123  | Alex Rivera - CS Student        |
| Student   | student2@demo.com   | password123  | Emily Watson - Aspiring Analyst |

## Demo Data Included

- **5 Users** (1 admin, 2 instructors, 2 students)
- **8 Categories** (Development, Design, Business, Marketing, etc.)
- **5 Courses** with descriptions, requirements, outcomes, and tags
- **11 Modules** spread across all courses
- **25 Lessons** with content, durations, and free/paid flags
- **4 Enrollments** with progress tracking
- **4 Reviews** with ratings
- **3 Quizzes** with multiple choice and true/false questions
- **7 Notifications** (enrollments, reviews, achievements)

## Courses

| Course                                         | Instructor      | Level        | Price  |
|------------------------------------------------|-----------------|--------------|--------|
| Complete Web Development Bootcamp 2024         | Sarah Johnson   | Beginner     | $12.99 |
| Advanced React and Redux Masterclass           | Sarah Johnson   | Advanced     | $79.99 |
| UI/UX Design Fundamentals                      | Sarah Johnson   | Beginner     | $9.99  |
| Python for Data Science and Machine Learning   | Michael Chen    | Intermediate | $19.99 |
| Digital Marketing Masterclass                  | Michael Chen    | All-Levels   | $74.99 |

## How to Seed

```bash
cd server
npm run seed
```

To clear and re-seed:
```bash
npm run seed
```
The seed script clears all existing data before inserting demo data.
