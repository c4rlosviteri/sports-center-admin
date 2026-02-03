-- Seed data for Biciantro development/testing
-- Updated to use Package-based system (class_package_templates, user_class_packages, package_invitations)

-- Insert branches
INSERT INTO branches (id, name, address, phone, email, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Biciantro Norte', 'Av. 6 de Diciembre y Portugal, Quito', '+593 2 2456789', 'norte@biciantro.ec', true),
('550e8400-e29b-41d4-a716-446655440001', 'Biciantro Sur', 'Av. Morán Valverde y Quitumbe, Quito', '+593 2 3987654', 'sur@biciantro.ec', true),
('550e8400-e29b-41d4-a716-446655440002', 'Biciantro Valle', 'Av. Interoceánica, Cumbayá', '+593 2 2876543', 'valle@biciantro.ec', true);

-- Insert branch settings
INSERT INTO branch_settings (branch_id, cancellation_hours_before, booking_hours_before, timezone) VALUES
('550e8400-e29b-41d4-a716-446655440000', 2, 0, 'America/Guayaquil'),
('550e8400-e29b-41d4-a716-446655440001', 2, 0, 'America/Guayaquil'),
('550e8400-e29b-41d4-a716-446655440002', 3, 0, 'America/Guayaquil');

-- Insert user accounts with passwords (password123 for all user accounts)
-- All passwords are bcrypt hashed with value: password123
-- Generated with: node -e "require('bcryptjs').hash('password123', 10).then(h => console.log(h))"
INSERT INTO "user" (id, email, name, first_name, last_name, date_of_birth, id_number, address, phone, role, branch_id, "emailVerified", terms_accepted_at) VALUES
-- Superusers (can manage all branches)
('660e8400-e29b-41d4-a716-446655440000', 'admin@biciantro.ec', 'Carlos Admin', 'Carlos', 'Admin', '1985-05-15', '1712345678', 'Quito, Ecuador', '+593 99 123 4567', 'superuser', '550e8400-e29b-41d4-a716-446655440000', true, NOW()),
-- Branch Admins
('660e8400-e29b-41d4-a716-446655440001', 'branch.admin@biciantro.ec', 'María González', 'María', 'González', '1990-08-20', '1723456789', 'Quito, Ecuador', '+593 98 765 4321', 'admin', '550e8400-e29b-41d4-a716-446655440000', true, NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'admin.sur@biciantro.ec', 'Pedro Martínez', 'Pedro', 'Martínez', '1988-03-12', '1734567891', 'Quito, Ecuador', '+593 98 111 2222', 'admin', '550e8400-e29b-41d4-a716-446655440001', true, NOW()),
('660e8400-e29b-41d4-a716-446655440006', 'admin.valle@biciantro.ec', 'Sofía López', 'Sofía', 'López', '1992-07-08', '1745678902', 'Cumbayá, Ecuador', '+593 99 333 4444', 'admin', '550e8400-e29b-41d4-a716-446655440002', true, NOW()),
-- Clients
('660e8400-e29b-41d4-a716-446655440002', 'juan.perez@example.com', 'Juan Pérez', 'Juan', 'Pérez', '1995-03-10', '1734567890', 'Quito, Ecuador', '+593 99 888 7777', 'client', '550e8400-e29b-41d4-a716-446655440000', true, NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'ana.torres@example.com', 'Ana Torres', 'Ana', 'Torres', '1992-11-25', '1745678901', 'Quito, Ecuador', '+593 98 777 6666', 'client', '550e8400-e29b-41d4-a716-446655440000', true, NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'carlos.ruiz@example.com', 'Carlos Ruiz', 'Carlos', 'Ruiz', '1988-07-18', '1756789012', 'Quito, Ecuador', '+593 99 666 5555', 'client', '550e8400-e29b-41d4-a716-446655440001', true, NOW());

-- Insert account entries for Better Auth (password: password123)
INSERT INTO "account" (id, "userId", "accountId", "providerId", password) VALUES
('a60e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'admin@biciantro.ec', 'credential', '$2b$10$GE2dj205zMJ5alUxwb8FN.l5/8jLda5KM0j7b.t3GHUfMW0UJp4Eq'),
('a60e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'branch.admin@biciantro.ec', 'credential', '$2b$10$GE2dj205zMJ5alUxwb8FN.l5/8jLda5KM0j7b.t3GHUfMW0UJp4Eq'),
('a60e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'admin.sur@biciantro.ec', 'credential', '$2b$10$GE2dj205zMJ5alUxwb8FN.l5/8jLda5KM0j7b.t3GHUfMW0UJp4Eq'),
('a60e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', 'admin.valle@biciantro.ec', 'credential', '$2b$10$GE2dj205zMJ5alUxwb8FN.l5/8jLda5KM0j7b.t3GHUfMW0UJp4Eq'),
('a60e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'juan.perez@example.com', 'credential', '$2b$10$GE2dj205zMJ5alUxwb8FN.l5/8jLda5KM0j7b.t3GHUfMW0UJp4Eq'),
('a60e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'ana.torres@example.com', 'credential', '$2b$10$GE2dj205zMJ5alUxwb8FN.l5/8jLda5KM0j7b.t3GHUfMW0UJp4Eq'),
('a60e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'carlos.ruiz@example.com', 'credential', '$2b$10$GE2dj205zMJ5alUxwb8FN.l5/8jLda5KM0j7b.t3GHUfMW0UJp4Eq');

-- Admin branch assignments (María manages both Norte and Sur, Pedro only Sur, Sofía only Valle)
INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', true),  -- María - Norte (primary)
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', false), -- María - Sur
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', true),  -- Pedro - Sur (primary)
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', true);  -- Sofía - Valle (primary)

-- Insert package templates (replaces membership_plans)
INSERT INTO class_package_templates (id, branch_id, name, description, class_count, price, validity_type, validity_period, is_active, display_order) VALUES
-- Norte branch
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Paquete 4 Clases', 'Ideal para principiantes', 4, 30.00, 'days', 30, true, 1),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Paquete 8 Clases', 'Para mantener tu rutina', 8, 50.00, 'days', 30, true, 2),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Paquete 12 Clases', 'Para los más dedicados', 12, 70.00, 'days', 30, true, 3),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Paquete Ilimitado', 'Acceso sin límites', 9999, 100.00, 'unlimited', NULL, true, 4),
-- Sur branch
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Paquete 4 Clases', 'Ideal para principiantes', 4, 28.00, 'days', 30, true, 1),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Paquete 8 Clases', 'Para mantener tu rutina', 8, 48.00, 'days', 30, true, 2),
-- Valle branch
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Paquete 4 Clases', 'Ideal para principiantes', 4, 32.00, 'days', 30, true, 1),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Paquete Ilimitado', 'Acceso sin límites', 9999, 110.00, 'unlimited', NULL, true, 2);

-- Insert user class packages (replaces user_memberships)
-- Juan has 8-class package with 5 remaining
INSERT INTO user_class_packages (id, user_id, branch_id, package_template_id, total_classes, classes_remaining, purchased_at, expires_at, status, purchase_price) VALUES
('880e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 8, 5, '2026-01-01', '2026-02-01', 'active', 50.00),
-- Ana has 4-class package with 3 remaining
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 4, 3, '2026-01-10', '2026-02-10', 'active', 30.00),
-- Carlos has 8-class package with 4 remaining
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', 8, 4, '2025-12-15', '2026-01-15', 'active', 48.00);

-- Insert classes for all branches
INSERT INTO classes (id, branch_id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity) VALUES
-- Norte
('990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Cycling Intenso', 'María González', '2026-01-24 06:00:00-05', 45, 15, 3),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Cycling Cardio', 'Carlos Instructor', '2026-01-24 18:00:00-05', 50, 15, 3),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Cycling Principiantes', 'Ana Instructor', '2026-01-24 19:00:00-05', 45, 12, 3),
-- Sur
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Cycling Matutino Sur', 'Pedro Martínez', '2026-01-24 07:00:00-05', 45, 12, 3),
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Cycling Noche Sur', 'Luis Instructor', '2026-01-24 20:00:00-05', 50, 15, 3),
-- Valle
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Cycling Valle Morning', 'Sofía López', '2026-01-24 06:30:00-05', 60, 20, 3),
('990e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'Cycling Valle Evening', 'Carla Instructor', '2026-01-24 19:30:00-05', 45, 18, 3);

-- Insert bookings with package_id (replaces membership_id)
INSERT INTO bookings (id, user_id, class_id, package_id, status, booked_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 'confirmed', NOW()),
('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440001', 'confirmed', NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440002', 'confirmed', NOW());

-- Insert payments (no membership_id column anymore)
INSERT INTO payments (user_id, amount, payment_date, notes, recorded_by) VALUES
('660e8400-e29b-41d4-a716-446655440002', 50.00, '2026-01-01', 'Pago paquete 8 clases - Enero 2026', '660e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440003', 30.00, '2026-01-10', 'Pago paquete 4 clases - Enero 2026', '660e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440004', 48.00, '2025-12-15', 'Pago paquete 8 clases - Diciembre 2025', '660e8400-e29b-41d4-a716-446655440005');

-- Insert notification settings (enable all by default for all branches)
INSERT INTO notification_settings (branch_id, notification_type, is_enabled) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'booking_confirmation', true),
('550e8400-e29b-41d4-a716-446655440000', 'booking_cancellation', true),
('550e8400-e29b-41d4-a716-446655440000', 'package_expiration', true),
('550e8400-e29b-41d4-a716-446655440000', 'waitlist_promotion', true),
('550e8400-e29b-41d4-a716-446655440001', 'booking_confirmation', true),
('550e8400-e29b-41d4-a716-446655440001', 'booking_cancellation', true),
('550e8400-e29b-41d4-a716-446655440001', 'package_expiration', true),
('550e8400-e29b-41d4-a716-446655440001', 'waitlist_promotion', true),
('550e8400-e29b-41d4-a716-446655440002', 'booking_confirmation', true),
('550e8400-e29b-41d4-a716-446655440002', 'booking_cancellation', true),
('550e8400-e29b-41d4-a716-446655440002', 'package_expiration', true),
('550e8400-e29b-41d4-a716-446655440002', 'waitlist_promotion', true);

-- Create package invitations for testing (replaces invite_links)
INSERT INTO package_invitations (id, package_id, branch_id, code, created_by, is_active, max_uses, expires_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'TEST-NORTE-2026', '660e8400-e29b-41d4-a716-446655440001', true, 10, NOW() + INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'TEST-SUR-2026', '660e8400-e29b-41d4-a716-446655440005', true, 10, NOW() + INTERVAL '30 days'),
('bb0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'TEST-VALLE-2026', '660e8400-e29b-41d4-a716-446655440006', true, 10, NOW() + INTERVAL '30 days');

-- Record package class usage for bookings
INSERT INTO package_class_usage (user_package_id, booking_id, user_id, class_id, branch_id, credits_used) VALUES
('880e8400-e29b-41d4-a716-446655440000', 'aa0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 1),
('880e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 1),
('880e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 1);
