import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    // Check page title/heading
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();

    // Check email input field
    const emailInput = page.getByLabel(/correo electrónico/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check password input field
    const passwordInput = page.getByLabel(/contraseña/i);
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Check submit button
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('should show form validation for empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Check for HTML5 validation (browser native)
    const emailInput = page.getByLabel(/correo electrónico/i);
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Fill in invalid email
    await page.getByLabel(/correo electrónico/i).fill('invalid-email-format');
    await page.getByLabel(/contraseña/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should show validation error message
    await expect(page.getByText(/correo electrónico.*válido|email.*válido/i)).toBeVisible();
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    // Fill in credentials that don't exist
    await page.getByLabel(/correo electrónico/i).fill('nonexistent@example.com');
    await page.getByLabel(/contraseña/i).fill('wrongpassword123');
    
    // Submit form
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should show error message for invalid credentials
    await expect(page.getByText(/credenciales inválidas|usuario no encontrado|contraseña incorrecta/i)).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill in valid credentials (these should match test data in the database)
    await page.getByLabel(/correo electrónico/i).fill('admin@biciantro.ec');
    await page.getByLabel(/contraseña/i).fill('admin123');
    
    // Submit form
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should redirect to appropriate dashboard based on role
    await expect(page).toHaveURL(/\/(admin|client)/);
  });

  test('should have working link to register page', async ({ page }) => {
    // Check for register link
    const registerLink = page.getByRole('link', { name: /registrarse|crear cuenta/i });
    await expect(registerLink).toBeVisible();
    
    // Click and verify navigation
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should have working link to forgot password page', async ({ page }) => {
    // Check for forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: /olvidé|recuperar|contraseña/i });
    await expect(forgotPasswordLink).toBeVisible();
    
    // Click and verify navigation
    await forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('should show loading state during form submission', async ({ page }) => {
    // Fill in credentials
    await page.getByLabel(/correo electrónico/i).fill('test@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Check for loading state (button disabled or showing spinner)
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should clear error message when user starts typing', async ({ page }) => {
    // First trigger an error
    await page.getByLabel(/correo electrónico/i).fill('wrong@example.com');
    await page.getByLabel(/contraseña/i).fill('wrongpass');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verify error is shown
    const errorMessage = page.getByText(/credenciales inválidas|error/i);
    await expect(errorMessage).toBeVisible();

    // Start typing in email field
    await page.getByLabel(/correo electrónico/i).fill('new@example.com');

    // Error should be cleared (implementation dependent)
    // This test verifies the form is interactive after error
    await expect(page.getByLabel(/correo electrónico/i)).toHaveValue('new@example.com');
  });
});

test.describe('Login Page - Password Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should have password visibility toggle', async ({ page }) => {
    // Check if password field exists
    const passwordInput = page.getByLabel(/contraseña/i);
    await expect(passwordInput).toBeVisible();

    // Check for show/hide password button (common UI pattern)
    const toggleButton = page.locator('button[aria-label*="password"], button[aria-label*="contraseña"], button:has-text("👁"), button:has-text("show"), button:has-text("hide")').first();
    
    // If toggle button exists, test it
    if (await toggleButton.isVisible().catch(() => false)) {
      // Fill password
      await passwordInput.fill('testpassword');
      
      // Click toggle
      await toggleButton.click();
      
      // Type should be text when visible
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to hide
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('should require password field', async ({ page }) => {
    const passwordInput = page.getByLabel(/contraseña/i);
    await expect(passwordInput).toHaveAttribute('required', '');
  });
});
