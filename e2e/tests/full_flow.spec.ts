import { test, expect } from '@playwright/test';

test.describe('Lost & Found System End-to-End Workflow', () => {
  test('User registration, reporting, auto-matching, and match confirmation', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page.getByText('Reconnecting People with Their')).toBeVisible();

    // 2. Register Alice (Lost Item Owner)
    await page.click('text=Get Started');
    await page.fill('input[placeholder="Alice Smith"]', 'Alice E2E');
    await page.fill('input[placeholder="alice@example.com"]', `alice_${Date.now()}@e2e.com`);
    await page.fill('input[placeholder="••••••••"] >> nth=0', 'Password123!');
    await page.fill('input[placeholder="••••••••"] >> nth=1', 'Password123!');
    await page.click('button:has-text("Register")');

    await expect(page.getByText('Welcome back, Alice!')).toBeVisible();

    // 3. Report Lost Samsung Galaxy Phone
    await page.click('text=Report Lost');
    await page.fill('input[placeholder="e.g. Black Samsung Galaxy S23 Ultra"]', 'Black Samsung S23 E2E');
    await page.fill('input[placeholder="e.g. Samsung, Apple"]', 'Samsung');
    await page.fill('input[placeholder="e.g. Black, Silver"]', 'Black');
    await page.fill('input[placeholder="e.g. Central Park Library 2nd Floor"]', 'Central Park Library');
    await page.fill('textarea', 'Black Samsung smartphone with clear protective case');
    await page.click('button:has-text("Submit Lost Item Report")');

    await expect(page.getByText('Black Samsung S23 E2E')).toBeVisible();

    // 4. Register Bob (Found Item Finder)
    await page.click('button[title="Logout"]');
    await page.click('text=Get Started');
    await page.fill('input[placeholder="Alice Smith"]', 'Bob E2E');
    const bobEmail = `bob_${Date.now()}@e2e.com`;
    await page.fill('input[placeholder="alice@example.com"]', bobEmail);
    await page.fill('input[placeholder="••••••••"] >> nth=0', 'Password123!');
    await page.fill('input[placeholder="••••••••"] >> nth=1', 'Password123!');
    await page.click('button:has-text("Register")');

    await expect(page.getByText('Welcome back, Bob!')).toBeVisible();

    // 5. Report Found Samsung Phone
    await page.click('text=Report Found');
    await page.fill('input[placeholder="e.g. Black Samsung Phone"]', 'Black Samsung Phone E2E');
    await page.fill('input[placeholder="e.g. Samsung"]', 'Samsung');
    await page.fill('input[placeholder="e.g. Black"]', 'Black');
    await page.fill('input[placeholder="e.g. Central Park Library 2nd Floor"]', 'Central Park Library');
    await page.fill('textarea', 'Black Samsung phone with clear protective cover found');
    await page.click('button:has-text("Submit Found Item Report")');

    // 6. Verify Match Engine identified potential match
    await page.click('text=View All Matches');
    await expect(page.getByText('Strong Match')).toBeVisible();

    // 7. Explain Score Modal
    await page.click('button:has-text("Explain Score")');
    await expect(page.getByText('Explainable Score Breakdown')).toBeVisible();
    await expect(page.getByText('Location Proximity')).toBeVisible();
    await page.click('button:has-text("Close Explanation")');

    // 8. Confirm Match
    await page.click('button:has-text("Confirm Match")');
    await expect(page.getByText('STATUS: ACCEPTED')).toBeVisible();
  });
});
