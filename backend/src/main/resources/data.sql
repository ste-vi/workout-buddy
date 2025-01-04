

-- Insert sample users
INSERT INTO users (username, email) VALUES
                                                       ('user1', 'user1@example.com');

-- Insert sample body weight measures
INSERT INTO body_weight_measures (weight, date, user_id) VALUES
                                                             (80.5, '2025-01-01 08:00:00', 1),
                                                             (90.2, '2025-01-02 08:00:00', 1),
                                                             (90.0, '2025-01-03 08:00:00', 1)