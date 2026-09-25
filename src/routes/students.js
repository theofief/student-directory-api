import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from '../data/students.js';
import { parseStudentId, validateStudent } from '../validation/student.js';

const router = Router();

function normalizeStudent(student) {
  return {
    firstName: student.firstName.trim(),
    lastName: student.lastName.trim(),
    email: student.email.trim().toLowerCase(),
    grade: student.grade,
    field: student.field,
  };
}

function emailExists(email, excludedId = null) {
  const normalizedEmail = email.trim().toLowerCase();
  return getStudents().some(
    (student) => student.id !== excludedId && student.email.toLowerCase() === normalizedEmail,
  );
}

router.get('/', (request, response) => {
  response.status(200).json(getStudents());
});

router.get('/stats', (request, response) => {
  const students = getStudents();
  const studentsByField = students.reduce((counts, student) => {
    counts[student.field] = (counts[student.field] || 0) + 1;
    return counts;
  }, {});
  const average = students.length === 0
    ? 0
    : students.reduce((total, student) => total + student.grade, 0) / students.length;
  const bestStudent = students.length === 0
    ? null
    : students.reduce((best, student) => student.grade > best.grade ? student : best);

  response.status(200).json({
    totalStudents: students.length,
    averageGrade: Number(average.toFixed(2)),
    studentsByField,
    bestStudent,
  });
});

router.get('/search', (request, response) => {
  const query = typeof request.query.q === 'string' ? request.query.q.trim() : '';

  if (!query) {
    return response.status(400).json({ error: 'Le paramètre q est obligatoire' });
  }

  const normalizedQuery = query.toLocaleLowerCase('fr');
  const results = getStudents().filter((student) =>
    student.firstName.toLocaleLowerCase('fr').includes(normalizedQuery)
    || student.lastName.toLocaleLowerCase('fr').includes(normalizedQuery));

  return response.status(200).json(results);
});

router.get('/:id', (request, response) => {
  const id = parseStudentId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: "L'identifiant est invalide" });
  }

  const student = getStudents().find((item) => item.id === id);
  if (!student) {
    return response.status(404).json({ error: 'Étudiant introuvable' });
  }

  return response.status(200).json(student);
});

router.post('/', (request, response) => {
  const validationError = validateStudent(request.body);
  if (validationError) {
    return response.status(400).json({ error: validationError });
  }

  if (emailExists(request.body.email)) {
    return response.status(409).json({ error: 'Cet email est déjà utilisé' });
  }

  const student = createStudent(normalizeStudent(request.body));
  return response.status(201).json(student);
});

router.put('/:id', (request, response) => {
  const id = parseStudentId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: "L'identifiant est invalide" });
  }

  if (!getStudents().some((student) => student.id === id)) {
    return response.status(404).json({ error: 'Étudiant introuvable' });
  }

  const validationError = validateStudent(request.body);
  if (validationError) {
    return response.status(400).json({ error: validationError });
  }

  if (emailExists(request.body.email, id)) {
    return response.status(409).json({ error: 'Cet email est déjà utilisé' });
  }

  const student = updateStudent(id, normalizeStudent(request.body));
  return response.status(200).json(student);
});

router.delete('/:id', (request, response) => {
  const id = parseStudentId(request.params.id);
  const student = id === null
    ? null
    : getStudents().find((item) => item.id === id);

  if (!student) {
    return response.status(404).json({ error: 'Étudiant introuvable' });
  }

  deleteStudent(id);
  return response.status(200).json({ message: 'Étudiant supprimé avec succès' });
});

export default router;
