import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../src/app.js';
import { resetStudents } from '../src/data/students.js';

const validStudent = {
  firstName: 'Sonia',
  lastName: 'Diallo',
  email: 'sonia.diallo@example.com',
  grade: 15,
  field: 'informatique',
};

beforeEach(() => {
  resetStudents();
});

describe('GET /students', () => {
  it('renvoie un tableau avec le statut 200', async () => {
    const response = await request(app).get('/students');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('renvoie les cinq étudiants initiaux', async () => {
    const response = await request(app).get('/students');

    expect(response.body).toHaveLength(5);
  });
});

describe('GET /students/:id', () => {
  it("renvoie l'étudiant demandé", async () => {
    const response = await request(app).get('/students/1');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 1, firstName: 'Ahmed' });
  });

  it('renvoie 404 pour un identifiant inexistant', async () => {
    const response = await request(app).get('/students/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('renvoie 400 pour un identifiant non numérique', async () => {
    const response = await request(app).get('/students/abc');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe('POST /students', () => {
  it('crée un étudiant et renvoie 201', async () => {
    const response = await request(app).post('/students').send(validStudent);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ ...validStudent, id: 6 });
  });

  it('renvoie 400 si un champ obligatoire manque', async () => {
    const { email, ...studentWithoutEmail } = validStudent;
    const response = await request(app).post('/students').send(studentWithoutEmail);

    expect(email).toBeDefined();
    expect(response.status).toBe(400);
  });

  it('renvoie 400 pour une note supérieure à 20', async () => {
    const response = await request(app)
      .post('/students')
      .send({ ...validStudent, grade: 25 });

    expect(response.status).toBe(400);
  });

  it('renvoie 409 pour un email déjà utilisé', async () => {
    const response = await request(app)
      .post('/students')
      .send({ ...validStudent, email: 'ahmed.benali@example.com' });

    expect(response.status).toBe(409);
  });

  it('renvoie 400 pour un email invalide', async () => {
    const response = await request(app)
      .post('/students')
      .send({ ...validStudent, email: 'email-invalide' });

    expect(response.status).toBe(400);
  });

  it('renvoie 400 pour une filière non autorisée', async () => {
    const response = await request(app)
      .post('/students')
      .send({ ...validStudent, field: 'biologie' });

    expect(response.status).toBe(400);
  });

  it('renvoie 400 pour un nom trop court', async () => {
    const response = await request(app)
      .post('/students')
      .send({ ...validStudent, lastName: 'D' });

    expect(response.status).toBe(400);
  });
});

describe('PUT /students/:id', () => {
  it('modifie un étudiant et renvoie 200', async () => {
    const response = await request(app)
      .put('/students/1')
      .send({ ...validStudent, firstName: 'Sarah' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 1, firstName: 'Sarah' });
  });

  it('renvoie 404 pour un identifiant inexistant', async () => {
    const response = await request(app).put('/students/999').send(validStudent);

    expect(response.status).toBe(404);
  });

  it('autorise un étudiant à conserver son propre email', async () => {
    const existingStudent = (await request(app).get('/students/1')).body;
    const response = await request(app)
      .put('/students/1')
      .send({ ...existingStudent, grade: 17 });

    expect(response.status).toBe(200);
    expect(response.body.grade).toBe(17);
  });

  it("renvoie 409 si l'email appartient à un autre étudiant", async () => {
    const response = await request(app)
      .put('/students/1')
      .send({ ...validStudent, email: 'chloe.martin@example.com' });

    expect(response.status).toBe(409);
  });
});

describe('DELETE /students/:id', () => {
  it('supprime un étudiant et renvoie 200', async () => {
    const response = await request(app).delete('/students/1');
    const students = await request(app).get('/students');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(students.body).toHaveLength(4);
  });

  it('renvoie 404 pour un identifiant inexistant', async () => {
    const response = await request(app).delete('/students/999');

    expect(response.status).toBe(404);
  });
});

describe('GET /students/stats', () => {
  it('renvoie toutes les statistiques attendues', async () => {
    const response = await request(app).get('/students/stats');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      totalStudents: 5,
      averageGrade: 13.9,
      studentsByField: {
        informatique: 2,
        mathématiques: 1,
        physique: 1,
        chimie: 1,
      },
    });
    expect(response.body.bestStudent).toMatchObject({ firstName: 'Inès', grade: 18 });
  });
});

describe('GET /students/search', () => {
  it('recherche sans tenir compte de la casse', async () => {
    const response = await request(app).get('/students/search?q=AHMED');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].firstName).toBe('Ahmed');
  });

  it('recherche aussi dans le nom de famille', async () => {
    const response = await request(app).get('/students/search?q=martin');

    expect(response.status).toBe(200);
    expect(response.body[0].lastName).toBe('Martin');
  });

  it('renvoie 400 sans paramètre de recherche', async () => {
    const response = await request(app).get('/students/search');

    expect(response.status).toBe(400);
  });
});
