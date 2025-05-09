export function validateStudent(student: any): boolean {
  const cinValid =
    typeof student.cin === 'string' && /^\d{8}$/.test(student.cin);
  const firstNameValid =
    typeof student.first_name === 'string' &&
    student.first_name.trim().length > 0;
  const lastNameValid =
    typeof student.last_name === 'string' &&
    student.last_name.trim().length > 0;

  return cinValid && firstNameValid && lastNameValid;
}
