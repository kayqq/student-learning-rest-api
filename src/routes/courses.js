import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).send(Object.values(req.context.models.courses));
});

router.post('/', (req, res) => {
  const { key, limit } = req.query;

  if (!key || !limit) return res.status(400).end();

  const course = {
    key,
    limit,
    enrolled: [],
    wait_list: [],
  };

  if (!(key in req.context.models.courses)) {
    // course is not existing, add course
    req.context.models.courses[key] = course;
    return res.status(200).send(Object.values(req.context.models.courses));
  } else {
    return res.status(400).end()
  }
});

export default router;
