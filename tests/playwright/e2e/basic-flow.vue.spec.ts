import { test, expect } from '@playwright/test';

test('Vue Flow example page loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check that the Vue Flow component is visible
  await expect(page.locator('.vue-flow')).toBeVisible();

  // Check that the nodes are rendered
  await expect(page.locator('.vue-flow__node')).toHaveCount(3);

  // Check that the edges are rendered
  await expect(page.locator('.vue-flow__edge')).toHaveCount(2);

  // Verify the control panel is visible
  await expect(page.locator('.vue-flow__controls')).toBeVisible();

  // Verify the minimap is visible
  await expect(page.locator('.vue-flow__minimap')).toBeVisible();

  // Verify the add node button works
  await page.locator('button:has-text("Add Node")').click();
  await expect(page.locator('.vue-flow__node')).toHaveCount(4);

  // Verify the reset button works
  await page.locator('button:has-text("Reset")').click();
  await expect(page.locator('.vue-flow__node')).toHaveCount(3);
});

test('Vue Flow handles node interaction correctly', async ({ page }) => {
  await page.goto('/');

  // Get the position of the first node
  const firstNode = page.locator('.vue-flow__node').first();
  const initialBoundingBox = await firstNode.boundingBox();

  // Drag and drop a node
  await firstNode.dragTo(firstNode, {
    targetPosition: {
      x: initialBoundingBox.x + 100,
      y: initialBoundingBox.y + 100,
    },
  });

  // Verify the node has moved
  const newBoundingBox = await firstNode.boundingBox();
  expect(newBoundingBox.x).not.toEqual(initialBoundingBox.x);
  expect(newBoundingBox.y).not.toEqual(initialBoundingBox.y);

  // Click a node and verify it's selected
  await firstNode.click();
  await expect(firstNode).toHaveClass(/selected/);
});
