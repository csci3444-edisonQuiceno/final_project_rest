var mongoose = require('mongoose');

var TeacherRestController = function(TeacherModel) {
    /**
     * Fulfills GET on an echo service to check REST service is UP
     * It returns "echo REST GET returned input msg:" + req.params.msg
     * http://localhost:9016/api/v1/teachers/echo/:msg      GET
     * http://localhost:9016/api/v1/teachers/echo/hohoho    GET
     * 
       curl -i http://localhost:9016/api/v1/teachers/echo/hohoho
     * @param {*} req 
     * @param {*} res 
     */
    var echoMsg = function(req, res) {
        res.status(200);
        res.send("echo REST GET returned input msg:" + req.params.msg);
    };

    /**
     * Fulfills GET REST requests. Returns collection of all teachers in mondodb using the TeacherModel of mongoose that was injected via constructor function
     * http://localhost:9016/api/v1/teachers        GET
     * http://localhost:9016/fdu/api/v1/teachers    GET
     * 
       curl -i http://localhost:9016/api/v1/teachers
       curl -i http://localhost:9016/fdu/api/v1/teachers
     * 
     * @param {*} req Request
     * @param {*} res Response
     */
    var find = function(req, res) {
        TeacherModel.find(function(error, teachers) {
            if (error) {
                res.status(500);
                res.send("Internal server error");
            } else {
                res.status(200);
                res.send(teachers);
            }
        });
    };

    /**
     * Fulfills GET for and id in url REST requests.
     * It returns the teacher instance whose _id value is specified in url and passed as req.params._id
     * You can find pick one of the row's _id value from mongodb, in its client mongo, from output of
     * > db.teachers.find()
     * http://localhost:9016/api/v1/teachers/:id                            GET
     * http://localhost:9016/api/v1/teachers/5a40e050e3ef100228a3be9d       GET
     * http://localhost:9016/fdu/api/v1/teachers/:id                        GET
     * 
       curl  http://localhost:9016/api/v1/teachers/5a40e050e3ef100228a3be9d
       curl -i http://localhost:9016/api/v1/teachers/5a40e050e3ef100228a3be9d
       curl -i -X GET http://localhost:9016/api/v1/teachers/5a40e050e3ef100228a3be9d
       curl  http://localhost:9016/fdu/api/v1/teachers/5a40e050e3ef100228a3be9d
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findById = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    res.status(200);
                    res.send(teacher);
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of GET request. req.params.id:" + req.params.id);
        }
    };

    /**
     * Fulfills POST REST requests. Directly saves teacher object that was passed in req.body.
     * NOTE _id (the primary key that mongodb by default creates an index to speed up finds on) and __v (meaning version) will be added to record by mongodb itself
     * http://localhost:9016/api/v1/teachers        POST
     * 
       curl -X POST -H "Content-Type: application/json" -i -d  '{"teacherId": 0, "name":"ilker_0", "lastname":"kiris_0", "title":"adjunct", "age":200, "isFullTime":false}' http://localhost:9016/api/v1/teachers
       curl -X POST -H "Content-Type: application/json" -d     '{"teacherId": 1, "name":"ilker_1", "lastname":"kiris_1", "title":"instructor", "age":201, "isFullTime":false}' http://localhost:9016/api/v1/teachers
       curl -X POST -H "Content-Type: application/json" --data '{"teacherId": 2, "name":"ilker_2", "lastname":"kiris_2", "title":"assistant", "age":202, "isFullTime":true}' http://localhost:9016/api/v1/teachers
       curl -X POST -H "Content-Type: application/json" -d     '{"teacherId": 3, "name":"ilker_3", "lastname":"kiris_3", "title":"associate", "age":203, "isFullTime":true}' http://localhost:9016/api/v1/teachers
       curl -X POST -H "Content-Type: application/json" -i -d  '{"teacherId": 4, "name":"ilker_4", "lastname":"kiris_4", "title":"adjunct", "age":204, "isFullTime":true}' http://localhost:9016/api/v1/teachers
     * 
     * @param {*} request 
     * @param {*} response 
     */
    var save = function(request, response) {
        var teacher = new TeacherModel(request.body);
        console.log("--> LOOK request: %s", request);
        console.log("--> LOOK JSON.stringify(request.body): %s", JSON.stringify(request.body));
        console.log("--> LOOK request.body: %s", request.body);
        console.log("--> LOOK teacher: %s", teacher);
        teacher.save(function(error) {
            if (error) {
                response.status(500);
                response.send("Save failed");
            } else {
                response.status(201); // 201 means created
                response.send(teacher);
            }
        });
    };

    /**
     * Fulfills PUT REST requests. This is NOT partial update, but full update of teacher record in mongodb for id in the url 
     * 1) Find the teacher from mongodb by id provided in the url
     * 2) Set teacher fetched from mongodb to have values of all the attributes expected to be in the body of request
     * 3) Save the replaced teacher back to mongodb
     * http://localhost:9016/api/v1/teachers/:id                        PUT
     * http://localhost:9016/api/v1/teachers/5a23e035decd2b6770ab4890   PUT
     * 
       curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"ilker_0_update",   "lastname":"kiris_0", "title":"adjunct", "age":200, "isFullTime":false}' http://localhost:9016/api/v1/teachers/5a40e018e3ef100228a3be9c
       curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"ilker_0_update_1", "lastname":"kiris_0", "title":"adjunct", "age":200, "isFullTime":false, "updatedOn":"2017-12-03T12:39:06.446Z"}' http://localhost:9016/api/v1/teachers/5a40e018e3ef100228a3be9c
       curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"ilker_0_update_2", "lastname":"kiris_0", "title":"adjunct", "age":200, "isFullTime":false, "updatedOn":"'"$(date +%Y-%m-%dT%H:%M:%S)"'"}' http://localhost:9016/api/v1/teachers/5a40e018e3ef100228a3be9c
       curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 3, "name":"ilker_3_update",   "lastname":"kiris_3", "title":"associate", "age":200, "isFullTime":false, "updatedOn":"'"$(date +%Y-%m-%dT%H:%M:%S)"'"}' http://localhost:9016/api/v1/teachers/5a40e0a7e3ef100228a3be9f
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdateFullyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    console.log("req.body.updatedOn: %s", req.body.updatedOn);
                    teacher.teacherId = req.body.teacherId;
                    teacher.name = req.body.name;
                    teacher.lastname = req.body.lastname;
                    teacher.title = req.body.title;
                    teacher.age = req.body.age;
                    teacher.isFullTime = req.body.isFullTime;
                    teacher.updatedOn = req.body.updatedOn;

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201);
                            res.send(teacher);
                        }
                    });
                }
            });
        } else {
            res.status(400);
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PUT request. req.params.id:" + req.params.id);
        }
    };

    /**
     * Fulfills PATCH REST requests. This allows partial update of teacher record. 
     * 1) Find the teacher from mongodb by id provided in the url
     * 2) Loop over the attribute names in the body of request and set their values in the teacher that was fetched from mongodb
     * 3) Save the updated teacher back to mongodb
     * http://localhost:9016/api/v1/teachers/:id             PATCH
     * 
       curl -X PATCH -H "Content-Type: application/json" -i -d '{"title":"instructor", "age":123, "isFullTime":false}' http://localhost:9016/api/v1/teachers/5a40e07be3ef100228a3be9e
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdatePartiallyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    // if incoming PUT request's body has accidentally _id, remove it from req.body
                    if (req.body._id) {
                        delete req.body._id;
                    }
                    // loop over the attributes in req.body and set them in teacher object
                    for (var attrName in req.body) {
                        teacher[attrName] = req.body[attrName];
                    }

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201); // In this case means updated
                            res.send(teacher);
                        }
                    })
                }
            });
        } else {
            res.status(400);
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PATCH request. req.params.id:" + req.params.id);
        }
    };

    /**
     * Fulfills DELETE REST requests.
     * Removes (Deletes) the teacher row whose _id value is specied in the url and passed in req.
     * NOTE _id and _version will be added to record by mongodb itself
     * http://localhost:9016/api/v1/teachers/:id             DELETE
     * 
       curl -X DELETE -i http://localhost:9016/api/v1/teachers/5a40e050e3ef100228a3be9d
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdThenRemove = function(req, res) {
        try {
            console.log("findByIdThenRemove req.params.id:%s", req.params.id);
            // mongoose.Types.ObjectId.isValid(req.params.id) returns true for any 12 byte string input
            if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
                console.log(" again findByIdThenRemove req.params.id:%s", req.params.id);
                TeacherModel.findById(req.params.id, function(error, teacher) {
                    if (error) {
                        console.log("findByIdThenRemove error:" + error);
                        res.status(404);
                        res.send("Not found Teacher for id:" + req.params.id);
                    } else {
                        teacher.remove(function(error) {
                            if (error) {
                                res.status(500);
                                res.send("Remove failed");
                            } else {
                                res.status(204); // 204 means deleted
                                res.send(teacher);
                            }
                        })
                    }
                });
            } else {
                res.status(400);
                res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request. req.params.id:" + req.params.id);
            }

        } catch (e) {
            res.status(500); // 500 means "Internal Server Error". Could also be due to mongodb/js-bson#205 bug that throws CastError, not being able to parse the wrong(short) _id value to objectId
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request may be not a valid ObjectId value. req.params.id:" + req.params.id);
        }
    };

    /**
     * Fulfills DELETE REST requests.
     * Removes (Deletes) the teacher row whose _id value is specied in the body and passed in req.body._id
     * http://localhost:9016/api/v1/teachers        DELETE
     * 
       curl -X DELETE -H "Content-Type: application/json" -i -d '{"_id":"5a40e07be3ef100228a3be9e"}' http://localhost:9016/api/v1/teachers
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdInBodyThenRemove = function(req, res) {
        console.log("findByIdInBodyThenRemove req.body._id:%s", req.body._id);
        if (req.body && req.body._id && mongoose.Types.ObjectId.isValid(req.body._id)) {
            TeacherModel.findById(req.body._id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found Teacher for id:" + req.body._id);
                } else {
                    console.log("LAGA%sLUGA", error);
                    teacher.remove(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Remove failed");
                        } else {
                            res.status(204); // "No Content"
                            res.send(teacher);
                        }
                    })
                }
            });

        } else {
            res.status(400);
            res.send("Check inputs of request. InCorrect inputs. Expected _id in body of DELETE request");
        }
    };

    // expose public functions via returned object below from this module
    return {
        echoMsg: echoMsg,
        find: find,
        findById: findById,
        save: save,
        findByIdUpdateFullyThenSave: findByIdUpdateFullyThenSave,
        findByIdUpdatePartiallyThenSave: findByIdUpdatePartiallyThenSave,
        findByIdThenRemove: findByIdThenRemove,
        findByIdInBodyThenRemove: findByIdInBodyThenRemove
    }
};

module.exports = TeacherRestController;