import { faker } from '@faker-js/faker';
import type { Employee, Dependent } from '../types';
import { MAX_MOCKED_DEPS, NUM_MOCKED_EMPLOYEES } from '../config';

function makeDependent(): Dependent {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
  };
}

function makeEmployee(): Employee {
  const depCount = faker.number.int({ min: 0, max: MAX_MOCKED_DEPS });
  const dependents: Dependent[] = Array.from({ length: depCount }, () => makeDependent());
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
    dependents,
  };
}

export const mockEmployees: Employee[] = Array.from({ length: NUM_MOCKED_EMPLOYEES }, () =>
  makeEmployee(),
);
