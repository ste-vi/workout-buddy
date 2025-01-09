-- Insert a user (if not already present)
INSERT INTO users (username, email, created_at, updated_at)
VALUES ('testuser', 'test@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO body_weight_measures (weight, date, user_id) VALUES
                                                             (80.5, '2023-06-01 07:00:00', 1),
                                                             (80.2, '2023-06-02 07:00:00', 1),
                                                             (79.8, '2023-06-03 07:00:00', 1);
-- Get the user_id
WITH user_id AS (SELECT id FROM users WHERE username = 'testuser')

-- Insert exercises
INSERT
INTO exercises (name, body_part, category, deleted, user_id, created_at, updated_at)
VALUES ('Squats', 'LEGS', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Push-ups', 'CHEST', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Deadlifts', 'BACK', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Pull-ups', 'BACK', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Bench Press', 'CHEST', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Lunges', 'LEGS', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Shoulder Press', 'SHOULDERS', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('Plank', 'CORE', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Bicep Curls', 'ARMS', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Tricep Dips', 'ARMS', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Leg Press', 'LEGS', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Crunches', 'CORE', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Lat Pulldowns', 'BACK', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Leg Curls', 'LEGS', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Dumbbell Flyes', 'CHEST', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Mountain Climbers', 'CORE', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP),
       ('Barbell Rows', 'BACK', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Burpees', 'FULL_BODY', 'BODY_WEIGHT', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Calf Raises', 'LEGS', 'STRENGTH', false, (SELECT id FROM user_id), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);