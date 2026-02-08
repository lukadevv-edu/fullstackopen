const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ request }) => {
    // Clear the database
    await request.post("/api/testing/reset");

    // Create a new user
    await request.post("/api/users", {
      data: {
        name: "Lucas",
        username: "lukadevv",
        password: "123123123",
      },
    });
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("");

    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByText("login")).toBeVisible();
  });

  describe("Login", () => {
    beforeEach(async ({ page }) => {
      await page.goto("");
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await page.locator('input[name="Username"]').fill("lukadevv");
      await page.locator('input[name="Password"]').fill("123123123");

      await page.getByText("login").click();

      await expect(page.getByText("logout")).toBeVisible();
      await expect(page.getByText("create new blog")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.locator('input[name="Username"]').fill("admin");
      await page.locator('input[name="Password"]').fill("123");

      await page.getByText("login").click();

      await expect(page.locator('input[name="Username"]')).toBeVisible();
      await expect(page.locator('input[name="Password"]')).toBeVisible();

      await expect(page.locator(".error")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.goto("");

      await page.locator('input[name="Username"]').fill("lukadevv");
      await page.locator('input[name="Password"]').fill("123123123");

      await page.getByText("login").click();
    });

    test("a new blog can be created", async ({ page }) => {
      await expect(page.getByText("create new blog")).toBeVisible();

      await page.getByText("create new blog").click();

      await page.locator('input[name="Title"]').fill("E2E testing - $01");
      await page.locator('input[name="Author"]').fill("lukadevv");
      await page.locator('input[name="Url"]').fill("https://lukadevv.com");

      await page.locator('button[type="submit"]').click();

      await expect(page.locator(".alert")).toBeVisible();
    });

    test("a blog can be edited", async ({ page }) => {
      {
        await expect(page.getByText("create new blog")).toBeVisible();

        await page.getByText("create new blog").click();

        await page.locator('input[name="Title"]').fill("E2E testing - $02");
        await page.locator('input[name="Author"]').fill("lukadevv");
        await page.locator('input[name="Url"]').fill("https://lukadevv.com");

        await page.locator('button[type="submit"]').click();

        await expect(page.locator(".alert")).toBeVisible();
      }

      await page.getByText("view").click();

      const preValue = Number(page.getByText("like").innerText());
      await page.getByText("like").click();
      const postValue = Number(page.getByText("like").innerText());

      expect(preValue + 1).toBe(postValue);
    });

    test("a blog can be deleted", async ({ page }) => {
      {
        await expect(page.getByText("create new blog")).toBeVisible();

        await page.getByText("create new blog").click();

        await page.locator('input[name="Title"]').fill("E2E testing - $03");
        await page.locator('input[name="Author"]').fill("lukadevv");
        await page.locator('input[name="Url"]').fill("https://lukadevv.com");

        // Delete button can only be shown by the user who made it (5.22)
        await page.locator('button[type="submit"]').click();

        await expect(page.locator(".alert")).toBeVisible();
      }

      await page.getByText("view").click();

      // Set listener
      page.on("dialog", async (dialog) => {
        dialog.accept();

        await expect(page.locator(".alert")).toBeVisible();
      });

      await page.getByText("remove").click();
    });

    test("sort by likes", async ({ page }) => {
      const values = {
        GitHub: 4,
        Netflix: 1,
        AWS: 5,
        Google: 7,
        Cloudflare: 6,
        University: 3,
        FullStackOpen: 8,
      };

      let firstCreation = 0;

      // Utilities

      async function createPost(title, author, url) {
        if (!firstCreation++) {
          await expect(page.getByText("create new blog")).toBeVisible();
          await page.getByText("create new blog").click();
        }
        await page.locator('input[name="Title"]').fill(title);
        await page.locator('input[name="Author"]').fill(author);
        await page.locator('input[name="Url"]').fill(url);
        await page.locator('button[type="submit"]').click();
        await expect(page.locator(".alert")).toBeVisible();
      }

      async function like(title, count) {
        const container = page
          .getByText(`${title} lukadevv`)
          .locator("xpath=./ancestor::div[2]");

        const viewButton = container.getByRole("button", { name: "view" });

        await expect(viewButton).toBeVisible();
        await viewButton.click();

        const likeButton = container.getByText("like");
        await expect(likeButton).toBeVisible();

        async function getLikeCount() {
          const countElement = likeButton.locator("xpath=preceding-sibling::p");
          return Number(await countElement.innerText());
        }

        let lastValue = await getLikeCount();
        expect(lastValue).toBe(0);

        {
          const blog = page
            .locator('div[style*="border: 1px solid"]')
            .filter({ hasText: `${title} lukadevv` });

          const likeButton = blog.getByRole("button", { name: "like" });
          const countLocator = blog.locator("p").filter({ hasText: /^\d+$/ });

          while (true) {
            const current = Number(await countLocator.innerText());
            if (current >= count) break;

            await likeButton.click();

            await page.waitForTimeout(300);
          }

          expect(await countLocator.innerText()).toBe(String(count));
        }

        await container.getByText("hide").click();
      }

      // Actions
      {
        for (const each in values) {
          await createPost(each, "lukadevv", "https://lukadevv.com");
        }

        for (const each in values) {
          await like(each, values[each]);
        }
      }

      // Check sort
      {
        const blogItems = page.locator('div[style*="border: 1px solid"]');
        const count = await blogItems.count();
        let previousLikes = Infinity;

        for (let i = 0; i < count; i++) {
          const currentBlog = blogItems.nth(i);
          const viewButton = currentBlog.getByRole("button", { name: "view" });

          if (await viewButton.isVisible()) {
            await viewButton.click();
          }

          const likeButton = currentBlog.getByRole("button", { name: "like" });
          const countElement = likeButton.locator("xpath=preceding-sibling::p");
          const currentLikes = Number(await countElement.innerText());

          expect(currentLikes).toBeLessThanOrEqual(previousLikes);

          previousLikes = currentLikes;

          await currentBlog.getByRole("button", { name: "hide" }).click();
        }
      }
    });
  });
});
