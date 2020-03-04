const app = require("../index");

const supertest = require("supertest");
const request = supertest(app);

// start Posts APi test
describe("Posts Routes API", () => {
  // Test the ping route
  describe("Get /api/ping", () => {
    it("should GET the ping request", async done => {
      const res = await request.get("/api/ping");

      expect(res.status).toBe(200);
      done();
    });
  });

  //1. Test route without query tag
  describe("Get /api/posts", () => {
    it("should throw error if query parameter tags is not set", async done => {
      const res = await request.get("/api/posts");
      expect(res.status).toBe(400);
      expect(typeof res.body.message).toBe("string");
      expect(res.body.message).toEqual("Tags parameter is required");
      done();
    });
  });

  //2. Test route with single query tags set
  describe("Get /api/posts?tags=tech", () => {
    it("should return all posts with tag 'tech' !", async done => {
      const res = await request.get("/api/posts?tags=tech");
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("posts");
      expect(res.body.posts.length).toBeGreaterThan(0);
      await res.body.posts.forEach(post => {
        expect(post).toHaveProperty(["tags"]);
        const expected = [expect.stringMatching(/^tech/)];
        expect(post.tags).toEqual(expect.arrayContaining(expected));
      });
      done();
    });
  });

  //3. Test route with single query tags set
  describe("Get /api/posts?tags=tech,science,startups", () => {
    it("should return all posts with tag 'tech,science,startups' but not have duplicates!", async done => {
      const res = await request.get(`/api/posts?tags=tech,science,startups`);

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("posts");
      expect(res.body.posts.length).toBeGreaterThan(0);

      await res.body.posts.forEach(post => {
        expect(post).toHaveProperty(["tags"]);
        const expected = [expect.stringMatching(/^tech|startups|science/)];
        expect(post.tags).toEqual(expect.arrayContaining(expected));
      });
      const ids = await res.body.posts.map(post => post.id);
      const doubles = await ids.filter(
        (s => v => s.has(v) || !s.add(v))(new Set())
      );
      expect(doubles.length).toBe(0);
      done();
    });
  });
  //4. Test with query single param tags && sortBy
  describe("Get /api/posts?tags=tech&sortBy", () => {
    it("should return all posts with tag 'tech' and sortBy default(id) in asc order!", async done => {
      const res = await request.get(`/api/posts?tags=tech&sortBy`);

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe("object");
      expect(res.body).toHaveProperty("posts");
      expect(res.body.posts.length).toBeGreaterThan(0);
      await res.body.posts.forEach(post => {
        expect(post).toHaveProperty(["tags"]);
        const expected = [expect.stringMatching(/^tech/)];
        expect(post.tags).toEqual(expect.arrayContaining(expected));
      });
      expect(res.body.posts[0].id).toBeLessThan(res.body.posts[1].id);
      done();
    });
  });

  //5. Test with query single param tags && sortBy=reads
  describe("Get /api/posts?tags=tech&sortBy=reads", () => {
    it("should return all posts with tag 'tech' & sortBy 'reads' in asc order!", async done => {
      const res = await request.get(`/api/posts?tags=tech&sortBy=reads`);
      expect(res.body.posts[0].reads).toBeLessThanOrEqual(
        res.body.posts[1].reads
      );
      expect(
        res.body.posts[res.body.posts.length - 1].reads
      ).toBeGreaterThanOrEqual(res.body.posts[res.body.posts.length - 2].reads);
      done();
    });
  });

  //6. Test with query single param tags && sortBy=likes
  describe("Get /api/posts?tags=tech&sortBy=likes", () => {
    it("should return all posts with tag 'tech' & sortBy 'likes' in asc order!", async done => {
      const res = await request.get(`/api/posts?tags=tech&sortBy=likes`);
      expect(res.body.posts[0].likes).toBeLessThanOrEqual(
        res.body.posts[1].likes
      );
      expect(
        res.body.posts[res.body.posts.length - 1].likes
      ).toBeGreaterThanOrEqual(res.body.posts[res.body.posts.length - 2].likes);
      done();
    });
  });
  //7. Test with query single param tags && sortBy=likes
  describe("Get /api/posts?tags=tech&sortBy=popularity", () => {
    it("should return all posts with tag 'tech' & sortBy 'popularity' in asc order!", async done => {
      const res = await request.get(`/api/posts?tags=tech&sortBy=popularity`);
      expect(res.body.posts[0].popularity).toBeLessThanOrEqual(
        res.body.posts[1].popularity
      );
      expect(
        res.body.posts[res.body.posts.length - 1].popularity
      ).toBeGreaterThanOrEqual(
        res.body.posts[res.body.posts.length - 2].popularity
      );
      done();
    });
  });
  //8. Test with query single param tags && sortBy=id
  describe("Get /api/posts?tags=tech&sortBy=id&direction=desc", () => {
    it("should return all posts with tag 'tech' & sortBy 'id' in desc order!", async done => {
      const res = await request.get(
        `/api/posts?tags=tech&sortBy=id&direction=desc`
      );
      expect(res.body.posts[0].id).toBeGreaterThan(res.body.posts[1].id);
      expect(res.body.posts[res.body.posts.length - 1].id).toBeLessThan(
        res.body.posts[res.body.posts.length - 2].id
      );
      done();
    });
  });
  //9. Test with query single param tags && sortBy=invalid
  describe("Get /api/posts?tags=tech&sortBy=invalid", () => {
    it("should return error if sortBy value is 'invalid'!", async done => {
      const res = await request.get(`/api/posts?tags=tech&sortBy=invalid`);
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual(
        "sortBy parameter is invalid, please sort by id, reads,likes or popularity"
      );

      done();
    });
  });

  //10. Test route with empty query tag
  describe("Get /api/posts?tags=", () => {
    it("should throw error if query parameter tags is empty", async done => {
      const res = await request.get("/api/posts?tags=");
      expect(res.status).toBe(400);
      expect(typeof res.body.message).toBe("string");
      done();
    });
  });
});
