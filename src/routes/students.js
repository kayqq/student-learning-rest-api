import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).send(Object.values(req.context.models.students));
});

router.post('/', (req, res) => {
  const { id, limit } = req.query;

  if (!id || !limit) return res.status(400).end();

  const student = {
    id,
    limit,
    enrolled: [],
    waitlisted: [],
  };

  if (!(id in req.context.models.students)) {
    // student is not existing, add student
    req.context.models.students[id] = student;
    return res.status(200).send(Object.values(req.context.models.students));
  } else {
    return res.status(400).end()
  }
});

router.post('/:student_id/enroll', (req, res) => {
    const { course_key } = req.query;
    const { student_id } = req.params;
    const student = req.context.models.students[student_id];
    const course = req.context.models.courses[course_key];
    let status = 200;

    // student or course doesn't exist, return error
    if (!student || !course) return res.status(400).end(); 

    // TODO: following logic can be abstracted into a controller called 'enroll'
    if (student.enrolled.length < student.limit && !student.enrolled.includes(course_key)) {
        // student can enroll
        if (course.enrolled.length < course.limit && !course.enrolled.includes(student_id)) {
            // course can enroll
            
            // add student to course's enrolled list
            req.context.models.courses[course_key].enrolled.push(student_id);

            // add course to student's course list
            req.context.models.students[student_id].enrolled.push(course_key);
        } else {
            // course is full, add student to waitlist
            req.context.models.courses[course_key].wait_list.push(student_id);
            req.context.models.students[student_id].waitlisted.push(course_key);
        }
    } else {
        status = 400;
    }
    return res.status(status).send(req.context.models.students[student_id]);
});

router.post('/:student_id/drop', (req, res) => {
    const { course_key } = req.query;
    const { student_id } = req.params;
    const student = req.context.models.students[student_id];
    const course = req.context.models.courses[course_key];
    let status = 200;

    // student or course doesn't exist, return error
    if (!student || !course) return res.status(400).end();

    if (student.enrolled.indexOf(course_key) >= 0) {
        // remove course from student's course list
        const index = student.enrolled.indexOf(course_key);
        req.context.models.students[student_id].enrolled.splice(index, 1);
    }

    if (course.enrolled.indexOf(student_id) >= 0) {
        // remove student from course's enrolled list
        const index = course.enrolled.indexOf(student_id);
        req.context.models.courses[course_key].enrolled.splice(index, 1);
    }

    if (course.wait_list.length > 0) {
        // enroll waiting student from wait list into course, top first
        const newStudent_id = req.context.models.courses[course_key].wait_list[0];
        const newStudent = req.context.models.students[newStudent_id];

        if (newStudent.enrolled.length < newStudent.limit && !newStudent.enrolled.includes(course_key)) {
            // student can enroll
            if (!course.enrolled.includes(newStudent_id)) {
                // course can enroll

                // remove student from course's waitlist
                req.context.models.courses[course_key].wait_list.shift();

                // remove course from student's waitlist
                const index = req.context.models.students[newStudent_id].waitlisted.indexOf(course_key);
                req.context.models.students[newStudent_id].waitlisted.splice(index, 1);
                
                // add student to course's enrolled list
                req.context.models.courses[course_key].enrolled.push(newStudent_id);

                // add course to student's course list
                req.context.models.students[newStudent_id].enrolled.push(course_key);
            }
        }
    }

    return res.status(status).send(req.context.models.students[student_id]);
});

export default router;
