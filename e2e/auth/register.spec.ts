import { test, expect } from '@playwright/test';

test.describe('Registration Page', () => {
  test.describe('with valid invite token', () => {
    // Note: This requires a valid invite token in the database
    // You may need to seed test data before running these tests
    
    test.beforeEach(async ({ page }) => {
      // Navigate to registration with a valid invite token
      // Replace VALID_TOKEN with an actual token from your test database
      await page.goto('/register?token=VALID_INVITE_TOKEN_12345');
    });

    test('should display registration form with all fields', async ({ page }) => {
      // Check main heading
      await expect(page.getByRole('heading', { name: /completar registro|registrarse/i })).toBeVisible();

      // Check all required fields
      await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
      await expect(page.getByLabel(/contraseña/i)).toBeVisible();
      await expect(page.getByLabel(/confirmar contraseña/i)).toBeVisible();
      await expect(page.getByLabel(/nombres/i)).toBeVisible();
      await expect(page.getByLabel(/apellidos/i)).toBeVisible();
      await expect(page.getByLabel(/cédula/i)).toBeVisible();
      await expect(page.getByLabel(/teléfono/i)).toBeVisible();
      await expect(page.getByLabel(/dirección/i)).toBeVisible();
      await expect(page.getByLabel(/fecha de nacimiento/i)).toBeVisible();
      
      // Check terms checkbox
      await expect(page.getByLabel(/acepto los términos|términos y condiciones/i)).toBeVisible();
      
      // Check submit button
      await expect(page.getByRole('button', { name: /completar registro|registrarse/i })).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      // Try to submit empty form
      await page.getByRole('button', { name: /completar registro|registrarse/i }).click();

      // Check HTML5 validation on required fields
      const emailInput = page.getByLabel(/correo electrónico/i);
      await expect(emailInput).toHaveAttribute('required', '');
      
      const passwordInput = page.getByLabel(/contraseña/i);
      await expect(passwordInput).toHaveAttribute('required', '');
    });

    test('should validate cedula format', async ({ page }) => {
      // Fill form with invalid cedula
      await page.getByLabel(/correo electrónico/i).fill('test@example.com');
      await page.getByLabel(/contraseña/i).fill('password123');
      await page.getByLabel(/confirmar contraseña/i).fill('password123');
      await page.getByLabel(/nombres/i).fill('Test');
      await page.getByLabel(/apellidos/i).fill('User');
      await page.getByLabel(/cédula/i).fill('12345'); // Too short
      await page.getByLabel(/teléfono/i).fill('+593991234567');
      await page.getByLabel(/dirección/i).fill('Test Address');
      await page.getByLabel(/fecha de nacimiento/i).fill('1990-01-01');
      await page.getByLabel(/acepto los términos/i).check();

      await page.getByRole('button', { name: /completar registro/i }).click();

      // Should show cedula validation error
      await expect(page.getByText(/cédula.*inválida|cedula.*invalida/i)).toBeVisible();
    });

    test('should validate password confirmation match', async ({ page }) => {
      await page.getByLabel(/correo electrónico/i).fill('test@example.com');
      await page.getByLabel(/contraseña/i).fill('password123');
      await page.getByLabel(/confirmar contraseña/i).fill('differentpassword');
      await page.getByLabel(/nombres/i).fill('Test');
      await page.getByLabel(/apellidos/i).fill('User');
      await page.getByLabel(/cédula/i).fill('1723456789');
      await page.getByLabel(/teléfono/i).fill('+593991234567');
      await page.getByLabel(/dirección/i).fill('Test Address');
      await page.getByLabel(/fecha de nacimiento/i).fill('1990-01-01');
      await page.getByLabel(/acepto los términos/i).check();

      await page.getByRole('button', { name: /completar registro/i }).click();

      // Should show password mismatch error
      await expect(page.getByText(/contraseñas no coinciden|passwords do not match/i)).toBeVisible();
    });

    test('should require terms acceptance', async ({ page }) => {
      await page.getByLabel(/correo electrónico/i).fill('test@example.com');
      await page.getByLabel(/contraseña/i).fill('password123');
      await page.getByLabel(/confirmar contraseña/i).fill('password123');
      await page.getByLabel(/nombres/i).fill('Test');
      await page.getByLabel(/apellidos/i).fill('User');
      await page.getByLabel(/cédula/i).fill('1723456789');
      await page.getByLabel(/teléfono/i).fill('+593991234567');
      await page.getByLabel(/dirección/i).fill('Test Address');
      await page.getByLabel(/fecha de nacimiento/i).fill('1990-01-01');
      // Do NOT check terms

      await page.getByRole('button', { name: /completar registro/i }).click();

      // Should show terms error
      await expect(page.getByText(/debes aceptar|must accept/i)).toBeVisible();
    });

    test('should show error for duplicate email', async ({ page }) => {
      // Use an email that already exists in the database
      await page.getByLabel(/correo electrónico/i).fill('admin@biciantro.ec');
      await page.getByLabel(/contraseña/i).fill('password123');
      await page.getByLabel(/confirmar contraseña/i).fill('password123');
      await page.getByLabel(/nombres/i).fill('Test');
      await page.getByLabel(/apellidos/i).fill('User');
      await page.getByLabel(/cédula/i).fill('1723456789');
      await page.getByLabel(/teléfono/i).fill('+593991234567');
      await page.getByLabel(/dirección/i).fill('Test Address');
      await page.getByLabel(/fecha de nacimiento/i).fill('1990-01-01');
      await page.getByLabel(/acepto los términos/i).check();

      await page.getByRole('button', { name: /completar registro/i }).click();

      // Should show duplicate email error
      await expect(page.getByText(/correo.*registrado|email.*registered/i)).toBeVisible();
    });
  });

  test.describe('without invite token', () => {
    test('should redirect to login when no token provided', async ({ page }) => {
      await page.goto('/register');
      
      // Should redirect to login or show error
      await expect(page).toHaveURL(/\/(login|register)/);
    });

    test('should show error for invalid invite token', async ({ page }) => {
      await page.goto('/register?token=INVALID_TOKEN_12345');
      
      // Should show error about invalid or expired invite
      await expect(page.getByText(/invitación.*inválida|invitación.*expirada|invite.*invalid/i)).toBeVisible();
    });
  });
});
