const initialStudents = [
  {
    id: 1,
    firstName: 'Ahmed',
    lastName: 'Benali',
    email: 'ahmed.benali@example.com',
    grade: 16.5,
    field: 'informatique',
  },
  {
    id: 2,
    firstName: 'Chloé',
    lastName: 'Martin',
    email: 'chloe.martin@example.com',
    grade: 14,
    field: 'mathématiques',
  },
  {
    id: 3,
    firstName: 'Lucas',
    lastName: 'Bernard',
    email: 'lucas.bernard@example.com',
    grade: 11.5,
    field: 'physique',
  },
  {
    id: 4,
    firstName: 'Inès',
    lastName: 'Dubois',
    email: 'ines.dubois@example.com',
    grade: 18,
    field: 'chimie',
  },
  {
    id: 5,
    firstName: 'Hugo',
    lastName: 'Petit',
    email: 'hugo.petit@example.com',
    grade: 9.5,
    field: 'informatique',
  },
];

let students = structuredClone(initialStudents);
let nextId = initialStudents.length + 1;

export function getStudents() {
  return students;
}

export function createStudent(student) {
  const newStudent = { id: nextId, ...student };
  nextId += 1;
  students.push(newStudent);
  return newStudent;
}

export function updateStudent(id, student) {
  const index = students.findIndex((item) => item.id === id);
  students[index] = { id, ...student };
  return students[index];
}

export function deleteStudent(id) {
  const index = students.findIndex((student) => student.id === id);
  students.splice(index, 1);
}

export function resetStudents() {
  students = structuredClone(initialStudents);
  nextId = initialStudents.length + 1;
}
