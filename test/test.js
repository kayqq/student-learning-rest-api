var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
// let server = require("../src");
let should = chai.should();

let server = "http://localhost:3000";

chai.use(chaiHttp);

describe("Student Learning Management System", function(){

    describe ("CRUD OPERATIONS", function(){
        var courses = [
            {
                key: "cs101",
                limit: "2", 
            },
            {
                key: "nd001",
                limit: "1", 
            },
            {
                key: "nd200",
                limit: "3", 
            },
        ];

        var students = [
            {
                id: "lisa1",
                limit: "3",
            },
            {
                id: "bart2",
                limit: "2",
            },
            {
                id: "hom3r",
                limit: "1",
            },
        ];

        it("Should add 3 Courses to the system", (done) => {
            courses.forEach(course => {
                chai.request(server)
                    .post('/courses')
                    .query({key: course.key, limit: course.limit}) 
                    .end((err, res) => {
                        res.should.have.status(200);
                    });
            });
            done();
        });

        it("Should add 3 Students to the system", (done) => {
            students.forEach(student => {
                chai.request(server)
                    .post('/students')
                    .query({id: student.id, limit: student.limit}) 
                    .end((err, res) => {
                        res.should.have.status(200);
                    });
            });
            done();
        });

        it("Should enroll hom3r to the cs101", (done) => {
            chai.request(server)
                .post('/students/hom3r/enroll')
                .query({course_key: 'cs101'}) 
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done();
        });

        it("Should enroll lisa1 to the cs101", (done) => {
            chai.request(server)
                .post('/students/lisa1/enroll')
                .query({course_key: 'cs101'}) 
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done();
        });

        it("Should waitlist bart2 to the cs101", (done) => {
            chai.request(server)
                .post('/students/bart2/enroll')
                .query({course_key: 'cs101'}) 
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done();
        });

        it("Should NOT enroll hom3r to the nd001", (done) => {
            chai.request(server)
                .post('/students/hom3r/enroll')
                .query({course_key: 'nd001'}) 
                .end((err, res) => {
                    res.should.have.status(400);
                });
            done();
        });

        it("Should enroll lisa1 to the nd001", (done) => {
            chai.request(server)
                .post('/students/lisa1/enroll')
                .query({course_key: 'nd001'}) 
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done();
        });

        it("Should NOT enroll bart2 to the nd001, but waitlist", (done) => {
            chai.request(server)
                .post('/students/bart2/enroll')
                .query({course_key: 'nd001'}) 
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done();
        });

        it("Should drop hom3r from cs101", (done) => {
            chai.request(server)
                .post('/students/hom3r/drop')
                .query({course_key: 'cs101'}) 
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done();
        });

        it("Should enroll hom3r to the nd200", (done) => {
            chai.request(server)
                .post('/students/hom3r/enroll')
                .query({course_key: 'nd200'}) 
                .end((err, res) => {
                    res.should.have.status(200);
                });
            done();
        });

        it("Should GET /students", (done) => {
            chai.request(server)
                .get('/students')
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200);
                });
            done();
        });

    })
})