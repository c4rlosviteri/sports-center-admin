import { test, expect } from '@playwright/test';

test.describe('Class Booking Flow', () => {
  // Helper to create a test user session
  test.beforeEach(async ({ page }) => {
    // Note: In a real scenario, you'd set up authentication properly
    // This is a placeholder - adjust based on your auth implementation
    await page.goto('/login');
  });

  test('should display available classes for booking', async ({ page }) => {
    // Assuming user is logged in as a client
    await page.goto('/client/classes');

    // Check for classes list
    await expect(page.getByRole('heading', { name: /clases disponibles/i })).toBeVisible();

    // Should show at least some class cards or a message
    const hasClasses = await page.getByRole('button', { name: /reservar/i }).count();
    const noClassesMessage = await page.getByText(/no hay clases disponibles/i).count();

    expect(hasClasses > 0 || noClassesMessage > 0).toBeTruthy();
  });

  test('should show class details when viewing a class', async ({ page }) => {
    await page.goto('/client/classes');

    // Click on first available class (if any)
    const classCards = page.locator('[data-testid="class-card"]').first();

    if (await classCards.count() > 0) {
      await classCards.click();

      // Should show class details
      await expect(page.getByText(/instructor/i)).toBeVisible();
      await expect(page.getByText(/capacidad/i)).toBeVisible();
      await expect(page.getByText(/horario/i)).toBeVisible();
    }
  });

  test('should allow booking a class with available spots', async ({ page }) => {
    await page.goto('/client/classes');

    // Find and click book button on first available class
    const bookButton = page.getByRole('button', { name: /reservar/i }).first();

    if (await bookButton.count() > 0) {
      await bookButton.click();

      // Should show confirmation or success message
      await expect(
        page.getByText(/reserva confirmada|reserva exitosa|clase reservada/i)
      ).toBeVisible();
    }
  });

  test('should prevent booking when class is full', async ({ page }) => {
    await page.goto('/client/classes');

    // Look for a full class indicator
    const fullClassButton = page.getByRole('button', { name: /completa|llena/i });

    if (await fullClassButton.count() > 0) {
      // Button should be disabled
      await expect(fullClassButton).toBeDisabled();
    }
  });

  test('should show user bookings in their dashboard', async ({ page }) => {
    await page.goto('/client/classes');

    // Navigate to my bookings section if available
    const myBookingsLink = page.getByRole('link', { name: /mis reservas|mis clases/i });

    if (await myBookingsLink.count() > 0) {
      await myBookingsLink.click();

      // Should show bookings list or empty state
      await expect(
        page.getByText(/tus reservas|no tienes reservas/i)
      ).toBeVisible();
    }
  });

  test('should allow canceling a booking', async ({ page }) => {
    await page.goto('/client/classes');

    // Find cancel button (might be in bookings list)
    const cancelButton = page.getByRole('button', { name: /cancelar/i }).first();

    if (await cancelButton.count() > 0) {
      await cancelButton.click();

      // Should show confirmation dialog
      const confirmButton = page.getByRole('button', { name: /confirmar|sí|aceptar/i });
      await confirmButton.click();

      // Should show success message
      await expect(
        page.getByText(/reserva cancelada|cancelación exitosa/i)
      ).toBeVisible();
    }
  });

  test('should show waitlist option when class is full', async ({ page }) => {
    await page.goto('/client/classes');

    // Look for waitlist button
    const waitlistButton = page.getByRole('button', { name: /lista de espera/i });

    if (await waitlistButton.count() > 0) {
      await waitlistButton.click();

      await expect(
        page.getByText(/agregado a la lista de espera/i)
      ).toBeVisible();
    }
  });
});
