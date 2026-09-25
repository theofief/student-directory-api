const allowedFields = [
  'informatique',
  'mathématiques',
  'physique',
  'chimie',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudent(student) {
  const requiredFields = ['firstName', 'lastName', 'email', 'grade', 'field'];
  const missingField = requiredFields.find((field) => student[field] === undefined);

  if (missingField) {
    return `Le champ ${missingField} est obligatoire`;
  }

  if (typeof student.firstName !== 'string' || student.firstName.trim().length < 2) {
    return 'Le prénom doit contenir au moins 2 caractères';
  }

  if (typeof student.lastName !== 'string' || student.lastName.trim().length < 2) {
    return 'Le nom doit contenir au moins 2 caractères';
  }

  if (typeof student.email !== 'string' || !emailPattern.test(student.email)) {
    return "Le format de l'email est invalide";
  }

  if (typeof student.grade !== 'number' || student.grade < 0 || student.grade > 20) {
    return 'La note doit être un nombre compris entre 0 et 20';
  }

  if (!allowedFields.includes(student.field)) {
    return "La filière n'est pas autorisée";
  }

  return null;
}

export function parseStudentId(value) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
