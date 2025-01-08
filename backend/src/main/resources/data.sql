

-- Insert sample users
INSERT INTO users (username, email) VALUES
                                                       ('user1', 'user1@example.com');

-- Insert sample body weight measures
INSERT INTO body_weight_measures (weight, date, user_id) VALUES
                                                             (80.5, '2025-01-01 07:03:37.27', 1),
                                                             (90.2, '2025-01-02 07:03:37.27', 1),
                                                             (90.0, '2025-01-03 07:03:37.23', 1),
                                                             (91.0, '2025-01-04 07:03:37.23', 1),
                                                             (93.0, '2025-01-05 07:03:37.23', 1);

INSERT INTO exercises (name, body_part, category, deleted) VALUES
                                                      ('Squats', 'LEGS', 'STRENGTH', false),
                                                      ('Push-ups', 'CHEST', 'BODY_WEIGHT', false),
                                                      ('Deadlifts', 'BACK', 'STRENGTH', false),
                                                      ('Pull-ups', 'BACK', 'BODY_WEIGHT', false),
                                                      ('Bench Press', 'CHEST', 'STRENGTH', false),
                                                      ('Lunges', 'LEGS', 'BODY_WEIGHT', false),
                                                      ('Shoulder Press', 'SHOULDERS', 'STRENGTH', false),
                                                      ('Plank', 'CORE', 'BODY_WEIGHT', false),
                                                      ('Bicep Curls', 'ARMS', 'STRENGTH', false),
                                                      ('Burpees', 'FULL_BODY', 'BODY_WEIGHT', false);