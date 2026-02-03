import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect to login page when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display login form with email and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
    await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/correo electrónico/i).fill('invalid-email');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should show validation error
    await expect(page.getByText(/correo electrónico.*válido/i)).toBeVisible();
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/correo electrónico/i).fill('wrong@example.com');
    await page.getByLabel(/contraseña/i).fill('wrongpassword');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should show error message
    await expect(page.getByText(/credenciales inválidas/i)).toBeVisible();
  });

  test('should navigate to register page from login', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: /registrarse/i }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should display registration form', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: /registro/i })).toBeVisible();
    await expect(page.getByLabel(/nombre/i)).toBeVisible();
    await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /registrarse/i })).toBeVisible();
  });

  test('should validate password strength on registration', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/nombre/i).fill('Test User');
    await page.getByLabel(/correo electrónico/i).fill('test@example.com');
    await page.getByLabel(/contraseña/i).fill('123'); // Weak password
    await page.getByRole('button', { name: /registrarse/i }).click();

    // Should show password validation error
    await expect(page.getByText(/contraseña.*caracteres/i)).toBeVisible();
  });
});
