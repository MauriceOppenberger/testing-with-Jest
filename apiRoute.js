const app = require("./index");
// const chaiHttp = require("chai-http");
// const chai = require("chai");
// const ChaiSorted = require("chai-sorted");

const supertest = require("supertest");
const request = supertest(app);


chai.use(ChaiSorted);
chai.use(chaiHttp);
var expect = chai.expect;
// start Posts APi test
describe("Posts Routes API", () => {
                                   
                                     // Test the ping route
                                     describe("Get /api/ping", () => {
                                       it("should GET the ping request", done => {
                                         chai
                                           .request(app)
                                           .get("/api/ping")
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(200);
                                             done();
                                           });
                                       });
                                     });

                                     //*
                                     // Test the /api/posts route

                                     //1. Test route without query tag
                                     describe("Get /api/posts", () => {
                                       it("should throw error if query parameter tags is not set", done => {
                                         chai
                                           .request(app)
                                           .get("/api/posts")
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(400);
                                             expect(res.body.message).to.be.a(
                                               "string"
                                             );
                                             expect(res.body.message).to.equal(
                                               "Tags parameter is required"
                                             );
                                             done();
                                           });
                                       });
                                     });

                                     //2. Test route with single query tags set
                                     describe("Get /api/posts?tags=tech", () => {
                                       it("should return all posts with tag 'tech'!", done => {
                                         chai
                                           .request(app)
                                           .get("/api/posts?tags=tech")
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(200);
                                             expect(res.body).to.be.a("object");
                                             done();
                                           });
                                       });
                                     });

                                     //3. Test with multiple query tags
                                     describe("Get /api/posts?tags=tech,sience,startup", () => {
                                       it(`should return all posts array with tag "tech","sience","startup in asc order without duplicates"`, done => {
                                         chai
                                           .request(app)
                                           .get(
                                             "/api/posts?tags=tech,sience,startup"
                                           )
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(200);
                                             expect(res.body).to.be.a("object");
                                             expect(res.body.posts).to.be.a(
                                               "array"
                                             );
                                             expect([
                                               res.body.posts[0],
                                               res.body.posts[1]
                                             ]).to.be.sortedBy("id", {
                                               descending: false
                                             });
                                             expect(
                                               res.body.posts[0].id
                                             ).to.be.equal(1);
                                             expect(
                                               res.body.posts[1].id
                                             ).to.be.equal(2);
                                             done();
                                           });
                                       });
                                     });

                                     //4. Test with query single param tags && sortBy
                                     describe("Get /api/posts?tags=tech&sortBy", () => {
                                       it("should return all post with tag tech & sorted by id (default)", done => {
                                         chai
                                           .request(app)
                                           .get("/api/posts?tags=tech&sortBy")
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(200);
                                             expect(res.body).to.be.a("object");
                                             expect(res.body.posts).to.be.a(
                                               "array"
                                             );
                                             done();
                                           });
                                       });
                                     });

                                     //5. Test with query multiple param tags && sortBy
                                     describe("Get /api/posts?tags=tech,sience&sortBy=read", () => {
                                       it("should return all post with tag 'tech', 'sience' & sorted by reads", done => {
                                         chai
                                           .request(app)
                                           .get(
                                             "/api/posts?tags=tech,sience&sortBy=reads"
                                           )
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(200);
                                             expect(res.body).to.be.a("object");
                                             expect(res.body.posts).to.be.a(
                                               "array"
                                             );
                                             done();
                                           });
                                       });
                                     });

                                     // 7. Test with query multiple param tags && invalid sortBy value
                                     describe("Get /api/posts?tags=tech,sience&sortBy=invalid", () => {
                                       it("should throw an error and return error message", done => {
                                         chai
                                           .request(app)
                                           .get(
                                             "/api/posts?tags=tech,sience&sortBy=invalid"
                                           )
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(400);
                                             expect(res.body.message).to.be.a(
                                               "string"
                                             );
                                             expect(
                                               res.body.message
                                             ).to.be.equal(
                                               "sortBy parameter is invalid, please sort by id, reads,likes or popularity"
                                             );
                                             done();
                                           });
                                       });
                                     });

                                     //8. Test with query multiple param tags && sortBy && directions
                                     describe("Get /api/posts?tags=tech,sience&sortBy&direction", () => {
                                       it("should return all post with tag 'tech', 'sience' & sorted by id(defaut) in asc order (default)", done => {
                                         chai
                                           .request(app)
                                           .get(
                                             "/api/posts?tags=tech,sience&sortBy&direction"
                                           )
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(200);
                                             expect(res.body).to.be.a("object");
                                             expect(res.body.posts).to.be.a(
                                               "array"
                                             );
                                             expect([
                                               res.body.posts[0],
                                               res.body.posts[1]
                                             ]).to.be.sortedBy("id", {
                                               descending: false
                                             });
                                             done();
                                           });
                                       });
                                     });

                                     //7. Test with sorted in desc order
                                     describe("Get /api/posts?tags=tech&sortBy=reads&direction=desc", () => {
                                       it('should return post with tag "tech" sorted by id in desc order', done => {
                                         chai
                                           .request(app)
                                           .get(
                                             "/api/posts?tags=tech&sortBy=id&direction=desc"
                                           )
                                           .end((err, res) => {
                                             expect(err).to.be.null;
                                             expect(res).to.have.status(200);
                                             expect(res.body).to.be.a("object");
                                             expect(res.body.posts).to.be.a(
                                               "array"
                                             );
                                             expect([
                                               res.body.posts[0],
                                               res.body.posts[1]
                                             ]).to.be.sortedBy("reads", {
                                               descending: true
                                             });
                                             done();
                                           });
                                       });
                                     });
                                     //end test Posts APi test
                                   })
